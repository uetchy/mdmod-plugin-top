import fs from "fs";
import globby from "globby";
import fetch from "cross-fetch";
import { join } from "path";

interface PackageJson {
  [index: string]: unknown;
  name: string;
  author?: string;
  description?: string;
  style?: string;
  main?: string;
}

interface Package {
  path: string;
  meta: PackageJson;
}

function getTitle(pkg: Package): string {
  return pkg.meta?.name;
}

function badge(name: string): string {
  return `[![](https://img.shields.io/npm/v/${name}.svg)](https://npmjs.com/package/${name})
[![npm: total downloads](https://flat.badgen.net/npm/dt/${name})](https://npmjs.com/package/${name})
![npm: license](https://flat.badgen.net/npm/license/${name})`;
}

function descFirst<T extends readonly [number, {}]>(a: T, b: T) {
  return b[0] - a[0];
}

async function downloadCount(pkgName: string): Promise<number> {
  const { downloads } = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${pkgName}`
  ).then((res) => res.json());
  return downloads as number;
}

async function createToP({ cwd }: { cwd: string }): Promise<string> {
  const packages = (
    await globby(["packages/*"], {
      onlyDirectories: true,
      cwd,
    })
  ).map((p) => ({
    path: p,
    meta: JSON.parse(
      fs.readFileSync(join(p, "package.json"), "utf8")
    ) as PackageJson,
  }));

  const packagesWithDLCount = await Promise.all(
    packages.map(
      async (pkg) => [(await downloadCount(pkg.meta.name)) || 0, pkg] as const
    )
  );

  const table = packagesWithDLCount
    .sort(descFirst)
    .map(([, pkg]) => {
      const title = getTitle(pkg);
      const {
        path,
        meta: { name, description },
      } = pkg;

      const result = [];
      result.push(`### [${title}](${path})`);
      if (description) {
        result.push("\n" + description);
      }

      result.push(`\n${badge(name)}`);

      result.push(`\n\`\`\`bash
npm install --save ${pkg.meta.name}
# or
yarn add ${pkg.meta.name}
\`\`\``);
      return result.join("\n");
    })
    .join("\n\n");

  return table;
}

export default createToP;

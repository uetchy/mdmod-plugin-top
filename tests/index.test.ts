import execa from "execa";

async function run(...flags: string[]) {
  const { stdout } = await execa("mdmod", flags, {
    cwd: __dirname,
  });
  return stdout;
}

function strip(str: string): string {
  return str.replace(/\n?<!--[\w\W]+?-->\n?/g, "");
}

it("replace", async () => {
  const out = await run("input.md", "--dry-run");
  expect(strip(out)).toBe(`### [pkg1](packages/pkg1)

testPackage

[![](https://img.shields.io/npm/v/pkg1.svg)](https://npmjs.com/package/pkg1)
[![npm: total downloads](https://flat.badgen.net/npm/dt/pkg1)](https://npmjs.com/package/pkg1)
![npm: license](https://flat.badgen.net/npm/license/pkg1)

\`\`\`bash
npm install --save pkg1
# or
yarn add pkg1
\`\`\``);
});

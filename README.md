# mdmod-plugin-top

[mdmod](https://github.com/uetchy/mdmod) plugin to create table of packages.

## Install

```bash
npm i -g mdmod-plugin-top
# or `npm i mdmod-plugin-top` to use it locally
```

## Use

```bash
mdmod README.md
```

It will generate a list of monorepo packages in `/packages/*`.

````md
<!-- START mdmod {use: 'top'} -->

### [pkg1](packages/pkg1)

testPackage

[![](https://img.shields.io/npm/v/pkg1.svg)](https://npmjs.com/package/pkg1)
[![npm: total downloads](https://flat.badgen.net/npm/dt/pkg1)](https://npmjs.com/package/pkg1)
![npm: license](https://flat.badgen.net/npm/license/pkg1)

```bash
npm install --save pkg1
# or
yarn add pkg1
```

<!-- END mdmod -->
````

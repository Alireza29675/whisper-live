import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import { defineConfig } from 'rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';

const pkg = JSON.parse(readFileSync(resolve(cwd(), './package.json')));
const isProd = process.env.NODE_ENV === 'production';

const defaultPlugins = [
  resolvePlugin(),
  commonjs({
    include: /node_modules/,
  }),
];

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

export const dtsConfig = defineConfig({
  input: pkg.source,
  output: {
    file: 'dist/esm/index.d.ts',
    format: 'es',
  },
  plugins: [dts()],
});

export const esmConfig = defineConfig({
  input: pkg.source,
  output: {
    file: pkg.module,
    format: 'esm',
  },
  onwarn,
  plugins: [
    peerDepsExternal({
      includeDependencies: true,
    }),
    ...defaultPlugins,
    typescript(),
    json(),
  ],
});

const globals = pkg.rollup?.globals || {};

export const umdConfig = defineConfig({
  input: pkg.source,
  output: {
    file: pkg.main,
    format: 'umd',
    exports: 'named',
    name: pkg.rollup?.name || 'WhisperLive',
    globals,
  },
  onwarn,
  plugins: [
    peerDepsExternal(),
    ...defaultPlugins,
    typescript(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    terser(),
    json(),
  ],
});

export default isProd ? [esmConfig, umdConfig, dtsConfig] : [esmConfig, dtsConfig];

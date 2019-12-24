import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import { eslint } from 'rollup-plugin-eslint';

import pkg from './package.json';

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'custom-form-builder',
      globals: {
        'aws-sdk/clients/kms': 'KMS',
        'crypto': 'crypto',
      },
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: ['aws-sdk/clients/kms'],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    eslint(),
    commonjs({
      include: 'node_modules/**',
    }),
    builtins(),
  ],
};

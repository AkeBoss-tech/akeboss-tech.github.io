import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    '.next/**',
    'out/**',
    'public/generated-images/**',
    'career/**',
    'talkmap/**',
    'tools/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@next/next/no-img-element': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
])

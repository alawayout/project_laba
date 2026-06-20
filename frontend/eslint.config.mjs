import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	{
		rules: {
			// React Compiler advisory rules: surfaced as warnings, not commit
			// blockers. The compiler is not enabled in next.config.ts, so these
			// flag missed optimizations rather than correctness bugs, and several
			// flagged spots use intentional effect/memoization patterns.
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/preserve-manual-memoization': 'warn',
		},
	},
	// Override default ignores of eslint-config-next.
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),
])

export default eslintConfig

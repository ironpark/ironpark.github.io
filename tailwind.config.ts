import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1440px'
			}
		},
		extend: {
			colors: {
				magnum: {
					'50': '#edf9ff',
					'100': '#d6f2fe',
					'200': '#ace0fc',
					'300': '#78c9f9',
					'400': '#55b1f7',
					'500': '#028df3',
					'600': '#1273e4',
					'700': '#1157bd',
					'800': '#164596',
					'900': '#153a79',
					'950': '#091c41'
				}
			},
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Oxygen',
					'Ubuntu',
					'Cantarell',
					'Fira Sans',
					'Droid Sans',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol'
				],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'SF Mono',
					'Menlo',
					'Consolas',
					'Liberation Mono',
					'monospace'
				]
			}
			// typography: ({theme}) => ({
			//   DEFAULT: {
			//     css: {
			//       code: {
			//         position: 'relative',
			//         borderRadius: theme('borderRadius.md')
			//       }
			//     }
			//   }
			// })
		}
	},
	plugins: [
		typography,
		plugin(function ({ addVariant, matchUtilities, theme }) {
			addVariant('hocus', ['&:hover', '&:focus']);
			// Square utility
			matchUtilities(
				{
					square: (value) => ({
						width: value,
						height: value
					})
				},
				{ values: theme('spacing') }
			);
		})
	]
} satisfies Config;

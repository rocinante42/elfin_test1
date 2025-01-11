import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
              },
            colors: {
                'elfin_yellow': '#e2ff1a'
            },
        }
	},

	plugins: [typography],
} satisfies Config;
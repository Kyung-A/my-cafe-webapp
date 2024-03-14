import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors';

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
      primary: '#F2CB05',
    },
  },
  variants: {},
  plugins: [],
} satisfies Config;

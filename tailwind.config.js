/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lobster: ['"Lobster"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'purple-eminence': '#7E3F8F',
        'purple-eminence-shade': '#713981',
        'purple-eminence-tint': '#8b529a',
        'blue-cerulean': '#3A7CA5',
        'blue-cerulean-shade': '#347095',
        'blue-cerulean-tint': '#4e89ae',
        'green-jade': '#00A878',
        'green-jade-shade': '#00976c',
        'green-jade-tint': '#1ab186',
        'black-rich': '#04080F',
        'black-rich-tint': '#1d2127',
        'white-powder': '#FCFFFC',
      },
    },
  },
  plugins: [flowbite],
};

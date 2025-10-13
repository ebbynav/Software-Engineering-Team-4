/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#00C2CB',
        accent: '#A78BFA',
        'bg-light': '#F8F8FC',
        'card-light': '#FFFFFF',
        'text-primary-light': '#111827',
        'text-secondary-light': '#6B7280',
        'bg-dark': '#0B1020',
        'card-dark': '#0F1724',
        'text-primary-dark': '#E6EEF8',
        'text-secondary-dark': '#6B7280',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
      },
      borderRadius: {
        small: '8px',
        medium: '12px',
        large: '20px',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Text', 'SF Pro Display'],
      },
    },
  },
  plugins: [],
};

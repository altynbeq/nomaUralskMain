module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'], // Content paths
    darkMode: 'class', // Dark mode
    theme: {
        fontFamily: {
            display: ['Comfortaa', 'sans-serif'],
            body: ['Comfortaa', 'sans-serif'],
        },
        extend: {
            animation: {
                'border-animation': 'border-animation var(--duration) linear infinite',
            },
            keyframes: {
                'border-animation': {
                    '0%': { backgroundPosition: '0%' },
                    '100%': { backgroundPosition: '100%' },
                },
            },
            fontSize: {
                14: '14px',
            },
            backgroundColor: {
                'main-bg': '#FAFBFB',
                'main-dark-bg': '#20232A',
                'secondary-dark-bg': '#33373E',
                'light-gray': '#F7F7F7',
                'half-transparent': 'rgba(0, 0, 0, 0.5)',
            },
            borderWidth: {
                1: '1px',
            },
            borderColor: {
                color: 'rgba(0, 0, 0, 0.1)',
            },
            width: {
                400: '400px',
                760: '760px',
                780: '780px',
                800: '800px',
                1000: '1000px',
                1200: '1200px',
                1400: '1400px',
            },
            height: {
                80: '80px',
            },
            minHeight: {
                590: '590px',
            },
            backgroundImage: {
                'hero-pattern': "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
            },
        },
    },
    plugins: [
        function ({ addComponents, theme }) {
            addComponents({
                '.subtle-border': {
                    backgroundColor: theme('colors.white'),
                    border: '1px solid',
                    borderColor: theme('colors.gray.200'),
                    borderRadius: theme('borderRadius.2xl'),
                    boxShadow: theme('boxShadow.custom'),
                    transition: 'box-shadow 300ms ease',
                    '&:hover': {
                        boxShadow: theme('boxShadow.custom-hover'),
                    },
                },
            });
        },
    ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563EB',
                secondary: '#1E3A8A',
                accent: '#38BDF8',
            },
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,ts}"],
    theme: {
        extend: {
            colors: {
                primary: "#8350F0",
            },
            fontFamily: {
                poppins: ['"Poppins"', "sans-serif"],
                syne: ['"Syne"', "sans-serif"],
            },
        },
    },
    plugins: [],
};

// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
            },
        },
    },
}

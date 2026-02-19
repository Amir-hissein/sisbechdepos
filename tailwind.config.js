/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-dark': '#F3F4F6', // Light Gray background (was #121212)
                'bg-panel': '#FFFFFF', // White panel (was #1E1E24)
                'bg-input': '#F9FAFB', // Very light input (was #2B2B36)
                'accent-primary': '#008B8B', // Teal (Keep)
                'accent-secondary': '#002147', // Navy (Keep)
                'text-main': '#111827', // Dark text (was #E0E0E0)
                'text-muted': '#6B7280', // Gray text (was #A0A0A0)
                'danger': '#EF4444', // Red 500
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(0, 139, 139, 0.3)',
            }
        },
    },
    plugins: [],
}

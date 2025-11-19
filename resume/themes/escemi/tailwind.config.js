import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1c3144",
          secondary: "#ecb807",
          paper: "#f5f2ed",
        },
        ink: {
          primary: "#1f2937",
          secondary: "#4b5563",
          muted: "#6b7280",
        },
        accent: {
          highlight: "#fef3c7",
          result: "#d1fae5",
          resultBorder: "#10b981",
        },
      },
      fontFamily: {
        sans: ["Source Sans Pro", "sans-serif"],
      },
      boxShadow: {
        resume: "0 10px 30px rgba(28, 49, 68, 0.12)",
      },
    },
  },
  plugins: [typography],
};

/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ["class"],
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
  	extend: {
		fontFamily: {
			mlight: ["mlight", "sans-serif"],
			mregular: ["mregular", "sans-serif"],
			mmedium: ["mmedium", "sans-serif"],
			msemibold: ['msemibold', "sans-serif"],
			mbold: ['mbold', "sans-serif"],
			mblack: ['mblack', 'sans-serif']
		}
  	}
  },
  plugins: [],
}
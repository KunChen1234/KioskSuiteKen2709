/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
				"roobuck-blue": "#18519c",
				"roobuck-onyx": "#3d3e3d",
        "tag-back": "#808080"
			},
      fontSize:
      {
        "section_title":"80pt"
      }
    },
  },
  plugins: [],
}

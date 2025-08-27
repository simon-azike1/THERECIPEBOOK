module.exports = {
  darkMode: 'class', // Enable dark mode based on the class added to the HTML element
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-blue)',   
        light: 'var(--light-blue)',      
        dark: 'var(--text-dark)',         
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // Tous les fichiers HTML et TypeScript dans src
    "./src/app/**/*.{html,ts}",  // Spécifiquement pour les composants Angular
    "./src/app/main/**/*.{html,ts}",  // Pour vos composants dans le dossier main
    "./src/app/fonctionnalite/**/*.{html,ts}",  // Pour vos composants dans fonctionnalite
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',  // Vous pouvez définir vos couleurs personnalisées ici
        secondary: '#45a049',
        danger: '#dc3545',
      },
    },
  },
  plugins: [],
}

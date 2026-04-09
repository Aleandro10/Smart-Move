@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
@import "leaflet/dist/leaflet.css";
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Outfit", ui-sans-serif, system-ui, sans-serif;
  
  --color-brand-yellow: #FFD166;
  --color-brand-pink: #EF476F;
  --color-brand-blue: #118AB2;
  --color-brand-green: #06D6A0;
  --color-brand-dark: #073B4C;
}

body {
  font-family: var(--font-sans);
  background-color: #F8F9FA;
  color: var(--color-brand-dark);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}
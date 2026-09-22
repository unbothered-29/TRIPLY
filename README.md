# Triply

Triply is a travel discovery and trip-planning web app built with Next.js. Explore curated destinations from around the world, dive into detailed guides for each one, and sketch out a trip plan based on your dates and interests.

## Features

- **Explore destinations** — Browse a curated list of destinations with search and category filtering (Nature, Mountains, Culture, Adventure, etc.)
- **Destination detail pages** — Each destination has its own page with a hero section, description, rating, temperature, and a list of popular places to visit
- **Trip planner** — Pick a destination, set start/end dates, and select your interests to generate a personalized plan
- **Save destinations** — Bookmark destinations you like to revisit later
- **Interactive globe** — Visual globe component used on the About page
- **Responsive, dark-themed UI** — Built with Tailwind CSS

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com) 4
- [ESLint](https://eslint.org/)

## Project Structure

    src/
    ├── app/
    │   ├── page.tsx              # Home page
    │   ├── about/                # About page
    │   ├── explore/               # Explore + search/filter destinations
    │   │   └── [slug]/            # Individual destination detail page
    │   └── plan/                  # Trip planner form
    │       └── [slug]/            # Generated trip plan page
    ├── components/                # Navbar, Hero, Footer, DestinationCard, etc.
    │   └── ui/                    # Reusable UI primitives (e.g. Globe)
    └── data/
        └── destinations.ts        # Destination data (name, country, images, places, etc.)

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-username>/triply.git
cd triply
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Roadmap

- [ ] Persist saved destinations (currently local component state only)
- [ ] Real trip-plan generation logic
- [ ] User accounts

## License

This project is currently unlicensed / for personal/portfolio use.

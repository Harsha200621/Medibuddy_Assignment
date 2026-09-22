# FDA Medicine Search

A fast, responsive web application to search and inspect FDA-approved medicine labels using the OpenFDA Drug Label API. Built with React and React Router.

---

## Live Demo & Repository
- **Live URL:** [Insert your deployed Netlify/Vercel link here]
- **GitHub Repository:** [Insert your repository link here]

---

## Features
- **Instant Search with Debouncing:** Delays API calls by 350ms to prevent spamming requests on every keystroke.
- **In-Memory Caching:** Automatically caches responses for searched terms and unique drug IDs to deliver instant results on repeated lookups without unnecessary network round trips.
- **Request Cancellation:** Integrates `AbortController` in `useEffect` cleanup routines to prevent race conditions and ensure slow responses never overwrite newer queries.
- **Resilient Route Navigation:** Detail pages load directly from router memory when accessed from the search feed, but gracefully re-fetch details using OpenFDA ID queries when refreshed or accessed directly via URL.
- **Robust Error & Empty Handling:** Distinguishes between network failures, pending loading states, and OpenFDA 404 responses (handling zero-match searches smoothly).
- **Responsive Layout:** Clean, accessible clinical UI built from scratch using pure CSS and responsive flex/grid layouts.

---

## Architecture & Component Structure

```text
src/
├── api.js                 # API service, caching layer, and AbortSignal handling
├── App.jsx                # Route definitions (/ and /drug/:id)
├── index.css              # Custom styling, responsive variables, animations
├── main.jsx               # Application root wrapped in BrowserRouter
├── components/
│   └── Card.jsx           # Memoized card displaying safe openfda metadata
└── pages/
    ├── Home.jsx           # Search input, debounce state, and result list
    └── Details.jsx        # Detailed view with fallback network fetching

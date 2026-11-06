# 🚢 NextDocker

NextDocker is a web marketplace for buying shipping containers. Buyers can change the departure/origin port right from the shopping cart to lower shipping costs or pick faster routes.

## ✨ Features

* **Container marketplace:** browse containers, filter by origin port, type and ship date, and open a detail page per container.
* **Smart Cart (`/logistics`):** change the origin port of each item, see freight cost updates, and check out one item or the whole cart.
* **Freight rates (`/rates`):** search rates between ports and compare carriers.
* **Profile (`/profile`):** order history and current cart.
* **Admin dashboard (`/dashboard`):** lane search, rate trends and booking. Protected by a simulated login/sign-up.

## 🛠️ Tech Stack (current)

* **React 19** + **Vite** — UI and dev tooling.
* **React Router 7** — navigation between screens.
* **Tailwind CSS 3** — responsive styling (mobile and desktop).
* **Context API** (`src/context/AppContext.jsx`) — global state: containers, cart, reservations and search params.
* **`localStorage`** — local persistence of the cart, reservations, users and session.
* **lucide-react** — icons.
* Data comes from mock files (`src/data/mockData.js`); there is no backend yet.

## 🗂️ Project structure

```
mi-app/src
├── components/   Navbar, Footer, FreightCard, MarketTrend, RateBreakdown
├── context/      AppContext (global state + localStorage)
├── data/         mockData.js
├── pages/        LandingPage, ProductDetail, Logistics, Rates, Profile, dashboard/
└── utils/        auth.js (simulated authentication)
```

## ⚙️ Setup & Installation

Requires [Node.js](https://nodejs.org/) 18 or higher.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jlouisce/NextDocker.git
   cd NextDocker/mi-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the dev server** (http://localhost:5173):
   ```bash
   npm run dev
   ```
4. **Other scripts:** `npm run build`, `npm run preview`, `npm run lint`.

## 🔐 About the login

Login and sign-up are a **demo only**: users are stored in the browser's `localStorage` (the password in plain text) and there is no real server-side authentication. Do not use real credentials.

## 🧭 Roadmap

Planned for a future version, not yet in the code: TypeScript, a Supabase backend (database and real authentication), third-party freight-rate APIs and Firebase Hosting.

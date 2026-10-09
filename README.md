# 🚢 NextDocker

NextDocker is a global e-commerce platform specialized in the commercialization of shipping containers. Designed to deliver maximum logistics flexibility and cost efficiency, it empowers customers to buy containers located anywhere in the world with advanced routing options: users can dynamically change the departure/origin location right from the shopping cart to lower shipping costs or select faster delivery routes.

## ✨ Key Features

* **Global Container Marketplace:** Browse and purchase shipping containers available in ports and depots worldwide.
* **Smart Logistics Optimization:** Enable buyers to modify the origin port to prioritize either cost savings or faster transit times.
* **Real-Time Freight Calculation:** Integrated with third-party logistics APIs to calculate real-time freight pricing from point A (origin) to point B (destination).
* **Secure & Scalable Architecture:** Reliable user authentication, session management, and real-time database queries.

## 🛠️ Tech Stack

Built with a modern tech stack to ensure optimal performance, scalability, and developer experience:

* **Frontend:** [React](https://reactjs.org/) — Interactive user interface library.
* **Language:** [TypeScript](https://www.typescriptlang.org/) — Type-safe code for reliability and seamless scalability.
* **Backend & Database:** [Supabase](https://supabase.com/) — PostgreSQL database and authentication.
* **Logistics Engine:** External RESTful APIs for real-time shipping rate lookup.
* **Deployment & Hosting:** [Firebase Hosting](https://firebase.google.com/) — Fast, secure, and globally distributed static hosting.

## 🚀 Prerequisites

Before setting up the project locally, make sure you have installed and configured the following:

* [Node.js](https://nodejs.org/) (v16 or higher)
* Package manager: `npm` or `yarn`
* A [Supabase](https://supabase.com/) account with an active project.
* A [Firebase](https://firebase.google.com/) account with the Firebase CLI installed (`npm install -g firebase-tools`).
* API keys from your designated shipping/freight rate service provider.

## 📌 Estado actual (MVP v0.2)

El código actual es un **frontend-only** en JavaScript (React + Vite + Tailwind + React Router) dentro de `mi-app/`. Usa datos mock (`src/data/mockData.js`) y persiste en `localStorage`. TypeScript, Supabase, Firebase y la API de fletes descritos arriba son el stack objetivo y aún no están integrados.

Páginas: Landing/Marketplace (`/`, `/marketplace`), Tracking, Logistics, Rates y Profile.

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jlouisce/NextDocker.git
   cd NextDocker/mi-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the dev server:**
   ```bash
   npm run dev
   ```
4. **Other scripts:** `npm run build`, `npm run preview`, `npm run lint`.

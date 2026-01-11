# WizzyWorks Webapp

This is the frontend webapp of the WizzyWorks virtual firework experience from the course DH2413 Advanced Graphics and Interaction in KTH, 2025. The webapp is designed to run on a web browser on mobile phones, where the user can interact with the other parts of the experience.

This React-based web application is built with Vite and Tailwind CSS.

## Prerequisites

- Node.js (version 18 or higher)
- npm

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wizzyworks-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

- Start the development server:
  ```bash
  npm run dev
  ```
  The app will be available at `http://localhost:5173`.

  To access from mobile devices on the same local network, run:
  ```bash
  npm run dev -- --host
  ```
  Then, find your computer's IP address (e.g., via `ipconfig` on Windows or `ifconfig` on macOS/Linux) and access `http://<IP>:5173` from your phone.

- Build for production:
  ```bash
  npm run build
  ```

- Preview the production build:
  ```bash
  npm run preview
  ```

  To access from mobile devices on the same local network, run:
  ```bash
  npm run preview -- --host
  ```
  Then, find your computer's IP address and access `http://<IP>:4173` from your phone.

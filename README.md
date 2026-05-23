# Fleet Tracking Dashboard

A real-time fleet monitoring web application built with React.

## What This App Does

This dashboard lets you monitor a fleet of 25 vehicles in real time. You can see every vehicle's current status, speed, location, driver details, and battery/fuel levels. The data updates automatically via a WebSocket connection roughly every 3 minutes without needing to refresh the page.

---

## Features

- **Vehicle list table** — Shows all vehicles with status badges, speed, destination, ETA, and GPS coordinates
- **Fleet statistics panel** — Total vehicles, average speed, number moving, last update time
- **Status filters** — Filter vehicles by All / Idle / En Route / Delivered with live counts
- **Vehicle detail modal** — Click any row to see full details including battery and fuel progress bars
- **Live WebSocket updates** — Data refreshes automatically; a pulsing "Live" badge shows connection status
- **Auto-reconnect** — If the WebSocket drops, the app reconnects after 5 seconds

---

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
src/
├── components/
│   ├── Header.jsx        — Top bar with title and Live badge
│   ├── Sidebar.jsx       — Status filters and statistics panel
│   ├── VehicleTable.jsx  — The main vehicles data table
│   └── VehicleModal.jsx  — Pop-up modal with full vehicle details
├── hooks/
│   └── useWebSocket.js   — Custom hook that manages the WebSocket connection
├── services/
│   └── api.js            — All HTTP requests to the REST API (using axios)
├── utils/
│   └── formatters.js     — Helper functions: dates, locations, status badges
├── App.js                — Root component: holds all state and connects everything
└── App.css               — Custom styles (colors, layout, badges, modal, animations)
```

---

## File-by-File Explanation

### `src/services/api.js`
This file is the only place that talks to the backend. It uses **axios** to make HTTP requests. There are 4 functions:
- `fetchVehicles()` — gets the full list of all 25 vehicles
- `fetchVehicleById(id)` — gets one vehicle by its ID
- `fetchVehiclesByStatus(status)` — gets vehicles filtered by status (idle / en_route / delivered)
- `fetchStatistics()` — gets the fleet summary numbers

All functions return a promise. The base URL (`https://case-study-26cf.onrender.com`) is defined once at the top.

### `src/hooks/useWebSocket.js`
This is a **custom React hook** — a reusable piece of logic, not a visual component. It:
1. Opens a WebSocket connection to `wss://case-study-26cf.onrender.com` when the component mounts
2. Calls the `onUpdate` function (passed in by App.js) whenever a new message arrives
3. If the connection closes or errors, it waits 5 seconds then reconnects automatically
4. Returns `{ wsConnected }` — a boolean that tells the UI whether the socket is open

Using a custom hook keeps the WebSocket logic separated from the visual code.

### `src/utils/formatters.js`
Pure helper functions (no React, no API calls):
- `formatDate(iso)` — converts an ISO timestamp to `"DD/MM/YYYY, HH:MM:SS"` format
- `formatLocation(lat, lng)` — formats coordinates to 4 decimal places: `"37.7575, -122.4340"`
- `getStatusConfig(status)` — maps a status string to a display label and a CSS class name for the badge
- `formatSpeed(speed)` — adds "mph" to a number
- `formatETA(iso)` — extracts just the HH:MM time from a timestamp

### `src/App.js`
The root of the application. This is where all the **state lives**:
- `vehicles` — the array of vehicle objects currently displayed
- `statistics` — the fleet summary (total, idle count, en_route count, etc.)
- `selectedVehicle` — the vehicle whose modal is open (null means no modal)
- `statusFilter` — which filter radio button is selected
- `loading` — shows the spinner while data is fetching

**Data flow:**
1. On first load, `useEffect` calls `fetchStatistics()` once
2. A second `useEffect` watches `statusFilter` — whenever it changes it re-fetches vehicles (all or filtered)
3. The `useWebSocket` hook is used here; its `onUpdate` callback merges new vehicle data into the existing list
4. State is passed down to child components as props

### `src/components/Header.jsx`
The top bar. Receives `wsConnected` and shows the pulsing green "Live" badge when connected.

### `src/components/Sidebar.jsx`
The left panel. Receives `statistics`, `statusFilter`, and `onFilterChange`. Renders:
- A live/connecting status indicator
- Radio buttons for each status (showing counts from `statistics`)
- A 2x2 grid of fleet statistics cards

### `src/components/VehicleTable.jsx`
The data table. Receives `vehicles`, `onVehicleClick`, and `loading`.
- Shows a spinner when `loading` is true
- Renders one table row per vehicle
- Clicking a row calls `onVehicleClick(vehicle)` which sets `selectedVehicle` in App.js

### `src/components/VehicleModal.jsx`
The pop-up detail view. Receives `vehicle` (or null) and `onClose`.
- Returns null immediately if `vehicle` is null (nothing to show)
- Displays a semi-transparent overlay; clicking outside the modal closes it
- Shows vehicle details in a 2-column grid
- Battery and fuel use colored progress bars (turns red if below 30%)

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vehicles` | GET | All vehicles |
| `/api/vehicles/{id}` | GET | Single vehicle |
| `/api/vehicles/status/{status}` | GET | Vehicles by status |
| `/api/statistics` | GET | Fleet summary stats |

**WebSocket:** `wss://case-study-26cf.onrender.com`
Pushes vehicle updates approximately every 3 minutes.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Create React App | Project scaffolding |
| Bootstrap 5 | Base CSS utilities |
| Axios | HTTP requests |
| Native WebSocket API | Real-time updates |

---

## Build for Production

```bash
npm run build
```

Creates an optimized bundle in the `build/` folder ready for deployment.

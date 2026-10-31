# Timed Auction — Live Bidding & Product Scheduling Platform

A clean, modern, responsive timed auction web application built with **React**, **Vite**, and **Tailwind CSS**. Designed with a minimal white/grey aesthetic, subtle blue accents, full Light/Dark mode support, multi-product management, time slot allocation, real-time bid validation, localStorage persistence, and automatic winner declaration.

---

## 🔄 The 5-Step Auction Flow

1. **Admin Manually Adds the Product**
   - Click **"+ Add Product"** in the navigation bar or lot manager.
   - Enter product title, subtitle, image (paste URL, select presets, or upload a file directly), and description.

2. **Admin Sets the Starting Base Price**
   - Set the initial base price (e.g., `$2,500` or `$150,000`). All participant bids must strictly exceed this starting price or the active highest bid.

3. **Admin Allocates & Schedules the Bidding Time Slot**
   - **Start Immediately**: Choose duration (e.g. 5m, 10m, 15m, 30m, 1h, 24h).
   - **Schedule Future Time Slot**: Choose exact start date & time, and close date & time.
   - Products scheduled in the future show countdown to start (*"Bidding Starts In: 14m 20s"*) and bidding opens automatically when the scheduled slot arrives (or immediately via the *"Launch Bidding Now"* button).

4. **Users Participate in Live Bidding**
   - Once the time slot is active, participants enter their name and submit bids.
   - Strict validation: Bids equal to or below the current highest bid are immediately rejected with clear feedback.
   - Instant updates: Highest bid, leading bidder avatar, and chronological bid history update immediately without page refresh.

5. **Timer Ends → Highest Bidder Wins the Product**
   - The moment the countdown reaches zero, bidding closes permanently.
   - The product is automatically awarded to the highest bidder.
   - Celebratory winner modal opens with confetti fireworks and full transaction certificate details.

---

## 🌟 Key Features

- **Multi-Product Lot Management**: Browse all lots, filter by *All*, *Live*, *Upcoming*, or *Sold*, and switch between products seamlessly.
- **Time Slot Scheduling**: Full support for immediate and future scheduled bidding windows.
- **Minimalist Clean UI**: Minimal white and grey color palette with subtle blue accents, clean typography, and zero clutter.
- **Light / Dark Mode Toggle**: Instant theme switching via navbar toggle (persisted in `localStorage`).
- **Synchronized Countdown Timer**: High-precision ticker showing Days, Hours, Minutes, and Seconds with urgency states under 60 seconds.
- **Instant State Updates & Live Bid History**: Chronological log with rank numbers, avatars, amounts, and relative timestamps (`"just now"`, `"12s ago"`).
- **LocalStorage Persistence**: Entire catalog, scheduled slots, bids, and user names persist across browser sessions.
- **Demo Controls**: Fast-forward timers, test outbidding with simulated competitors, or reset state in 1 click.

---

## 🏗️ Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx                # Header with status pill, Add Product button, theme toggle
│   ├── ProductList.jsx           # Multi-product catalog with status filters & lot selector
│   ├── AddProductModal.jsx       # Admin form to add products, set base price & allocate time slot
│   ├── ItemShowcase.jsx          # Image zoom, product specs, & description tabs
│   ├── CountdownTimer.jsx        # Dual-mode timer: starts-in countdown & time-remaining countdown
│   ├── CurrentBidCard.jsx        # Highest bid, base price, and leading bidder spotlight
│   ├── BidForm.jsx               # Inputs, quick increments, upcoming notice, & strict validation
│   ├── BidHistory.jsx            # Chronological live log with ranks & avatars
│   ├── WinnerModal.jsx           # Confetti celebration & winning lot certificate
│   ├── DemoControlsModal.jsx     # Speed up timer, instant end, reset options
│   └── Toast.jsx                 # Real-time feedback alerts
├── data/
│   └── auctionItem.js            # Initial multi-product catalog & image presets
├── hooks/
│   ├── useAuction.js             # Centralized multi-product state, time slots, bidding, storage
│   └── useSound.js               # Web Audio API chimes, warning tones, and fanfare
├── utils/
│   └── formatters.js             # Currency, dates, relative time, and avatar helpers
├── App.jsx                       # Main responsive dashboard layout
├── index.css                     # Tailwind CSS v4 & custom design tokens
└── main.jsx                      # React 19 root
```

---

## 🚀 Running the Application

```bash
# Start Vite development server
npm run dev

# Run production build
npm run build
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

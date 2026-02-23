# System Design Document: Conference Event Planner

## 1. Introduction

### 1.1 Project Overview
The Conference Event Planner is a single-page React application designed to help users plan conference events by selecting venues, audio-visual (AV) equipment, meals, and calculating total costs. It provides an interactive interface for users to input event details, view selections, and get a breakdown of expenses. The app is frontend-only, with no backend integration, relying on client-side state management for data handling.

### 1.2 Objectives
- Enable users to select event components (venue, AV, meals) and compute total costs dynamically.
- Provide a responsive, user-friendly interface with navigation between sections.
- Ensure maintainable code structure using modern React patterns and state management.
- Deploy easily to static hosting platforms like GitHub Pages.

### 1.3 Scope
- **In Scope**: Frontend UI/UX, client-side state management, cost calculations, responsive design.
- **Out of Scope**: Backend API integration, user authentication, persistent data storage, payment processing.

## 2. Architecture Overview

### 2.1 High-Level Architecture
The application follows a **client-side single-page application (SPA)** architecture:
- **Frontend Framework**: React 18 with Vite as the build tool for fast development and bundling.
- **State Management**: Redux Toolkit (RTK) for centralized state handling, using slices for modular reducers (venue, AV, meals).
- **Routing**: No external router (e.g., React Router); uses conditional rendering in App.jsx based on user interactions (e.g., button clicks to show/hide sections).
- **Styling**: Plain CSS with modular files per component; potential for CSS variables in a design system.
- **Build & Deployment**: Vite for development/build; gh-pages for deployment to GitHub Pages.
- **Dependencies**:
  - React, React-DOM, React-Redux.
  - @reduxjs/toolkit for Redux.
  - No external UI libraries; custom CSS.

The app structure is:
```
Conference-Event-planner/
├── public/          # Static assets (images: AUdi.png, bgevent.png, conference.png)
├── src/
│   ├── components/  # (Implicit: Home.jsx, ConferenceEvent.jsx, TotalCost.jsx, AboutUs.jsx)
│   ├── slices/      # Redux slices: venueSlice.js, avSlice.js, mealsSlice.js
│   ├── store.js     # Redux store configuration
│   ├── App.jsx      # Root component with conditional rendering
│   ├── main.jsx     # Entry point
│   └── CSS files    # Styling (App.css, Home.css, etc.)
├── package.json     # Dependencies and scripts
├── vite.config.js   # Vite configuration
└── README.md        # Project documentation
```

### 2.2 Technology Stack
- **Language**: JavaScript (ES6+)
- **Framework**: React 18
- **State Management**: Redux Toolkit 2.2.3
- **Build Tool**: Vite 5.4.19
- **Linting**: ESLint with React plugins
- **Deployment**: GitHub Pages via gh-pages
- **Version Control**: Git with GitHub Actions for CI/CD (deploy.yml)

## 3. Components Structure

### 3.1 Key Components
- **App.jsx**: Root component. Manages global layout (navbar), state for visibility of sections (e.g., home, event planner, total cost), and renders child components conditionally.
- **Home.jsx**: Landing page with background image, welcome message, and "Get Started" button to navigate to event planning.
- **ConferenceEvent.jsx**: Core planning interface.
  - Venue selection: Radio buttons or cards for venue options with quantity input.
  - AV selection: Similar to venue, with cost calculations.
  - Meals selection: Checkboxes for meal types with quantity inputs.
  - Displays selected items in tables or lists.
- **TotalCost.jsx**: Displays breakdown of costs (venue, AV, meals) and grand total.
- **AboutUs.jsx**: Static page with company information.
- **Navbar**: Shared across pages (in ConferenceEvent.css); includes logo, nav links (Home, About), and buttons (e.g., Details).

### 3.2 Component Hierarchy
```
App.jsx
├── Navbar (embedded)
├── Home.jsx (default view)
├── ConferenceEvent.jsx (on "Get Started")
│   ├── Venue Selection
│   ├── AV Selection
│   ├── Meals Selection
│   └── Items Table/Display
└── TotalCost.jsx (integrated or separate view)
```

Components use Redux hooks (`useSelector`, `useDispatch`) to read/update state.

## 4. State Management

### 4.1 Redux Store Configuration
- **store.js**: Creates the Redux store using `configureStore` from RTK.
  - Reducers: Combined from slices (venue, av, meals).
  - No middleware beyond defaults (e.g., Redux Thunk for async if needed in future).

### 4.2 Slices (Modular Reducers)
Each slice manages a domain of the app state:
- **venueSlice.js**:
  - State: `{ selectedVenue: null, quantity: 1, cost: 0 }`
  - Actions: `selectVenue(venueData)`, `updateQuantity(qty)`
  - Selectors: `getVenueCost()`, `getVenueDetails()`
- **avSlice.js**:
  - State: `{ selectedAV: null, quantity: 1, cost: 0 }`
  - Actions: Similar to venue.
- **mealsSlice.js**:
  - State: `{ selectedMeals: [] }` (array for multiple checkboxes)
  - Actions: `toggleMeal(mealId)`, `updateMealQuantity(mealId, qty)`
  - Supports multiple meals with individual quantities.

### 4.3 Global State Shape
```
{
  venue: { selectedVenue, quantity, cost },
  av: { selectedAV, quantity, cost },
  meals: { selectedMeals: [{ id, name, quantity, cost }] },
  ui: { currentView: 'home' | 'planner' | 'total' }  // If added for navigation
}
```

Costs are calculated in selectors or components using simple arithmetic (e.g., baseCost * quantity).

## 5. Data Flow

### 5.1 User Interactions to State Updates
1. **User Input**: User selects venue/AV via radio/click → Dispatch action (e.g., `selectVenue({ name: 'Hall A', cost: 5000 })`).
2. **State Update**: Reducer updates slice state, recalculates cost.
3. **Re-render**: Components re-render via `useSelector` to reflect new state (e.g., update table, total cost).
4. **Cost Calculation**: In TotalCost.jsx, sum costs from all slices: `total = venue.cost + av.cost + meals.reduce((sum, meal) => sum + meal.cost * meal.quantity, 0)`.
5. **Navigation**: Button clicks dispatch UI actions or use local state to toggle visibility (e.g., `setShowPlanner(true)` in App.jsx).

### 5.2 Data Flow Diagram (Textual)
```
User Input (Select Venue) → Dispatch(selectVenue) → Reducer (venueSlice) → Updated State → Re-render (ConferenceEvent.jsx) → Display Updated Table
                                                                 ↓
                                                       TotalCost.jsx (useSelector) → Calculate & Display Total
```

No external data fetching; all data is hardcoded in slices or components (e.g., venue options as arrays).

## 6. User Flow

1. **Landing (Home)**: User sees welcome screen → Clicks "Get Started" → Navigates to planner.
2. **Event Planning (ConferenceEvent)**:
   - Select venue → Input quantity → Cost updates.
   - Select AV → Input quantity.
   - Select meals (checkboxes) → Input quantities per meal.
   - View real-time table of selections.
3. **Cost Summary (TotalCost)**: Auto-updates as selections change; shows breakdown.
4. **Navigation**: Navbar links to Home/About; back buttons to previous sections.
5. **Responsive**: Mobile view stacks elements vertically.

## 7. Non-Functional Aspects

### 7.1 Performance
- Vite ensures fast HMR and builds.
- Redux selectors memoized implicitly via RTK.
- No heavy computations; simple arithmetic.

### 7.2 Security
- Client-side only; no sensitive data.
- Input validation: Basic (e.g., quantity > 0).

### 7.3 Accessibility
- Semantic HTML in components.
- ARIA labels for inputs/buttons.
- High contrast colors (e.g., #133b6a on white).

### 7.4 Responsiveness
- Media queries in CSS for mobile (<700px): Stack nav, reduce sizes, full-width elements.

## 8. Deployment

### 8.1 Build Process
- `npm run build`: Generates `dist/` folder with optimized assets.
- `npm run deploy`: Uses gh-pages to push to `gh-pages` branch.

### 8.2 CI/CD
- `.github/workflows/deploy.yml`: Automates build/deploy on push to main.

### 8.3 Hosting
- GitHub Pages: Serves static files from `dist/`.

## 9. Future Enhancements

- **Backend Integration**: Add API for dynamic venues/meals (e.g., Node.js/Express).
- **Routing**: Implement React Router for better navigation.
- **Persistence**: LocalStorage for saving plans; or database for user accounts.
- **Design System**: CSS-in-JS (e.g., Styled Components) or Tailwind for consistency.
- **Testing**: Add Jest/RTL for unit tests; Cypress for E2E.
- **Analytics**: Track user selections for improvements.
- **Internationalization**: Support multiple currencies/languages.

## 10. Assumptions & Risks
- Assumptions: Users have modern browsers; no offline support needed.
- Risks: State bloat if more features added; mitigate with normalized Redux state.
- Scalability: Fine for single-user; backend needed for multi-user.

This document serves as a blueprint for the current implementation and guides future development.

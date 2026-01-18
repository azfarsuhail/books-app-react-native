# Shadiyana Book Explorer

A React Native mobile application developed.

## 🏗 Architecture Decisions

### 1. State Management: TanStack Query (React Query)

I chose React Query over Redux or Context API because the app's primary state is **server state** (search results). React Query handles caching, deduping, and loading states out-of-the-box, which significantly reduces boilerplate code compared to a custom `useEffect` implementation.

### 2. Styling: NativeWind (Tailwind)

Used for rapid UI iteration. It allows for consistent spacing and typography tokens (e.g., `p-4`, `text-xl`) without the overhead of maintaining a massive StyleSheet object.

### 3. API & Data Handling

- **Debouncing:** Implemented a custom hook to debounce search inputs (500ms) to prevent hitting the Open Library API rate limits.
- **Data Normalization:** The Open Library API returns raw data with inconsistent fields. I implemented an adapter pattern in `services/api.ts` to sanitize this data before it reaches the UI components.
- **Mocking:** Since the generic Search API does not return "Star Ratings," I generated a deterministic mock rating based on the book hash for UI demonstration purposes (per the Figma design).

## 🚀 Trade-offs & Future Improvements

Given the time constraints, I made a few pragmatic choices:

- **Testing:** Added unit tests for the critical Search flow. In a production environment, I would add E2E tests using Maestro or Detox.
- **Error Boundaries:** Currently handling errors via simple UI feedback. A production app would require a global Error Boundary (e.g., Sentry) to catch crash loops.
- **Types:** Some API responses are typed loosely (`any`). I would generate strict interfaces using something like Zod or quicktype.io for a real release.

## 🛠 Running the Project

1. `npm install`
2. `npx expo start -c` (Clear cache recommended for NativeWind)
3. `npm test` to run the Jest suite.

# Frontend-Only Supplier Management App

This is a standalone frontend variant of the Supplier Management App, built for Scenario 1 (Frontend Developer Challenge). 

It contains **no real backend**. Instead, all data persistence and business logic rules (such as VAT ID uniqueness, strict status transitions, and the four-eyes principle) are enforced by a simulated `MockSupplierService` that uses `localStorage` to persist data.

## Setup & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Run Automated Tests**
   ```bash
   npm test
   ```

## Architecture
- **Vite + React**: Fast build tool and modern component library.
- **Design System**: A sleek, dark-mode CSS implementation using standard variables for high readability and performance without bloating the project with heavy CSS frameworks.
- **Mock Data Layer**: The `apiClient.ts` perfectly mimics a real HTTP client, but routes all requests to `MockSupplierService.ts`. This service uses simulated `setTimeout` delays to force the UI into showing realistic loading states, and throws exact error strings when business rules are violated.
- **State Management**: Handled via standard React hooks (`useState`, `useEffect`).

## Assumptions & Limitations
- **Data Persistence**: Because there is no central database, data is persisted using browser `localStorage`. This is a limitation as data is isolated to the specific browser and device, meaning it cannot be shared across different users or sessions.
- **Authentication**: Simulated using a simple dropdown in the UI. In a real application, an authentication context/provider with JWT validation would be used.
- **Pagination**: Assuming the number of records is small for this prototype, so pagination is not implemented.

## What I'd Improve with More Time
- Implement robust form validation using `React Hook Form` and `Zod` rather than manual state checking.
- Use `React Query` to handle fetching, caching, and invalidation natively instead of manual `useEffect` fetching.
- Add end-to-end (E2E) testing with Cypress or Playwright to click through the actual DOM elements.

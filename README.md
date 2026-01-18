# Book Explorer App 

A high-performance mobile application for exploring books, built with React Native and Expo. This project demonstrates modern mobile architecture, focusing on efficient data fetching, clean UI/UX, and robust state management.

##  Key Features

* **Dynamic Search:** Real-time book search with debounced inputs to minimize API calls.
* **Optimized UI/UX:** Smooth transitions, loading skeletons, and a clean, accessible interface.
* **Offline First:** Caching strategies to ensure the app remains usable even with spotty network connections.
* **Detail View:** Comprehensive book details including descriptions, authors, and cover art.

##  Tech Stack & Architecture

* **Framework:** [Expo](https://expo.dev/) (Managed Workflow)
* **UI Library:** React Native Paper / Custom Components
* **State Management & Data Fetching:** **TanStack Query (React Query)**
    * *Why?* We chose TanStack Query over Redux for this use case to handle server state efficiently. It provides out-of-the-box caching, background updates, and stale-data handling, significantly reducing boilerplate code for API interactions.
* **Navigation:** React Navigation (Native Stack)

##  Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/book-explorer.git](https://github.com/your-username/book-explorer.git)
    cd book-explorer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npx expo start
    ```

##  How to Build (APK)

To generate a standalone Android APK for testing or distribution, follow these steps using EAS Build.

**Prerequisites:**
* Ensure you have `eas-cli` installed: `npm install -g eas-cli`
* Login to your Expo account: `eas login`

**Build Command:**
To build the APK (Android Package Kit):

```bash
eas build -p android --profile preview

```

*Note: The `--profile preview` flag is configured in `eas.json` to generate an installable APK file rather than an App Bundle (AAB) intended for the Play Store.*

##  Running Tests

To run the test suite:

```bash
npm test

```


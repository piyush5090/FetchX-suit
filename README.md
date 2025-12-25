# FethX-Suit

FethX-Suit is a comprehensive tool designed for searching, browsing, and bulk-downloading stock media from multiple sources. It provides a seamless experience for finding and acquiring assets from Pexels, Unsplash, and Pixabay.

## Architecture

The suite is built with a modern, decoupled architecture, consisting of three main components:

### 1. Backend (`FetchX--backend`)

The backend is a Node.js application using the Express.js framework. It acts as a central API gateway, aggregating data from multiple stock media providers.

*   **API Gateway:** It provides a single, unified set of endpoints for the frontend and browser extension to interact with.
*   **Media Metadata:** Instead of handling file downloads directly, the backend fetches and normalizes metadata (such as titles, descriptions, and download URLs) from the different sources.
*   **Search and Aggregation:** It includes endpoints for:
    *   `/search`: Counting the total number of available media for a given search query across all providers.
    *   `/metadata`: Retrieving paginated and detailed lists of media metadata.

### 2. Frontend (`FetchX--frontend`) - Nexus By fetchX

The frontend is a modern, single-page application (SPA) built with React. It serves as the primary user interface for the FethX-Suit.

*   **User Interface:** Provides an intuitive and responsive interface for searching and browsing media.
*   **Dynamic Search:** Users can search for media and see the number of available assets from each provider in real-time.
*   **Media Grid:** Displays media results in a clean, organized grid, allowing users to easily browse through the available assets.
*   **State Management:** Uses Redux Toolkit for efficient and predictable state management.

### 3. Browser Extension (`FetchX--extension`) - Flux By FetchX

The browser extension is the workhorse of the suite, responsible for the client-side operations, including downloading.

*   **Bulk Downloading:** The extension likely uses the metadata provided by the backend to handle the bulk downloading of media files.
*   **Browser Integration:** It integrates with the browser to provide a seamless downloading experience, managing the process in the background.

## Features

*   **Unified Search:** Search for media across Pexels, Unsplash, and Pixabay from a single interface.
*   **Aggregated Results:** See the total count of available media from each provider for your search term.
*   **Paginated Browsing:** Browse through media results with a clean, paginated interface.
*   **Bulk Downloading:** (Handled by the extension) Download multiple media assets at once.

## Technology Stack

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **HTTP Client:** Axios

### Frontend
*   **Framework:** React
*   **Build Tool:** Vite
*   **State Management:** Redux Toolkit
*   **Styling:** Tailwind CSS

### Browser Extension
*   **Core:** JavaScript, HTML, CSS

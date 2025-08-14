# Skeptic-Digital-AI


Skeptic-Digital-AI, also known as "The Digital Skeptic," is an AI-powered tool designed to help users critically analyze news articles. It scrapes article content from a given URL and leverages Google Gemini AI to provide a structured report, empowering critical thinking in an age of information overload.

## Table of Contents

- [Key Features](#key-features)

- [Architecture Overview](#architecture-overview)

- [Tech Stack](#tech-stack)

- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)

  - [Installation](#installation)

- [Configuration](#configuration)

- [Usage](#usage)

- [Project Structure](#project-structure)

- [Scripts](#scripts)

- [Testing](#testing)

- [License](#license)

- [Acknowledgements](#acknowledgements)

## Key Features

*   **Article Scraping**: Extracts main content and title from any provided news article URL using Cheerio.

*   **AI-Powered Critical Analysis**: Utilizes Google Gemini AI to generate a structured report, including core claims, language/tone analysis, potential red flags, and verification questions.

*   **Audio Narration**: Provides an audio version of the analysis report for accessibility and convenience.

*   **Intuitive User Interface**: Built with Next.js and Shadcn UI for a clean and responsive user experience.

*   **Real-time Feedback**: Displays analysis results directly on the page with loading and error states.

## Architecture Overview and Approach

Skeptic-Digital-AI is a full-stack web application built with Next.js. The frontend provides a user interface for submitting article URLs and displaying analysis reports. The backend is implemented using Next.js API routes, which handle the core logic.

When a user submits a URL:
1.  The frontend sends the URL to a Next.js API route (`/api/analyze`).
2.  The API route uses `cheerio` to scrape the content (title and main body) from the provided URL.
3.  The scraped content is then sent to the Google Gemini AI API for critical analysis.
4.  The AI's structured analysis report is returned to the API route.
5.  Finally, the API route sends the complete analysis back to the frontend, where it is parsed and displayed to the user, along with an option for audio narration.

## Tech Stack

| Area | Tool | Version |
|---|---|---|
|---|---|---|
| Frontend | Next.js | 15.2.4 |
| Frontend | React | 19.x |
|---|---|---|
| Frontend | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.1.9 |
|---|---|---|
| UI Components | Shadcn UI | Latest |
| Web Scraping | Cheerio | Latest |
|---|---|---|
| AI/ML | Google Gemini API | Latest |
| Package Manager | pnpm | 9.x |
|---|---|---|



## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (v18.x or higher)

*   pnpm (v9.x or higher)

### Installation

1.  **Clone the repository**:

```bash
git clone https://github.com/SpandanM110/Skeptic-Digital-AI.git

cd Skeptic-Digital-AI

```
2.  **Install dependencies**:

```bash
pnpm install

```
3.  **Set up environment variables**:
    Create a `.env.local` file in the root of the project and add your Google Gemini AI API key:

```env
NEXT_PUBLIC_GOOGLE_AI_API_KEY=YOUR_GEMINI_API_KEY_HERE

```
You can obtain a Google Gemini API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

## Configuration

The application uses environment variables for sensitive information and external API keys.

| ENV | Description | Example |
|---|---|---|
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_AI_API_KEY` | Your API key for accessing the Google Gemini AI service. | `AIzaSyB_YOUR_KEY_HERE` |



## Usage

To run the application in development mode:

1.  **Start the development server**:

```bash
pnpm dev

```
2.  **Open in your browser**:
    The application will be accessible at `http://localhost:3000`.

3.  **Analyze an article**:

    *   Enter the URL of a news article into the input field.

    *   Click the "Analyze" button.

    *   The AI-generated critical analysis report will be displayed on the page.

    *   You can also use the "Audio Book" feature to listen to the analysis.

## Project Structure

```
.

├── app/
│   ├── api/

│   │   └── analyze/
│   │       └── route.ts         # Next.js API route for article analysis

│   ├── globals.css              # Global CSS styles
│   ├── layout.tsx               # Root layout for the application

│   ├── loading.tsx              # Loading component
│   └── page.tsx                 # Main application page (frontend)

├── components/
│   ├── analysis-report.tsx      # Component to display the AI analysis

│   ├── audio-controls.tsx       # Component for text-to-speech controls
│   ├── theme-provider.tsx       # Theme provider component

│   └── ui/                      # Shadcn UI components
│       ├── accordion.tsx

│       ├── alert-dialog.tsx
│       ├── alert.tsx

│       ├── ... (many other UI components)
│       └── button.tsx

├── hooks/
│   └── use-text-to-speech.ts    # Custom hook for text-to-speech functionality

├── lib/
│   └── utils.ts                 # Utility functions (e.g., for Tailwind CSS class merging)

├── public/                      # Static assets
├── .env.local.example           # Example environment variables file

├── components.json              # Shadcn UI configuration
├── next-env.d.ts                # Next.js environment type definitions

├── package.json                 # Project dependencies and scripts
├── pnpm-lock.yaml               # pnpm lock file

├── postcss.config.mjs           # PostCSS configuration
├── README.md                    # This README file

├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration

```
## Scripts

The following scripts are available in `package.json`:

| Command | Description |
|---|---|
|---|---|
| `dev` | Starts the Next.js development server. |
| `build` | Builds the application for production. |
|---|---|
| `start` | Starts the Next.js production server (after running `build`). |
| `lint` | Runs ESLint to check for code quality issues. |
|---|---|

## Testing

Currently, there are no automated tests implemented for this project. Future development will include:

*   **Unit Tests**: For individual functions and components (e.g., `scrapeArticle`, `analyzeWithGemini`).

*   **Integration Tests**: To ensure the API routes and frontend components work together correctly.

*   **End-to-End Tests**: To simulate user interactions and verify the entire application flow.

## License

This project is licensed under the MIT License. See the `LICENSE` file (if present, otherwise assumed MIT) for details.

## Acknowledgements

*   **Spandan Mukherjee**: The creator and maintainer of this project.

*   **Next.js**: For the powerful React framework.

*   **Google Gemini**: For the advanced AI analysis capabilities.

*   **Shadcn UI**: For the beautiful and accessible UI components.

*   **Cheerio**: For the fast and flexible web scraping.

*   **Geist Fonts**: For the modern and clean typography.

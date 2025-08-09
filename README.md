# AI/ML Pulse

[![Build Status](https://img.shields.io/badge/build-failing-red.svg)](https://github.com/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack web application that aggregates AI/ML news and trending GitHub repositories, keeping you at the forefront of the latest developments in artificial intelligence and machine learning.

***

## ✨ Key Features

*   **📰 AI/ML News Feed**: A real-time feed of the latest news from the world of AI, using NewsAPI as the primary source and GNews as a fallback.
*   **🚀 Trending Repositories**: Discover the most popular and trending open-source AI/ML projects from GitHub.
*   **🔖 Bookmarking**: Save your favorite articles and repositories for later. (Requires GitHub sign-in).
*   **🌗 Light/Dark Mode**: A comfortable viewing experience, day or night.
*   **📱 Responsive Design**: A clean and minimal UI that works seamlessly on all devices.

***

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (with GitHub OAuth)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)

***

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
*   A running [PostgreSQL](https://www.postgresql.org/) database.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abalahb1/Ai-Trending-GitHub.git
    cd Ai-Trending-GitHub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Fill in the required values in the `.env` file. See the table below for details.

4.  **Set up the database:**
    *   Run the Prisma migration to create the database schema:
        ```bash
        npx prisma migrate dev --name init
        ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable          | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`    | The connection string for your PostgreSQL database.                         |
| `NEXTAUTH_URL`    | The base URL of your application (e.g., `http://localhost:3000`).           |
| `NEXTAUTH_SECRET` | A secret key for NextAuth.js. You can generate one using `openssl rand -base64 32`. |
| `GITHUB_ID`       | The Client ID of your GitHub OAuth application.                             |
| `GITHUB_SECRET`   | The Client Secret of your GitHub OAuth application.                         |
| `GITHUB_TOKEN`    | A GitHub personal access token for making authenticated API requests.       |
| `NEWSAPI_KEY`     | Your API key for [NewsAPI](https://newsapi.org/).                           |
| `GNEWS_APIKEY`    | (Optional) Your API key for [GNews](https://gnews.io/) as a fallback.       |

***

## 🚢 Deployment

This application is ready to be deployed on any platform that supports Node.js, such as Vercel, Netlify, or your own server.

**Important:** Before deploying, ensure that the build process completes successfully. Currently, there is a known issue preventing the application from building.

To build the application for production, run:
```bash
npm run build
```

To start the application in production mode, run:
```bash
npm run start
```

***

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

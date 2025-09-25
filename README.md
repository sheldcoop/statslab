# StatSpark: The Intuition Engine

StatSpark is an interactive, AI-powered web application designed to help users master quantitative concepts in finance, data science, and mathematics. It provides a modular learning experience with dynamic visualizations and a clean, intuitive interface.

https://github.com/user-attachments/assets/b8337851-40b1-4f1b-85d1-760d0999aa7b

## ✨ Key Features

- **Interactive Learning Modules**: Organized, topic-specific modules for focused learning.
- **Dynamic UI**: A smooth, parallax scrolling homepage built with Next.js and Framer Motion.
- **Modern Tech Stack**: Built with the latest web technologies for a high-performance experience.
- **AI-Powered (Future)**: Designed to integrate Genkit for intelligent, AI-driven features.
- **Responsive Design**: A beautiful and functional interface on both desktop and mobile devices.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/statspark.git
    cd statspark
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Run the development server:**
    ```sh
    npm run dev
    ```
4.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 🛠️ Tech Stack

This project is built with a modern, performance-focused tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (for future AI features)

## 📁 Project Structure

The project follows a standard Next.js App Router structure:

```
.
├── src
│   ├── app                 # Main application routes and pages
│   │   ├── (pages)         # Route groups
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components          # Reusable React components
│   │   ├── homepage        # Components specific to the homepage
│   │   └── ui              # ShadCN UI components
│   ├── lib                 # Utility functions and libraries
│   └── ai                  # Genkit flows and AI logic (future)
├── public                  # Static assets
├── package.json            # Project dependencies and scripts
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/statspark/issues).

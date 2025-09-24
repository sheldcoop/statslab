# **App Name**: StatSpark: Intuition Engine

## Core Features:

- 3D Canvas Rendering: Renders a fixed 3D canvas using react-three-fiber and Drei, displaying dynamic visualizations based on scroll position.
- Scroll-Linked Camera Animation: Animates the camera's position in the 3D scene based on the user's scroll progress, creating a zoom-in effect and transitioning between different visualization scenes.
- Scene Orchestration: Orchestrates the appearance and disappearance of various 3D scenes (Linear Algebra, Statistics, Time Series) based on scroll position, using smooth cross-fade transitions.
- UI Overlay Synchronization: Synchronizes the appearance and disappearance of HTML headlines and text with the 3D visuals using framer-motion's useTransform hook, creating a cohesive narrative experience.

## Style Guidelines:

- Primary color: Deep blue (#2E5CB8) to represent intelligence and analytical depth.
- Background color: Very dark gray (#222225) to provide contrast and make the 3D visualizations stand out.
- Accent color: Electric purple (#A850FF) to highlight interactive elements and call to actions.
- Headline font: 'Space Grotesk', a proportional sans-serif with a computerized, techy, scientific feel.
- Body font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look.
- Full-screen, fixed 3D canvas background with clear, legible text overlays positioned for optimal readability.
- Smooth, performant animations driven by scroll position using framer-motion for camera movement and scene transitions.
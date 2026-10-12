# 🗄️ Interactive Normalization & Functional Dependency (FD) Analyzer

A modern, interactive web application built with **React** and **Vite** designed to make Database Management System (DBMS) relational design concepts intuitive, visual, and engaging.

---

## ✨ Key Features

- **⚡ Attribute Closure Calculator**
  - Compute the closure $(X^+)$ for any subset of attributes step-by-step.
  - Interactive visual walkthrough showing which functional dependencies (FDs) are applied at each iteration.

- **🔑 Candidate Key Finder**
  - Automatically identifies all candidate keys for a given relational schema and set of FDs.
  - Classifies attributes into Prime and Non-Prime attributes.

- **📊 Normal Form Determination**
  - Analyzes the relation against **1NF, 2NF, 3NF, and BCNF**.
  - Pinpoints the highest normal form achieved and provides detailed explanations for any violations (partial dependencies, transitive dependencies, non-superkey determinants).

- **🔄 Decomposition & Normalization Simulator**
  - Explores decompositions into 3NF / BCNF.
  - Verifies **Lossless Join** and **Dependency Preservation** properties.

- **🎯 Double Hashing Visualizer**
  - Interactive visualization of collision handling using secondary hash functions.

- **📚 Practice & Quiz Mode**
  - Test and solidify DBMS knowledge with practice problems, hints, and immediate feedback.

- **🎨 Modern UI & Experience**
  - Sleek dark and light themes.
  - Built-in schema presets (Student-Course, Employee-Department, Library, E-Commerce, etc.).
  - Responsive layout with smooth animations and intuitive controls.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite
- **Icons:** Lucide React
- **Styling:** Modern CSS (CSS custom properties, glassmorphism, responsive grid)
- **Linting:** Oxlint

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/samriddhigoswami556-prog/Interactive-Normalization.git
   cd Interactive-Normalization
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📖 How It Works

1. **Enter Attributes:** Specify relation attributes separated by commas (e.g., `A, B, C, D`).
2. **Define Functional Dependencies:** Enter FDs line by line (e.g., `A -> B`, `B -> C`, `C -> D`).
3. **Explore Results:** Navigate between tabs to calculate closures, find candidate keys, determine the normal form, or simulate lossless decomposition.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

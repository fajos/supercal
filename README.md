# SuperCalc 🚀

SuperCalc is a high-performance, all-in-one scientific and specialized calculator for Android, built with React Native and Expo. It features a modern 3D tactile UI/UX, centralized haptics, and a comprehensive suite of solvers for Mathematics, Physics, and Engineering.

## ✨ Features

### 📱 Core Calculator
- **Scientific Calculator**: Full scientific notation support, trigonometry (Rad/Deg), memory functions, and history persistence.
- **Graphing Calculator**: Multi-function plotter with analysis tools (roots, extrema, derivatives) and interactive SVG rendering.

### 📐 Mathematics Solvers
- **Calculus**: Symbolic and numerical differentiation and integration.
- **Algebra**: Quadratic, Linear, and Polynomial equation solvers with step-by-step breakdowns.
- **Matrices**: Addition, Multiplication, Determinants, and Inversion.
- **Trigonometry**: Equation solving and identity analysis.
- **Complex Numbers**: Arithmetic and polar conversions.
- **Statistics & Probability**: Data analysis and distribution solvers.

### ⚡ Physics & Engineering
- **Kinematics & Dynamics**: Motion equations and force analysis.
- **Circuit Analysis**: Ohm's Law, Resistor networks, and power calculations.
- **Energy & Thermal**: Work, power, and thermodynamics.
- **Optics & Waves**: Refraction, lens equations, and wave properties.
- **Quantum & Radioactivity**: Half-life and energy level calculations.

### 📋 History & Persistence
- **Unified History**: Centralized state management for all calculations using `AsyncStorage`.
- **Step-by-Step Solutions**: Detailed logic paths for complex solvers.

## 🛠️ Tech Stack
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **UI Components**: Custom "3D Tactile" design system
- **Haptics**: Expo Haptics (Centralized in `SolveButton`)
- **Graphics**: React Native SVG
- **Storage**: AsyncStorage

## 🎨 UI/UX Standardization
The project follows a strict standardization pattern for Android:
- **3D Tactile Buttons**: High-contrast, depth-focused interactive elements.
- **Edge-to-Edge Navigation**: Optimized for modern Android gesture navigation.
- **Standardized Solver Pattern**: 
    - `InputCard`: Unified container for parameters.
    - `ModeChip`: Standardized grid for mode selection.
    - `SolveButton`: Centralized loading state and haptic feedback.
    - **600ms Thinking Delay**: Consistent processing simulation for better UX.

## 🚀 Getting Started

### Prerequisites
- Node.js
- Expo Go (on your Android/iOS device)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SuperCalc.git
   cd SuperCalc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the project:
   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go to run on your device.

## 📁 Project Structure
- `src/screens`: All feature screens and UI logic.
- `src/components`: Standardized reusable UI components (`SolveButton`, `ModeChip`, etc.).
- `src/solvers`: Core mathematical and physics logic.
- `src/theme`: Centralized color palette and styling constants.
- `src/utils`: Context providers (History, State).

---
*Built with ❤️ for Students and Engineers.*

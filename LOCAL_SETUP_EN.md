# Local Setup and Modification: NEXUS VEIL

This document provides instructions for running the project locally and understanding how to modify its atmospheric systems.

## 1. Requirements

To run the project, ensure you have the following installed:
- **Node.js** (version 18.x or higher). Download from [nodejs.org](https://nodejs.org/).
- **npm** (included with Node.js).
- **Git** (optional, but recommended).

## 2. Step-by-Step Installation

1. **Clone/Download the Code**: Clone the repository using `git clone [url]` or extract the project archive into a folder.
2. **Open Terminal**: Use CMD, PowerShell, or your preferred terminal emulator.
3. **Navigate to the Project Directory**:
   ```bash
   cd path/to/nexus-veil
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Start Development Server**:
   ```bash
   npm run dev
   ```
6. **Access the Environment**: Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 3. Modifying the Ecosystem

NEXUS VEIL utilizes a modular architecture optimized for atmospheric manipulation.

### Themes and Visual Identity
Core colors and global effects (scanlines, noise, UI variables) are defined in:
- `src/app/globals.css`
Modify variables in the `:root` section (e.g., `--cyber-blue`) to update the entire interface palette.

### World-State & Mood Engine
To adjust how the interface reacts to environmental intensity or events:
- `src/lib/environment/moodLogic.ts` (Visual parameters for global moods)
- `src/lib/environment/WorldStateContext.tsx` (Global variables: tension, entropy, stability)

### 3D Environmental Rendering
The Three.js background layer is located in:
- `src/components/environment/BackgroundCanvas.tsx`
Adjust particle density, rotation speeds, or spatial geometry here.

### Terminal & Authentication Logic
To modify the boot sequence or login behavior:
- `src/components/auth/LoginTerminal.tsx`
Customize the `fullBootSequence` array or update the world-state triggers on login success/failure.

---

## 4. Advanced Integration Ideas
1. **Live Weather Sync**: Update `src/lib/environment/state.tsx` with a fetch call to a weather API to synchronize the atmosphere with real-world data.
2. **Systemic Secrets**: Add new "hidden" routes in `src/app/` and trigger navigation via the `emitWorldEvent` system when specific anomalies are discovered.
3. **Adaptive Audio**: Integrate background ambient loops that mutate filters based on the `tension` and `entropy` variables from the WorldState Engine.

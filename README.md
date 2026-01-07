# FlowBoard - Kanban Task Management

A lightweight Kanban board application built with React, TypeScript, Redux Toolkit, and native HTML5 drag-and-drop.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-2.11.2-purple)](https://redux-toolkit.js.org/)
[![Test Coverage](https://img.shields.io/badge/Coverage-91.58%25-brightgreen)](/)
[![Tests](https://img.shields.io/badge/Tests-71%20passing-brightgreen)](/)

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Browser Support](#browser-support)

---

## ✨ Features

- **Three-Column Kanban Board** - To Do, In Progress, Done
- **Add Tasks** - Create tasks with validation
- **Move Tasks** - Drag-and-drop OR button-based movement (← →)
- **Delete Tasks** - Soft delete with inline confirmation overlay
- **Native Drag-and-Drop** - HTML5 Drag API (no external libraries)
- **Visual Feedback** - Smooth animations and hover effects
- **localStorage Persistence** - Tasks saved automatically
- **Performance Optimized** - CSS containment for 50-100+ tasks
- **Responsive Design** - Desktop and tablet support
- **TypeScript** - Full type safety with strict mode
- **91.58% Test Coverage** - 71 passing tests

---

## 🚀 Quick Start

```bash
# Clone the repository
cd /home/abhinavkumar/Documents/todo/flow-board

# Install dependencies
npm install

# Start development server
npm run start

# Open http://localhost:5173 in your browser
```

---

## 📦 Prerequisites

Before running FlowBoard, ensure you have the following installed:

- **Node.js** - v18.0.0 or higher
- **npm** - v9.0.0 or higher

Check your versions:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## 💿 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd flow-board
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- React 19.2.0
- Redux Toolkit 2.11.2
- TypeScript 5.9.3
- Vite 7.3.0
- Vitest 2.2.1
- And more...

---

## 🎮 Running the Application

### Development Mode

#### Standard Start (Empty Board)
```bash
npm run start
```
Opens at: **http://localhost:5173**

#### Start with Test Data
```bash
# Start with 50 test tasks
npm run start:50

# Start with 100 test tasks
npm run start:100

# Start with custom number of tasks
npm run start:tasks 200
```

### Production Preview
```bash
# Build and preview production version
npm run build
npm run preview
```

### Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start development server |
| `npm run start:50` | Start with 50 test tasks |
| `npm run start:100` | Start with 100 test tasks |
| `npm run start:tasks N` | Start with N test tasks |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:ui` | Open Vitest UI |
| `npm run lint` | Run ESLint |

---

## 🧪 Testing

### Run All Tests
```bash
npm run test:run
```

Expected output:
```
✓ src/utils/performance.test.ts (8 tests)
✓ src/utils/index.test.ts (13 tests)
✓ src/store/integration.test.ts (2 tests)
✓ src/store/slices/tasksSlice.test.ts (11 tests)
✓ src/store/selectors/index.test.ts (12 tests)
✓ src/store/slices/columnsSlice.test.ts (10 tests)
✓ src/store/dragDrop.integration.test.ts (6 tests)
✓ src/hooks/useDragAndDrop.test.ts (9 tests)

Test Files  8 passed (8)
Tests       71 passed (71)
```

### View Coverage Report
```bash
npm run test:coverage
```

Expected coverage:
```
Overall:     91.58%
Statements:  91.58%
Branches:    88.23%
Functions:   86.36%
Lines:       93.58%
```

### Watch Mode (for development)
```bash
npm run test
```

### Interactive UI
```bash
npm run test:ui
```

---

## 🏗️ Building for Production

### Build
```bash
npm run build
```

Output will be in `dist/` directory:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
```

### Build Size
- **HTML:** ~0.46 KB
- **CSS:** ~7.29 KB (gzipped: 2.28 KB)
- **JS:** ~229 KB (gzipped: 73.90 KB)

### Preview Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
flow-board/
├── src/
│   ├── components/          # React UI components
│   │   ├── Board/
│   │   ├── Column/
│   │   ├── TaskCard/
│   │   ├── AddTaskForm/
│   │   └── DeleteConfirmation/
│   ├── store/               # Redux state management
│   │   ├── slices/
│   │   ├── selectors/
│   │   └── middleware/
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── dist/                    # Build output
├── public/                  # Static files
└── [config files]
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed explanation.

---

## 📚 Documentation

Comprehensive documentation is available:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architectural patterns, state management, drag-drop implementation
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Folder/module layout and organization
- **[TEST_STRATEGY.md](./TEST_STRATEGY.md)** - Testing approach and coverage
- **[CHAT_HISTORY.md](./CHAT_HISTORY.md)** - Development journey and decisions
- **[PHASE_4_SUMMARY.md](./PHASE_4_SUMMARY.md)** - Drag-and-drop implementation
- **[PHASE_6_SUMMARY.md](./PHASE_6_SUMMARY.md)** - Performance optimization
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide
- **[TEST_DATA_GUIDE.md](./TEST_DATA_GUIDE.md)** - Test data generation

---

## 🛠️ Tech Stack

### Core
- **React** 19.2.0 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Redux Toolkit** 2.11.2 - State management
- **React-Redux** 9.2.0 - React bindings

### Build & Development
- **Vite** 7.3.0 - Build tool & dev server
- **Vitest** 2.2.1 - Testing framework
- **@vitejs/plugin-react** - React support

### Testing
- **@testing-library/react** 16.3.1 - Component testing
- **@testing-library/jest-dom** 6.9.1 - DOM matchers
- **@vitest/coverage-v8** 2.2.1 - Code coverage

### Code Quality
- **ESLint** 9.39.1 - Linting
- **TypeScript ESLint** - TS linting rules

---

## 🌐 Browser Support

| Browser | Version | Drag-Drop | CSS Optimization |
|---------|---------|-----------|------------------|
| Chrome | 90+ | ✅ | ✅ |
| Firefox | 88+ | ✅ | ⚠️ Flag required |
| Safari | 14+ | ✅ | ⚠️ In development |
| Edge | 90+ | ✅ | ✅ |

**Graceful Degradation:**
- Browsers without `content-visibility` will render all tasks (still performs well)
- Drag-drop falls back to move buttons

---

## 🎯 Assignment Requirements

### ✅ Completed Requirements

- [x] Three fixed columns (To Do, In Progress, Done)
- [x] Add task functionality
- [x] Move tasks via drag-drop OR buttons
- [x] Delete task functionality
- [x] Native HTML5 drag-and-drop (no external libraries)
- [x] localStorage persistence
- [x] Component state management (Redux)
- [x] Unit tests (71 tests, 91.58% coverage)
- [x] TypeScript with strict mode
- [x] Runs with `npm run start`
- [x] Clean, documented code

### 📄 Deliverables

- [x] **Source Code** - Complete, runnable application
- [x] **README.md** - This file with build/run instructions
- [x] **PROJECT_STRUCTURE.md** - Folder/module layout
- [x] **ARCHITECTURE.md** - Patterns, hierarchy, state management, drag-drop
- [x] **TEST_STRATEGY.md** - Testing coverage and rationale
- [x] **CHAT_HISTORY.md** - Development journey and decisions

---

## 🎨 Features Demo

### Add Task
1. Type task title in "To Do" column
2. Click "+ Add" button
3. Task appears in the list

### Move Task (Drag-and-Drop)
1. Click and drag any task card
2. Drag over target column (visual feedback appears)
3. Drop to move task

### Move Task (Buttons)
1. Click **←** to move task left
2. Click **→** to move task right

### Delete Task
1. Click **✕** button on task card
2. Inline confirmation appears over the task
3. Click "Delete" to confirm or "Cancel" to abort

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or specify different port
npm run start -- --port 3000
```

### localStorage Full
If you see quota exceeded errors:
```bash
# Clear localStorage in browser console
localStorage.clear();
location.reload();
```

### Tests Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run test:run
```

---

## 🔧 Development

### Code Style
- TypeScript strict mode enabled
- Arrow functions preferred
- Functional components only
- CSS Modules for styling
- ESLint configured

### Path Aliases
```typescript
import { useAppDispatch } from '@hooks';
import type { Task } from '@types';
import { generateId } from '@utils';
import { selectTasksByColumnId } from '@store/selectors';
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Authors

**FlowBoard Team**  
Built as part of an architectural assignment

---

## 🙏 Acknowledgments

- Built with ❤️ using modern React patterns
- No external drag-drop libraries (native HTML5 API)
- Optimized for performance with CSS containment
- Comprehensive testing with Vitest

---

**Ready to start? Run `npm run start` and open http://localhost:5173** 🚀

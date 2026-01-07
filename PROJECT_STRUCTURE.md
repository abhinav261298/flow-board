# FlowBoard - Project Structure

## Overview
FlowBoard is a Kanban board application built with React, TypeScript, Redux Toolkit, and Vite. This document explains the folder/module layout and organization principles.

## Project Structure

```
flow-board/
├── src/
│   ├── components/              # React UI components
│   │   ├── Board/
│   │   │   ├── Board.tsx
│   │   │   └── Board.module.css
│   │   ├── Column/
│   │   │   ├── Column.tsx
│   │   │   └── Column.module.css
│   │   ├── TaskCard/
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskCard.module.css
│   │   ├── AddTaskForm/
│   │   │   ├── AddTaskForm.tsx
│   │   │   └── AddTaskForm.module.css
│   │   └── DeleteConfirmation/
│   │       ├── DeleteConfirmation.tsx
│   │       └── DeleteConfirmation.module.css
│   │
│   ├── store/                   # Redux state management
│   │   ├── slices/
│   │   │   ├── tasksSlice.ts       # Tasks state & reducers
│   │   │   └── columnsSlice.ts     # Columns state & reducers
│   │   ├── selectors/
│   │   │   └── index.ts            # Memoized selectors
│   │   ├── middleware/
│   │   │   └── localStorageMiddleware.ts  # Persistence
│   │   └── index.ts                # Store configuration
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useDragAndDrop.ts      # Drag-drop logic
│   │   └── index.ts               # Hook exports
│   │
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts                # Type exports
│   │
│   ├── utils/                   # Utility functions
│   │   ├── index.ts                # Helper functions
│   │   ├── testDataGenerator.ts   # Test data utilities
│   │   ├── index.test.ts          # Utility tests
│   │   └── performance.test.ts     # Performance tests
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
│
├── dist/                        # Production build output
├── public/                      # Public static files
├── index.html                   # HTML template
│
├── Documentation/               # Project documentation
│   ├── ARCHITECTURE.md           # Architecture decisions
│   ├── PROJECT_STRUCTURE.md      # This file
│   ├── README.md                 # Build/run instructions
│   └── CHAT_HISTORY.md           # Chat history with AI agent
│   └── TEST_STRATEGY.md          # Testing strategy
│
├── Configuration Files/
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript config
│   ├── vite.config.ts            # Vite build config
│   ├── vitest.config.ts          # Vitest test config
│   ├── eslint.config.js          # ESLint rules
│   └── start-with-tasks.js       # Test data script
│
└── README.md                    # Build/run instructions
```

## Module Explanations

### 1. `src/components/` - UI Components

Each component follows a consistent pattern:
- **Component file** (`.tsx`) - React component logic
- **Style file** (`.module.css`) - CSS Modules for scoped styling

**Components:**

#### `Board/`
- **Role:** Main container component
- **Responsibilities:** Renders three Column components, manages drag-drop state
- **Key Files:**
  - `Board.tsx` - Main board logic with `useDragAndDrop` hook
  - `Board.module.css` - Board layout and styling

#### `Column/`
- **Role:** Individual Kanban column (To Do, In Progress, Done)
- **Responsibilities:** Fetches tasks, handles drops, renders task list
- **Key Files:**
  - `Column.tsx` - Column logic with Redux selectors
  - `Column.module.css` - Column styling with scrollbar customization

#### `TaskCard/`
- **Role:** Individual task display
- **Responsibilities:** Shows task title, move/delete buttons, handles drag
- **Key Files:**
  - `TaskCard.tsx` - Task card with action handlers
  - `TaskCard.module.css` - Card styling with hover effects

#### `AddTaskForm/`
- **Role:** Task creation form
- **Responsibilities:** Input validation, dispatches addTask action
- **Key Files:**
  - `AddTaskForm.tsx` - Form with validation logic
  - `AddTaskForm.module.css` - Form input styling

#### `DeleteConfirmation/`
- **Role:** Delete confirmation overlay
- **Responsibilities:** Renders via Portal, positioned over task card
- **Key Files:**
  - `DeleteConfirmation.tsx` - Confirmation modal using React Portal
  - `DeleteConfirmation.module.css` - Inline modal positioning

---

### 2. `src/store/` - Redux State Management

Centralized state management using Redux Toolkit.

#### `slices/`
Redux slices containing state, reducers, and actions.

**`tasksSlice.ts`**
- **State:** Normalized tasks (`byId`, `allIds`)
- **Actions:**
  - `addTask` - Create new task
  - `moveTask` - Move task to different column
  - `deleteTask` - Soft delete task
- **Reducers:** Update task state immutably

**`columnsSlice.ts`**
- **State:** Column definitions with task references
- **Actions:**
  - `addTaskToColumn` - Add task ID to column
  - `moveTaskBetweenColumns` - Move task between columns
  - `removeTaskFromColumn` - Remove task from column
- **Reducers:** Manage task order within columns

#### `selectors/`
Memoized selectors for efficient state access.

**`index.ts`**
- `selectTasksByColumnId` - Get tasks for specific column (memoized)
- `selectAllColumns` - Get all columns
- `selectTaskById` - Get individual task

#### `middleware/`
Custom Redux middleware for side effects.

**`localStorageMiddleware.ts`**
- Saves state to localStorage on every action
- Loads persisted state on app initialization
- Error handling for quota exceeded

#### `index.ts`
Redux store configuration with:
- Combined reducers
- Middleware setup
- Preloaded state (with test data support)
- Store export and type definitions

---

### 3. `src/hooks/` - Custom React Hooks

Reusable stateful logic extracted into hooks.

**`useDragAndDrop.ts`**
- **Purpose:** Encapsulates drag-and-drop logic
- **Returns:**
  - `dragState` - Current drag state
  - `handleDragStart` - Start drag handler
  - `handleDragOver` - Drag over handler
  - `handleDrop` - Drop handler
  - `handleDragEnd` - End drag handler
- **Benefits:** Reusable, testable, separates concerns

**`index.ts`**
- Exports all hooks
- Provides `useAppDispatch` and `useAppSelector` typed hooks

---

### 4. `src/types/` - TypeScript Definitions

Centralized type definitions for type safety.

**`index.ts`**
Contains all interfaces and types:
- `Task` - Task entity with all properties
- `Column` - Column definition
- `ColumnId` - 'todo' | 'in-progress' | 'done'
- `TasksState` - Normalized tasks state
- `ColumnsState` - Columns state
- `CreateTaskDTO`, `MoveTaskDTO`, `DeleteTaskDTO` - Action payloads
- `ValidationError` - Form validation errors
- `DragState` - Drag-and-drop state

---

### 5. `src/utils/` - Utility Functions

Pure helper functions and test utilities.

**`index.ts`**
- `generateId()` - Create unique task IDs
- `validateTaskTitle()` - Validate task input
- `getCurrentTimestamp()` - Get current time
- `formatDate()` - Format timestamp for display
- `storage` - localStorage wrapper with error handling
- `reorder()` - Reorder array elements
- `move()` - Move element between arrays

**`testDataGenerator.ts`**
- `generateTestTasks()` - Create N test tasks
- `generateDistributedTasks()` - Create tasks across columns
- Used for performance testing and demos

**Test Files:**
- `index.test.ts` - Tests for utility functions
- `performance.test.ts` - Performance benchmarks

---

## Available Scripts

### Development
```bash
npm run start              # Start dev server (localhost:5173)
npm run start:50           # Start with 50 test tasks
npm run start:100          # Start with 100 test tasks
npm run start:tasks 200    # Start with custom number of tasks
```

### Building
```bash
npm run build              # Production build
npm run preview            # Preview production build
```

### Testing
```bash
npm run test               # Run tests in watch mode
npm run test:run           # Run tests once
npm run test:coverage      # Generate coverage report
npm run test:ui            # Open Vitest UI
```

### Code Quality
```bash
npm run lint               # Run ESLint
```

---

## Tech Stack

### Core
- **React** 19.2.0 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Redux Toolkit** 2.11.2 - State management
- **React-Redux** 9.2.0 - React bindings for Redux

### Build & Development
- **Vite** 7.3.0 - Build tool & dev server
- **Vitest** 2.2.1 - Testing framework
- **@vitejs/plugin-react** - React support for Vite

### Testing
- **@testing-library/react** 16.3.1 - Component testing
- **@testing-library/jest-dom** 6.9.1 - DOM matchers
- **@vitest/coverage-v8** 2.2.1 - Code coverage

### Code Quality
- **ESLint** 9.39.1 - Linting
- **TypeScript ESLint** - TS linting rules

---

## Getting Started

### 1. Install Dependencies
```bash
cd /home/abhinavkumar/Documents/todo/flow-board
npm install
```

### 2. Start Development Server
```bash
npm run start
```
App will open at: **http://localhost:5173**

### 3. Run Tests
```bash
npm run test:coverage
```
Expected: 71 tests passing, 91.58% coverage

### 4. Build for Production
```bash
npm run build
```
Output in `dist/` directory

---

## Design Principles

### Component Organization
1. **One component per directory** - Each component has its own folder
2. **Co-located styles** - CSS Modules next to components
3. **Self-contained** - Components are independent and reusable

### State Management
1. **Single source of truth** - Redux store is the only state source
2. **Normalized state** - No data duplication, efficient updates
3. **Immutable updates** - Redux Toolkit handles immutability

### Code Style
1. **TypeScript strict mode** - No `any` types allowed
2. **Arrow functions** - Consistent function syntax
3. **Functional components** - No class components
4. **CSS Modules** - Scoped styling, no global pollution

### File Naming
- **Components:** PascalCase (`TaskCard.tsx`)
- **Hooks:** camelCase with 'use' prefix (`useDragAndDrop.ts`)
- **Utilities:** camelCase (`generateId.ts`)
- **Types:** PascalCase (`Task`, `ColumnId`)
- **Tests:** `*.test.ts` or `*.test.tsx`

---

## Import Patterns

### Using Path Aliases
```typescript
// ✅ Good - Using aliases
import { useAppDispatch } from '@hooks';
import type { Task } from '@types';
import { generateId } from '@utils';
import { selectTasksByColumnId } from '@store/selectors';

// ❌ Bad - Relative paths
import { useAppDispatch } from '../../hooks';
import type { Task } from '../../types';
```

### Configured Aliases
- `@hooks` → `src/hooks`
- `@types` → `src/types`
- `@utils` → `src/utils`
- `@store` → `src/store`
- `@components` → `src/components`

---

## Best Practices

### Component Development
1. ✅ Keep components focused (single responsibility)
2. ✅ Use TypeScript types for all props
3. ✅ Extract reusable logic into hooks
4. ✅ Use CSS Modules for scoped styles
5. ✅ Add prop validation

### State Management
1. ✅ Use selectors for derived state
2. ✅ Memoize expensive computations
3. ✅ Keep reducers pure (no side effects)
4. ✅ Normalize state structure
5. ✅ Use middleware for side effects

### Testing
1. ✅ Test behavior, not implementation
2. ✅ Write integration tests for workflows
3. ✅ Mock external dependencies
4. ✅ Maintain 85%+ coverage
5. ✅ Test edge cases

### Performance
1. ✅ Use React.memo for expensive components
2. ✅ Memoize selectors with reselect
3. ✅ Use CSS containment for large lists
4. ✅ Avoid unnecessary re-renders
5. ✅ Profile with React DevTools

---

## File Count Summary

- **Source Files:** 30+ files
- **Components:** 5 components (10 files with CSS)
- **Redux Files:** 7 files
- **Test Files:** 8 test files
- **Utilities:** 3 utility files
- **Documentation:** 10+ docs

---

**Last Updated:** 2026-01-07  
**Maintainer:** FlowBoard Team

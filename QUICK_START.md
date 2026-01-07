# FlowBoard - Quick Start Guide 🚀

## Start the App

### Normal Start (Empty Board)
```bash
npm run start
```
Opens on: http://localhost:5173

### Start with Test Data

```bash
# 50 tasks
npm run start:50

# 100 tasks  
npm run start:100

# Custom number (e.g., 25, 200, 500)
npm run start:tasks 150
```

---

## All Available Commands

```bash
npm run start          # Normal start (empty or from localStorage)
npm run start:50       # Load with 50 test tasks
npm run start:100      # Load with 100 test tasks
npm run start:tasks N  # Load with N test tasks (any number)

npm run build          # Production build
npm run preview        # Preview production build

npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:coverage  # Run tests with coverage report
npm run test:ui        # Open Vitest UI

npm run lint           # Run ESLint
```

---

## Features

✅ **Three-column Kanban** (To Do, In Progress, Done)  
✅ **Add tasks** with validation  
✅ **Move via buttons** (← →)  
✅ **Drag-and-drop** between columns  
✅ **Delete with confirmation**  
✅ **Performance optimized** (50-100+ tasks)  
✅ **localStorage persistence**  
✅ **91.58% test coverage** (71 tests)  

---

## Browser Console Testing

Open console (F12) and try:

```javascript
// Access Redux store
window.store

// Add a task
window.store.dispatch({
  type: 'tasks/addTask',
  payload: {
    title: 'Test Task',
    columnId: 'todo'
  }
});

// Get all tasks
window.store.getState().tasks

// Clear localStorage
localStorage.clear();
location.reload();
```

---

## Project Structure

```
flow-board/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks (useDragAndDrop)
│   ├── store/           # Redux (slices, selectors, middleware)
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities + test data generator
│   └── App.tsx
├── dist/                # Build output
├── tests/               # Test files (71 tests)
└── *.md                 # Documentation
```

---

## Test Coverage

```
91.58% overall coverage
71 passing tests
8 test files
```

---

## Troubleshooting

**Issue:** Tasks persist after reload  
**Solution:** `localStorage.clear()` in console

**Issue:** Modal hidden behind tasks  
**Solution:** Fixed! (z-index: 9999)

**Issue:** "Store not available" error  
**Solution:** Fixed! Use `window.store`

**Issue:** Want to test with many tasks  
**Solution:** `npm run start:100`

---

## Performance Tips

- **Small lists (< 10):** Just use the UI to add tasks
- **Medium lists (10-50):** `npm run start:50`
- **Large lists (50-100):** `npm run start:100`
- **Stress test (100-500):** `npm run start:tasks 500`

---

**Ready to start!** 🎉

```bash
npm run start:100
```

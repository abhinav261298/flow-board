#!/usr/bin/env node

/**
 * Helper script to start dev server with test tasks
 * Usage: node start-with-tasks.js [number of tasks]
 * Example: node start-with-tasks.js 100
 */

const { spawn } = require('child_process');

// Get task count from command line argument
const taskCount = process.argv[2] || '0';

// Validate task count
const count = parseInt(taskCount, 10);
if (isNaN(count) || count < 0) {
  console.error('❌ Invalid task count. Please provide a positive number.');
  console.log('Usage: npm run start:tasks [number]');
  console.log('Example: npm run start:tasks 100');
  process.exit(1);
}

// Set environment variable and start vite
const env = {
  ...process.env,
  VITE_TEST_TASKS: taskCount
};

console.log(`🚀 Starting FlowBoard with ${taskCount} test tasks...`);

// Spawn vite with environment variable
const child = spawn('npx', ['vite'], {
  env,
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ Failed to start:', error);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code || 0);
});

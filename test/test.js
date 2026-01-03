/**
 * Simple test runner for the module
 */

import myModule from '../index.js';

// Test counter
let passed = 0;
let failed = 0;

/**
 * Simple assertion function
 */
function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ ${message}`);
    failed++;
  }
}

// Run tests
console.log('Running tests...\n');

// Test greet function
assert(myModule.greet() === 'Hello, World!', 'greet() should return "Hello, World!"');
assert(myModule.greet('Alice') === 'Hello, Alice!', 'greet("Alice") should return "Hello, Alice!"');

// Test add function
assert(myModule.add(2, 3) === 5, 'add(2, 3) should return 5');
assert(myModule.add(-1, 1) === 0, 'add(-1, 1) should return 0');
assert(myModule.add(0, 0) === 0, 'add(0, 0) should return 0');

// Print results
console.log(`\n${passed} passed, ${failed} failed`);

// Exit with error code if tests failed
process.exit(failed > 0 ? 1 : 0);

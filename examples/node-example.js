/**
 * Node.js Example
 * Usage in a Node.js environment
 */

import myModule from '../index.js';

console.log('Node.js Example:');
console.log(myModule.greet());
console.log(myModule.greet('Node.js'));
console.log(`2 + 3 = ${myModule.add(2, 3)}`);

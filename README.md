# My Module

A lightweight Node.js module built with vanilla JavaScript.

## Installation

### Using npm

```bash
npm install my-module
```

### Using CDN

For browser usage, you can include the module via a CDN (after publishing):

```html
<script src="https://cdn.jsdelivr.net/npm/my-module@1.0.0/index.js"></script>
```

## Usage

### Node.js

```javascript
import myModule from 'my-module';

// Use the greet method
console.log(myModule.greet());          // Output: Hello, World!
console.log(myModule.greet('Alice'));   // Output: Hello, Alice!

// Use the add method
console.log(myModule.add(2, 3));        // Output: 5

// Or use the class directly
import { MyModule } from 'my-module';
const instance = new MyModule();
console.log(instance.greet('Bob'));     // Output: Hello, Bob!
```

### Browser

See the [browser example](examples/browser-example.html) for usage in a browser environment.

## API

### `greet(name)`

Returns a greeting message.

- **Parameters:**
  - `name` (string, optional) - The name to greet. Defaults to "World".
- **Returns:** (string) A greeting message.

**Example:**
```javascript
myModule.greet('Alice');  // "Hello, Alice!"
```

### `add(a, b)`

Adds two numbers together.

- **Parameters:**
  - `a` (number) - First number
  - `b` (number) - Second number
- **Returns:** (number) Sum of a and b

**Example:**
```javascript
myModule.add(2, 3);  // 5
```

## Development

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Examples

Check the `examples/` folder for usage examples:
- [node-example.js](examples/node-example.js) - Node.js usage
- [browser-example.html](examples/browser-example.html) - Browser usage

## Publishing

To publish this module to npm:

1. Update the `package.json` with your module name and details
2. Create an npm account if you don't have one
3. Login to npm: `npm login`
4. Publish: `npm publish`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Your Name

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
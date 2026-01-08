# Webponents

A lightweight framework for creating custom Web Components with reactive properties and declarative rendering. Built with vanilla JavaScript, Webponents provides a simple yet powerful API for building reusable UI components.

## Features

- 🚀 **Simple API**: Extend a single base class to create custom elements
- ⚡ **Reactive Properties**: Automatic synchronization between attributes and properties
- 🎯 **Type Coercion**: Built-in type conversion for Number, Boolean, Integer, and Float
- 🔄 **Property Lifecycle**: Custom getters, setters, and assertions for properties
- 🎨 **Shadow DOM**: Encapsulated styling and markup by default
- 📦 **Zero Dependencies**: Pure vanilla JavaScript, no build tools required

## Installation

### Using npm

```bash
npm install webponents
```

### Using ES Modules

```html
<script type="module">
  import { Webponent, Title } from './index.js';
</script>
```

## Quick Start

### Creating a Simple Component

```javascript
import Webponent from './src/Webponent.js';

class MyButton extends Webponent {
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <button><slot></slot></button>
    `;
  }
  
  static properties = {
    disabled: {
      type: Boolean,
      default: false
    }
  };
}

MyButton.register();
```

```html
<my-button disabled>Click Me</my-button>
```

### Using the Title Component

The Title component demonstrates dynamic rendering and property cycling:

```html
<title-ponent level="2">My Heading</title-ponent>
```

Click on the title to cycle through heading levels (h1-h6).

## API Documentation

### Webponent Base Class

#### Static Properties

- **`affix`** (string): Prefix or suffix (or both) for component tag name (Syntax: 'app-' => prefix 'app-tag', '-ponent'=>suffix 'tag-ponent', 'app-ponent' => both 'app-tag-ponent')
- **`properties`** (object): Property definitions for the component

#### Static Methods

##### `register(name)`

Registers the component as a custom element.

- **Parameters:**
  - `name` (string, optional): Custom element name. Defaults to class name in kebab-case

**Example:**
```javascript
class MyComponent extends Webponent {}
MyComponent.register(); // Registers as 'my-component-ponent'
MyComponent.register('my-widget'); // Registers as 'my-widget'
```

##### `defineProperties(descriptors)`

Defines reactive properties with type conversion and lifecycle hooks.

- **Parameters:**
  - `descriptors` (object): Object mapping property names to descriptors

**Example:**
```javascript
static properties = {
  count: {
    type: Number,
    default: 0,
    set(value) {
      this.render();
    }
  }
};
```

#### Property Descriptor Options

- **`type`** (Function): Type constructor (String, Number, Boolean, etc.)
- **`default`** (any): Default value for the property
- **`assert`** (Function): Custom validation/coercion function
- **`get`** (Function): Custom getter logic
- **`set`** (Function): Custom setter logic (called after value changes)

#### Built-in Type Assertions

- **`Number`**: Converts to number, returns undefined if NaN
- **`Boolean`**: Converts to boolean ('false' string → false)
- **`Integer`**: Converts to integer using parseInt
- **`Float`**: Converts to float using parseFloat

#### Instance Methods

##### `createProxy(obj)`

Creates a proxy for automatic attribute synchronization.

##### `attributeChangedCallback(name, oldValue, newValue)`

Lifecycle hook called when observed attributes change.

### Title Component

A specialized component for rendering dynamic headings.

#### Properties

- **`level`** (Number, 1-6): Heading level that determines which h-tag to render

#### Methods

- **`render()`**: Updates the shadow DOM with the current heading level
- **`cycle(num, min, max)`**: Cycles a number within a range

#### Events

- Clicking the title increments the heading level (cycles from h6 to h1)

## Examples

### Counter Component

```javascript
class Counter extends Webponent {
  connectedCallback() {
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button { padding: 10px 20px; font-size: 16px; }
        span { margin: 0 10px; font-weight: bold; }
      </style>
      <button id="dec">-</button>
      <span>${this.count}</span>
      <button id="inc">+</button>
    `;
    
    this.shadowRoot.getElementById('inc').onclick = () => this.count++;
    this.shadowRoot.getElementById('dec').onclick = () => this.count--;
  }
  
  static properties = {
    count: {
      type: Number,
      default: 0,
      set() { this.render(); }
    }
  };
}

Counter.register('counter', '', '');
```

### Toggle Component

```javascript
class Toggle extends Webponent {
  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('input').addEventListener('change', (e) => {
      this.checked = e.target.checked;
    });
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <label>
        <input type="checkbox" ${this.checked ? 'checked' : ''}>
        <slot></slot>
      </label>
    `;
  }
  
  static properties = {
    checked: {
      type: Boolean,
      default: false,
      set() { this.render(); }
    }
  };
}

Toggle.register();
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
- [title.html](examples/title.html) - Title component demo
- [browser-example.html](examples/browser-example.html) - Browser usage
- [node-example.js](examples/node-example.js) - Node.js usage

## Documentation

Full documentation is available in the `docs/` folder:
- [Title Component](docs/Title.md)
- [Webponent Base Class](docs/Webponent.md)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
# Title Component

The Title component is a custom web component that renders semantic heading elements (h1-h6) with dynamic level cycling. It demonstrates the core features of the Webponents framework including reactive properties, shadow DOM rendering, and user interaction.

## Overview

`Title` extends the `Webponent` base class to create an interactive heading component that:
- Renders h1-h6 heading elements based on a `level` property
- Automatically cycles through heading levels when clicked
- Updates the DOM reactively when the level changes
- Uses shadow DOM for encapsulation

## Installation

Import the Title component from the webponents package:

```javascript
import { Title } from './index.js';
// The component auto-registers as 'title-ponent'
```

## Basic Usage

### HTML

```html
<title-ponent level="1">This is a Title</title-ponent>
<title-ponent level="2">This is a Subtitle</title-ponent>
<title-ponent level="3">This is a Sub-subtitle</title-ponent>
```

### JavaScript

```javascript
// Create programmatically
const title = document.createElement('title-ponent');
title.level = 2;
title.textContent = 'Dynamic Heading';
document.body.appendChild(title);

// Update level
title.level = 3; // Automatically re-renders as h3
```

## Interactive Behavior

Click on any Title component to cycle through heading levels:

```html
<title-ponent level="1">Click me!</title-ponent>
```

Each click increments the level:
- h1 → h2 → h3 → h4 → h5 → h6 → h1 (cycles back)

## API Reference

### Properties

#### `level`

The heading level that determines which h-tag to render.

- **Type**: `Number`
- **Default**: `1`
- **Range**: `1-6` (automatically cycles within this range)
- **Reactive**: Yes - re-renders when changed

**Behavior:**
- Values are coerced to numbers
- Invalid numbers (NaN) are rejected (property remains unchanged)
- Values outside 1-6 are cycled into range using modulo arithmetic
- Setting `level = 0` results in `level = 6`
- Setting `level = 7` results in `level = 1`

**Examples:**
```javascript
title.level = 1;   // Renders <h1>
title.level = 3;   // Renders <h3>
title.level = 7;   // Cycles to 1, renders <h1>
title.level = 0;   // Cycles to 6, renders <h6>
title.level = -1;  // Cycles to 5, renders <h5>
```

#### `level0` (Deprecated)

- **Type**: `Number`
- **Default**: `1`
- **Status**: Deprecated, kept for backwards compatibility

### Methods

#### `render()`

Renders or updates the heading element in the shadow DOM.

**Returns**: `HTMLElement` - The rendered heading element

**Behavior:**
- Creates a new heading element (h1-h6) based on current `level`
- Adds a `<slot>` element to display component content
- Replaces the previous heading element if it exists
- Otherwise appends to the shadow root

**Example:**
```javascript
class MyTitle extends Title {
  updateTitle() {
    this.level = 2;
    this.render(); // Manually trigger re-render
  }
}
```

**Note**: The component automatically calls `render()` when:
- The component connects to the DOM (`connectedCallback`)
- The `level` property changes (via the `set` hook)

#### `cycle(num, min, max)`

Utility method to cycle a number within a specified range.

**Parameters:**
- `num` (number): The number to cycle
- `min` (number, optional): Minimum value (inclusive), default: `1`
- `max` (number, optional): Maximum value (inclusive), default: `6`

**Returns**: `number` - The cycled value within [min, max]

**Algorithm:**
Uses modulo arithmetic to wrap values:
```javascript
const range = max - min + 1;
const positive = (num - min) % range + range;
return positive % range + min;
```

**Examples:**
```javascript
title.cycle(3);        // 3 (within range)
title.cycle(7);        // 1 (wraps around)
title.cycle(0);        // 6 (wraps around)
title.cycle(-1);       // 5 (wraps around)
title.cycle(10, 1, 3); // 1 (cycles within 1-3)
```

### Properties (DOM Structure)

#### `rendered`

Reference to the currently rendered heading element in the shadow DOM.

- **Type**: `HTMLElement | null`
- **Initial**: `null`
- **Usage**: Internal tracking for DOM updates

### Lifecycle Methods

#### `connectedCallback()`

Called when the component is inserted into the DOM.

**Behavior:**
1. Calls `render()` to create initial heading
2. Attaches a click event listener that increments `level`

**Source:**
```javascript
connectedCallback() {
  this.render();
  this.addEventListener('click', () => {
    this.level += 1;
  });
}
```

## DOM Structure

The Title component uses shadow DOM with the following structure:

```html
<!-- Shadow Root -->
<h{level}>
  <slot></slot>
</h{level}>
```

Where `{level}` is replaced with the current level value (1-6).

**Example for `level="2"`:**
```html
<!-- Shadow Root -->
<h2>
  <slot></slot>
</h2>
```

The `<slot>` element projects the component's light DOM content into the heading.

## Examples

### Example 1: Basic Headings

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="../index.js"></script>
</head>
<body>
  <title-ponent level="1">Main Title</title-ponent>
  <title-ponent level="2">Section Title</title-ponent>
  <title-ponent level="3">Subsection Title</title-ponent>
</body>
</html>
```

### Example 2: Interactive Demo

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="../index.js"></script>
  <style>
    title-ponent {
      cursor: pointer;
      user-select: none;
      display: block;
      margin: 10px 0;
    }
    title-ponent:hover {
      color: blue;
    }
  </style>
</head>
<body>
  <h1>Click the titles below to cycle through levels:</h1>
  <title-ponent level="1">Click me! I'm an h1</title-ponent>
  <title-ponent level="2">Click me! I'm an h2</title-ponent>
  <title-ponent level="3">Click me! I'm an h3</title-ponent>
</body>
</html>
```

### Example 3: Programmatic Control

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="../index.js"></script>
</head>
<body>
  <title-ponent id="myTitle" level="1">Dynamic Title</title-ponent>
  
  <button onclick="increaseLevel()">Increase Level</button>
  <button onclick="decreaseLevel()">Decrease Level</button>
  <button onclick="resetLevel()">Reset to H1</button>
  
  <script type="module">
    const title = document.getElementById('myTitle');
    
    window.increaseLevel = () => {
      title.level += 1;
    };
    
    window.decreaseLevel = () => {
      title.level -= 1;
    };
    
    window.resetLevel = () => {
      title.level = 1;
    };
  </script>
</body>
</html>
```

### Example 4: Custom Styling

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="../index.js"></script>
  <style>
    title-ponent {
      display: block;
      margin: 20px 0;
      padding: 10px;
      background: linear-gradient(to right, #667eea, #764ba2);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    title-ponent:hover {
      transform: scale(1.02);
    }
    
    title-ponent:active {
      transform: scale(0.98);
    }
  </style>
</head>
<body>
  <title-ponent level="1">Styled Interactive Title</title-ponent>
</body>
</html>
```

## Extending the Title Component

### Custom Rendering

```javascript
import { Title } from './index.js';

class FancyTitle extends Title {
  render() {
    const old = this.rendered;
    this.rendered = this.dom.main();
    
    // Add custom attributes or styling
    this.rendered.style.color = this.color || 'inherit';
    this.rendered.dataset.level = this.level;
    
    if (old) {
      old.replaceWith(this.rendered);
    } else {
      this.shadowRoot.appendChild(this.rendered);
    }
    return this.rendered;
  }
  
  static properties = {
    ...Title.properties,
    color: {
      type: String,
      default: 'black',
      set() { this.render(); }
    }
  };
}

FancyTitle.register('fancy-title', '', '');
```

### Custom Cycling Behavior

```javascript
import { Title } from './index.js';

class OddTitle extends Title {
  connectedCallback() {
    this.render();
    this.addEventListener('click', () => {
      // Only cycle through odd levels (1, 3, 5)
      const oddLevels = [1, 3, 5];
      const currentIndex = oddLevels.indexOf(this.level);
      const nextIndex = (currentIndex + 1) % oddLevels.length;
      this.level = oddLevels[nextIndex];
    });
  }
}

OddTitle.register('odd-title', '', '');
```

### With Custom Slots

```javascript
import { Title } from './index.js';

class TitleWithIcon extends Title {
  dom = {
    main: () => {
      const result = document.createElement('h' + this.level);
      result.innerHTML = `
        <slot name="icon"></slot>
        <slot></slot>
      `;
      return result;
    }
  };
}

TitleWithIcon.register('title-icon', '', '');
```

```html
<title-icon-ponent level="2">
  <span slot="icon">🎉</span>
  Celebration Title
</title-icon-ponent>
```

## Implementation Details

### Property Definition

The `level` property is defined with:

```javascript
static properties = {
  level: {
    type: Number,
    default: 1,
    assert(value) {
      value = Number(value);
      if (isNaN(value)) return undefined;
      return this.cycle(value);
    },
    set(value) {
      if (this.rendered) {
        this.render();
      }
    }
  }
};
```

**Flow:**
1. Value is converted to `Number`
2. If NaN, property update is rejected (returns `undefined`)
3. Valid numbers are cycled to 1-6 range
4. If component is already rendered, trigger re-render

### Rendering Strategy

The component uses a simple replacement strategy:

```javascript
render() {
  const old = this.rendered;              // Store reference to old element
  this.rendered = this.dom.main();        // Create new element
  if (old) {
    old.replaceWith(this.rendered);       // Replace if exists
  } else {
    this.shadowRoot.appendChild(this.rendered); // Append if first render
  }
  return this.rendered;
}
```

This approach:
- ✅ Simple and easy to understand
- ✅ Always creates fresh elements
- ✅ Avoids state management complexity
- ⚠️ Recreates DOM on every render (acceptable for simple components)
- ⚠️ Loses focus if heading was focused during update

### DOM Factory

The `dom` object provides a factory pattern for creating elements:

```javascript
dom = {
  main: () => {
    const result = document.createElement('h' + this.level);
    result.appendChild(document.createElement('slot'));
    return result;
  }
};
```

This pattern:
- Centralizes element creation logic
- Makes it easy to override in subclasses
- Keeps render logic clean

## Best Practices

1. **Semantic HTML**: Use appropriate heading levels for document structure
2. **Accessibility**: Maintain proper heading hierarchy (don't skip levels)
3. **Performance**: The component is lightweight and efficient for typical use
4. **Styling**: Apply styles to the `title-ponent` element, not internal headings
5. **Events**: Use the component's click behavior or attach custom event listeners

## Browser Compatibility

The Title component requires:
- ES6 Modules support
- Custom Elements v1
- Shadow DOM v1
- Proxy support

Supported browsers:
- Chrome/Edge 63+
- Firefox 63+
- Safari 11.1+
- Opera 50+

## Performance Considerations

- **Rendering**: Full DOM replacement on level changes (minimal impact for headings)
- **Memory**: One heading element in shadow DOM per component instance
- **Events**: Single click listener per component
- **Updates**: O(1) complexity for level changes

## Troubleshooting

### Component doesn't register

**Issue**: `title-ponent` is not recognized

**Solution**: Ensure the module is imported:
```javascript
import { Title } from './index.js';
// or
import './src/Title.js';
```

### Level doesn't change

**Issue**: Setting `level` attribute doesn't update the heading

**Solution**: Ensure you're setting a valid number:
```html
<!-- Correct -->
<title-ponent level="3">Title</title-ponent>

<!-- Incorrect -->
<title-ponent level="three">Title</title-ponent>
```

### Styling doesn't apply

**Issue**: CSS styles don't affect the heading

**Solution**: Style the component element, or use CSS custom properties:
```css
/* Style the component */
title-ponent {
  color: blue;
  font-family: Arial;
}

/* Or use ::slotted for content */
title-ponent::slotted(*) {
  color: red;
}
```

### Click doesn't cycle

**Issue**: Clicking the component doesn't change the level

**Solution**: Check that JavaScript is enabled and event listener is attached in `connectedCallback`

## See Also

- [Webponent Base Class](Webponent.md) - Full API reference
- [Examples](../examples/) - More usage examples
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - MDN documentation

## Note on Production Use

As mentioned in the documentation, this is an educational example demonstrating Webponents features. For production use, consider:
- Adding ARIA attributes for accessibility
- Implementing more sophisticated rendering strategies
- Adding error handling and validation
- Providing more comprehensive styling options
- Adding unit tests

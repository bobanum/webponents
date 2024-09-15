# The Webponent class

Guidlines for creating a Web Component using the `Webponent` class.

The `Webponent` class is a base class for all components. It provides a set of methods and properties that are common to all components.

> **Legend:**
> ⌂ = Standard Web Component Feature;
> ⧖ = Not implemented yet;
> ⧗ = In progress;

## Properties

| Property           | static | Type   | Default | Description                                      |
| ------------------ | ------ | ------ | ------- | ------------------------------------------------ |
| baseUrl            | No     | String |         | The base URL of the component.                   |
| evt                | No     | Object | {}      | The events to be added to the component.         |
| observedProps      | Yes    | Object | {}      | The props(attributes) definitions.               |
| observedAttributes | Yes    | Array  | []      | The attributes to be observed by the component.  |
| slotEvt            | No     | Object | {}      | The events to be added to the component's slots. |
| styleUrl           | Yes    | String |         | The URL of the component's style.                |
| tagName            | Yes    | String |         | The tag name of the component.                   |
| templateUrl        | Yes    | String |         | The URL of the component's template.             |

### The 'baseUrl' property

To be documented.

### The 'evt' property

To be documented.

### The 'observedAttributes' property ⌂

Is an array that contains the attributes to be observed by the component.

The attributes are observed by the `attributeChangedCallback` method. The method is called when an attribute is added, removed, or changed.

### The `observedProps` property ⧗

Is a generic object that contains the attributes to be observed by the component. The key is the attribute name and the value is the 'definition' of the attribute.

- If the 'definition' is a string, the attribute is observed and the value is the default value.
- If the 'definition' is a function, the attribute is observed and the function is called when the attribute is changed.
- If the 'definition' is an object, the attribute is observed and the value is processed according to the `definition` object.

#### The `definition` object

- The `definition` object can have the following properties:
  - `type`: {string} The type of the attribute. The default value is `String`.
  - `value`: {mixed} The default value of the attribute.
  - `reflect`: {boolean} Indicates if the attribute should be reflected to the property. The default value is `true`.
  - `required`: {boolean} Indicates if the attribute is required. The default value is `false`.
  - `coerce`: {function} A function that coerces the attribute value. The default value is `null`. The function tries to coerce the value to the specified type. If the coercion fails, the value is invalid and `undefined` is returned.
  - `validate`: {function} A function that validates the attribute value. The default value is `null`. If the function returns anything other than `null` or `undefined`, the value (coerced or not) is return.

```javascript
static observedProps = {
    age: {
        type: Number,
        value: 18,
        reflect: true,
        required: true,
        coerce: (value) => parseInt(value),
        validate: (value) => value > 0 ? null : value,
    }
};
```

#### Validation sequence

- If the attribute is not present or is empty
  - If required is `true` : return `undefined`.
  - If required is `false` : return `''` or the default value.
- If the attribute is not of the good type, return `undefined`.
- If there is a coerce function and a validate function, pass the "coerce" result to "validate" and return the result.
- If there is only a `coerce` function or a `validate` function, pass the value to that function and return the result.
- Else return the value.

### The 'slotEvt' property

To be documented.

### The 'styleUrl' property

To be documented.

### The 'tagName' property

To be documented.

### The 'templateUrl' property

To be documented.

## Overloadable Methods

| Method                   | Static | Async | Description                                                        |
| ------------------------ | ------ | ----- | ------------------------------------------------------------------ |
| connectedCallback        | No     | No    | Called when the custom element is connected to the document's DOM. |
| disconnectedCallback     | No     | No    | Called when the custom element is removed from the DOM.            |
| adoptedCallback          | No     | No    | Called when the custom element is moved to a new document.         |
| attributeChangedCallback | No     | No    | Called when an attribute is added, removed, or changed.            |
| init                     | Yes    | Yes   | Initializes the component.                                         |

### The `connectedCallback` method ⧖⌂

To be documented.

### The `disconnectedCallback` method ⧖⌂

To be documented.

### The `adoptedCallback` method ⧖⌂

To be documented.

### The `attributeChangedCallback` method ⧖⌂

To be documented.

### The `init` method

**Syntax** : `static init(meta, template)`

Must be called in each webponent to :

- Define the custom element.
- Load the template if given or.
- The `meta` parameter is the import.meta of the component. It is used to get the URL of the component.

```javascript
export default class MyComponent extends Webponent {
    ...
}
MyComponent.init(import.meta);
```

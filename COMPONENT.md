# The class Component

The class `Component` is a base class for all components. It provides a set of methods and properties that are common to all components.

## Properties
| Property             | static | Type   | Default | Description                                      |
| -------------------- | ------ | ------ | ------- | ------------------------------------------------ |
| evt                  | No     | Object | {}      | The events to be added to the component.         |
| slotEvt              | No     | Object | {}      | The events to be added to the component's slots. |
| observedAttributes   | Yes    | Array  | []      | The attributes to be observed by the component.  |
| baseUrl              | No     | String |         | The base URL of the component.                   |
| styleUrl             | Yes    | String |         | The URL of the component's style.                |
| templateUrl          | Yes    | String |         | The URL of the component's template.             |
| tagName              | Yes    | String |         | The tag name of the component.                   |
| observableAttributes | Yes    | Object | {}      | The attributes to be observed by the component.  |
| url                  | Yes    | String |         | The URL of the component.                        |

## Overloadable Methods
| Method                                             | Async | Description                                                        |
| -------------------------------------------------- | ----- | ------------------------------------------------------------------ |
| connectedCallback()                                | No    | Called when the custom element is connected to the document's DOM. |
| disconnectedCallback()                             | No    | Called when the custom element is removed from the DOM.            |
| adoptedCallback()                                  | No    | Called when the custom element is moved to a new document.         |
| attributeChangedCallback(name, oldValue, newValue) | No    | Called when an attribute is added, removed, or changed.            |
| static init()                                      | No    | Initializes the component.                                         |


# Webponents

Webponents is a library of web components that can be used to build web applications. It is built on top of the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standard.

## Installation

```bash
npm install @bobanum/webponents
```

## Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webponents</title>
  <script type="module" src="path/to/webponents/Window/index.js"></script>
</head>
<body>
  <web-window>Hello World</web-window>
</body>
</html>
```

## Creating a Webponent

To create a Webponent, you need to extend the `Webponent` class and define the component's template and style.

[read Webponent documentation](WEBPONENT.md)

```javascript
### Files

```text
── MyWebponent
   ├─ index.js
   ├─ style.scss
   ├─ example.html
   ├─ index.tpl
   └─ README.md
```

## Components

| Component                                | Description                        |
| ---------------------------------------- | ---------------------------------- |
| [Button](Button/README.md)               | A button component just for tests. |
| [DraggableList](DraggableList/README.md) | A list of draggable items.         |
| [Page](Page/README.md)                   | A page component to help printing. |
| [Panel](Panel/README.md) ‡               | A panel component.                 |
| [Tabs](Tabs/README.md) ‡                 | A tabs component.                  |
| [TOC](TOC/README.md) ‡                   | A table of contents component.     |
| [Upload](Upload/README.md)               | A file upload component.           |
| [Window](Window/README.md)               | A window component. Modal or not   |

‡ = Webponent idea

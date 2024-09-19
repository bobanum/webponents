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
  <window-ponent>Hello World</window-ponent>
</body>
</html>
```

## Creating a Webponent

To create a Webponent, you need to extend the `Webponent` class and define the component's template and style.

[read Webponent documentation](WEBPONENT.md)

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

| Logo |Component                      | Description                        | Status      |
| --|------------------------------ | ---------------------------------- | ----------- |
| ![](Page/logo.svg)|[Page](Page/README.md)         | A page component to help printing. | Functionnal |
| ![](Panel/logo.svg)|[Panel](Panel/README.md) ‡     | A panel component.                 | To Do       |
| ![](Sortable/logo.svg)|[Sortable](Sortable/README.md) | A sortable list component.         | Skeleton    |
| ![](Tabs/logo.svg)|[Tabs](Tabs/README.md) ‡       | A tabs component.                  | To Do       |
| ![](TOC/logo.svg)|[TOC](TOC/README.md) ‡         | A table of contents component.     | To Do       |
| ![](Upload/logo.svg)|[Upload](Upload/README.md)     | A file upload component.           | Functionnal |
| ![](Modal/logo.svg)|[Modal](Modal/README.md)       | A window component. Modal or not   | Functionnal |
| ![](Starter/logo.svg)|[Starter](Starter/README.md)   | A starter base component.          | Example     |
| ![](Ref/logo.svg)|[Ref](Ref/README.md)   | Include another page in the page          | In progress     |
| ![](Menu/logo.svg)|[Menu](Menu/README.md)   | Include another page in the page          | In progress     |

‡ = Webponent idea

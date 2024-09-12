# Modal Component

The Modal component is a container that can be used to display content in a window-like container. It can be used to display content in a modal or a popup.

## Usage

```html
    <script type="module">
       import Modal from './src/components/Modal/index.js';
       // OR
       // import { Modal } from './src/components/index.js';
       // OR
       // import './src/components/index.js';
    </script>

    <my-modal class="open" x="25%" width="50%" height="50%">
       <slot slot="title">Un titre</slot>
       <h1>Hello World</h1>
    </my-modal>
```

> **Legend :**
> ⧖: Not implemented yet;
> ⧗: Partially implemented;

## Attributes

| Attribute   | Default    | Description                            |
| ----------- | ---------- | -------------------------------------- |
| title       | 'untitled' | The title of the modal.               |
| x           | 0          | The horizontal position of the modal. |
| y           | 0          | The vertical position of the modal.   |
| width       | auto       | The width of the modal.               |
| height      | auto       | The height of the modal.              |
| min-width⧖  | 0          | The minimum width of the modal.       |
| min-height⧖ | 0          | The minimum height of the modal.      |
| max-width⧖  | infinite   | The maximum width of the modal.       |
| max-height⧖ | infinite   | The maximum height of the modal.      |
| headerless⧖ |            | Removes the modal header.             |
| footerless⧖ |            | Removes the modal footer.             |

## Classes

| Class       | Description                  |
| ----------- | ---------------------------- |
| modal⧖      | Makes the window a modal.    |
| fixed⧖      | Makes the modal fixed.      |
| fixed-size⧖ | Makes the modal fixed size. |

## Slots

| Slot   | Description        |
| ------ | ------------------ |
| footer | The modal footer. |

## CSS Custom Properties⧖

| Property      | Default                                         | Description                          |
| ------------- | ----------------------------------------------- | ------------------------------------ |
| --h           | 0%                                              | The modal hue.                      |
| --s           | 0%                                              | The modal saturation.               |
| --l           | 80%                                             | The modal lightness.                |
| --d           | 15%                                             | The modal darkness (for dark mode). |
| --a           | 1                                               | The modal alpha.                    |
| --bg          | hsl(var(--h), var(--s), var(--l))               | The modal background color.         |
| --color       | hsl(var(--h), var(--s), var(--d))               | The modal text color.               |
| --border      | 0px solid hsv(var(--h), var(--s), var(--color)) | The modal border width.             |
| --radius      | .25rem                                          | The modal border radius.            |
| --shadow      | .1em .1em .3em #0006;                           | The modal shadow.                   |
| --title-bg    | hsl(var(--h), var(--s), var(--d))               | The modal title background color.   |
| --title-color | hsl(var(--h), var(--s), var(--l))               | The modal title text color.         |

## Events⧗

| Event  | Description               |
| ------ | ------------------------- |
| close  | The modal is closed.     |
| ok     | Button ok is clicked.     |
| cancel | Button cancel is clicked. |

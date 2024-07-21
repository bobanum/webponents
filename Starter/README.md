# Window Component

The Window component is a container that can be used to display content in a window-like container. It can be used to display content in a modal or a popup.

## Usage

```html
	<script type="module">
		import Window from './src/components/Window/index.js';
		// OR
		// import { Window } from './src/components/index.js';
		// OR
		// import './src/components/index.js';
	</script>

	<my-window class="open" x="25%" width="50%" height="50%">
		<slot slot="title">Un titre</slot>
		<h1>Hello World</h1>
	</my-window>
```

## Attributes
| Attribute   | Default    | Description                            |
| ----------- | ---------- | -------------------------------------- |
| title       | 'untitled' | The title of the window.               |
| x           | 0          | The horizontal position of the window. |
| y           | 0          | The vertical position of the window.   |
| width       | auto       | The width of the window.               |
| height      | auto       | The height of the window.              |
| min-width⧖  | 0          | The minimum width of the window.       |
| min-height⧖ | 0          | The minimum height of the window.      |
| max-width⧖  | infinite   | The maximum width of the window.       |
| max-height⧖ | infinite   | The maximum height of the window.      |
⧖: Not implemented yet.
⧗: Partially implemented.

## Classes
| Class       | Description                  |
| ----------- | ---------------------------- |
| modal⧖      | Makes the window a modal.    |
| fixed⧖      | Makes the window fixed.      |
| fixed-size⧖ | Makes the window fixed size. |
| headerless⧖ | Removes the window header.   |
| footerless⧖ | Removes the window footer.   |

## Slots
| Slot | Description |
| ---- | ----------- |
| xxx  | xxx         |

## CSS Custom Properties⧖
| Property             | Default                                                | Description                          |
| -------------------- | ------------------------------------------------------ | ------------------------------------ |
| --h                  | 0%                                                     | The window hue.                      |
| --s                  | 0%                                                     | The window saturation.               |
| --l                  | 80%                                                    | The window lightness.                |
| --d                  | 15%                                                    | The window darkness (for dark mode). |
| --background  | hsl(var(--h), var(--s), var(--l))                      | The window background color.         |
| --color       | hsl(var(--h), var(--s), var(--d))                      | The window text color.               |
| --border      | 0px solid hsv(var(--h), var(--s), var(--color)) | The window border width.             |
| --radius      | .25rem                                                 | The window border radius.            |
| --shadow      | .1em .1em .3em #0006;                                  | The window shadow.                   |
| --title-bg    | hsl(var(--h), var(--s), var(--d))                      | The window title background color.   |
| --title-color | hsl(var(--h), var(--s), var(--l))                      | The window title text color.         |

## Events⧗
| Event  | Description               |
| ------ | ------------------------- |
| close  | The window is closed.     |
| ok     | Button ok is clicked.     |
| cancel | Button cancel is clicked. |
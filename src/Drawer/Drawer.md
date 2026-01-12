# Drawer

## Overview

`<drawer>` is a lightweight slide-out panel web component. It provides a handle, an optional pin control, and a content slot. The component supports placement on any side, a configurable size, and a pinned state that offsets its parent element.

## Quick Usage

Basic example:

```html
<drawer>
  <p>Your drawer content here</p>
</drawer>
```

With attributes:

```html
<drawer side="right" size="300" pinned open>
  <nav>Navigation...</nav>
</drawer>
```

## Properties / Attributes

- `pinned` (Boolean) — When true the drawer is pinned open and attempts to offset its parent element so content is not covered.
- `size` (Number, default: `250`) — Width (or height for top/bottom) of the drawer in pixels. The component exposes the CSS variable `--drawer-size` which is set to `size + 'px'`.
- `side` (String, default: `'left'`) — One of `left`, `right`, `top`, or `bottom`. Controls which side the drawer opens from.
- `open` (Boolean) — Controls whether the drawer is open.

Notes:
- `size` is used to set the CSS variable `--drawer-size`.
- When `pinned` is toggled via the built-in pin control, the component sets the corresponding margin on its `parentNode` to `250px` (the current code uses a hard-coded `250px` value when pinning).

## DOM structure & Parts

The component builds an internal DOM with named parts you can style via the `::part()` selector:

- `handle` — the draggable/visible handle element. Part name: `handle`.
- `content` — the main content container (contains the slot). Part name: `content`.
- `pin` — the pin control element. Part name: `pin`.

Example styling using parts:

```css
drawer::part(handle) { cursor: grab; }
drawer::part(content) { padding: 16px; }
drawer::part(pin) { width: 24px; height: 24px; }
```

You can also customize the size using the `--drawer-size` CSS variable:

```css
drawer { --drawer-size: 300px; }
```

## Events

The component does not dispatch custom events by default. Interaction is primarily through attributes/properties and the built-in pin control.

## Accessibility

- The element sets `tabIndex` to `1` so it can receive keyboard focus. Consider managing keyboard interactions externally if you need to support closing/opening with keys.

## Examples

Programmatic usage:

```javascript
const d = document.querySelector('drawer');
d.size = 320; // updates --drawer-size
d.pinned = true;
d.side = 'right';
d.open = true;
```

Pinned behavior note:

When the internal pin element is clicked it toggles `pinned` and will set the corresponding margin on the drawer's `parentNode` (left/right/top/bottom) to `250px` or clear it when unpinned. If you rely on a dynamic `size`, you may want to override this behavior or sync styles in your parent container accordingly.

## Styling and theming

- Use the provided parts to style internal pieces.
- Use the `--drawer-size` CSS variable to control the drawer dimension.

## Troubleshooting

- If pinning doesn't offset the layout as expected, ensure the drawer's parent element is the correct container that should be moved. The pin logic directly mutates `parentNode.style`.

## Source

See the implementation in `src/Drawer/index.js` for details on how properties and DOM parts are constructed.

## TODO / Suggestions

- [DONE] Make the pin offset use the dynamic `size` value instead of the hard-coded `250px` so pinning respects the configured drawer dimension.
- [TODO] Dispatch custom events for state changes: `drawer-open`, `drawer-close`, and `drawer-pin` (or similar) so host apps can react declaratively.
- [TODO] Add keyboard interactions and ARIA attributes: support `Escape` to close, arrow keys to open/close, and use `role="dialog"` / `aria-hidden` when appropriate.
- Expose a `pin-size` or compute the margin from `--drawer-size` so parent offset can be customized and animated.
- Add CSS variables for transitions and easing (`--drawer-transition-duration`, `--drawer-transition-easing`).
- Provide a demo page under `examples/` that showcases `side`, `size`, `pinned`, and `open` combinations, plus responsive behaviors.
- Add unit/integration tests around property setters and DOM mutations (pin behavior, `--drawer-size` updates).
- Improve the handle to support drag-to-resize for size adjustments (optionally behind a feature flag).
- Consider exposing a `pin()` / `unpin()` method on the element to allow programmatic control without mutating `parentNode` directly... [It is through the `pinned` property already.]
- Make the pinned state stay on reload (e.g., via `localStorage` or `sessionStorage`) if desired.
- Allow other attachments possible other then fixed.
- Allow uncentered handle placement.
- Use clip-path for better performance on animations.
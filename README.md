# Radix Tree jQuery Plugin

[![npm version](https://badge.fury.io/js/jquery-radix-tree.svg)](https://badge.fury.io/js/jquery-radix-tree)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/dxmari/jquery-radix-tree/badge)](https://www.jsdelivr.com/package/gh/dxmari/jquery-radix-tree)
[![GitHub stars](https://img.shields.io/github/stars/dxmari/jquery-radix-tree?style=social)](https://github.com/dxmari/jquery-radix-tree)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A powerful, modern, and highly interactive tree view component for jQuery, supporting deep nesting, lazy loading, checkboxes, badges, tags, keyboard navigation, infinite scroll, and more.  
Perfect for dashboards, data explorers, and any UI that needs a dynamic, hierarchical structure.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Lazy Loading](#lazy-loading)
  - [Badges & Tags](#badges--tags)
  - [Infinite Scroll](#infinite-scroll)
  - [Disabled Nodes](#disabled-nodes)
  - [Command API](#command-api)
  - [Dynamic Class Names](#dynamic-class-names)
  - [Lazy Load Delay & Pagination Size](#lazy-load-delay--pagination-size)
- [Data Structure](#data-structure)
- [Styling & Customization](#styling--customization)
- [Keyboard Navigation](#keyboard-navigation)
- [File Overview](#file-overview)
- [Development & Testing](#development--testing)
- [License](#license)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Advanced Customization](#advanced-customization)
- [Events & Callbacks](#events--callbacks)
- [Accessibility](#accessibility)
- [Contributing](#contributing)
- [Who's Using Radix Tree?](#whos-using-radix-tree)

---

## Features

- **Deeply Nested Trees:** Supports unlimited levels of nesting.
- **Checkboxes:** Each node can have a checkbox, with indeterminate and parent-child propagation.
- **Lazy Loading:** Load children on demand, with async support and paging.
- **Badges & Tags:** Display badges (numbers, labels) and tags on any node.
- **Infinite Scroll:** For large datasets, load more nodes as you scroll.
- **Disabled Nodes:** Disable any node or entire subtrees.
- **Keyboard Navigation:** Full arrow-key and space/enter navigation.
- **Custom Callbacks:** onExpand, onCollapse, onClick, onCheck, and lazyLoad.
- **Dynamic Data:** Update the tree data or structure at runtime.
- **Modern UI:** SVG-based checkboxes, beautiful lines, and smooth focus/hover states.
- **Accessible:** ARIA-friendly, focusable, and keyboard-usable.
- **Lightweight:** No dependencies except jQuery.

---

## Demo

Open `index.html` in your browser to see the tree in action.  
You can also experiment with different data and features by editing `index.js`.

---

## Getting Started

1. **Include jQuery and the plugin:**
   ```html
   <script src="https://code.jquery.com/jquery-3.7.1.slim.min.js"></script>
   <script src="tree.js"></script>
   <link rel="stylesheet" href="style.css">
   ```

2. **Add a container:**
   ```html
   <div class="radix-tree"></div>
   ```

3. **Initialize the tree:**
   ```js
   $('.radix-tree').radixTree({ data: myData });
   ```

---

## CDN Usage

**jsDelivr (GitHub):**
```html
<!-- jQuery (required) -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<!-- Radix Tree Plugin (latest) -->
<script src="https://cdn.jsdelivr.net/gh/dxmari/jquery-radix-tree@latest/tree.js"></script>
<!-- No CSS needed! -->
<div class="radix-tree"></div>
<script>
  $('.radix-tree').radixTree({ data: [ /* ... */ ] });
</script>
```

**jsDelivr (specific version):**
```html
<script src="https://cdn.jsdelivr.net/gh/dxmari/jquery-radix-tree@v1.0.0/tree.js"></script>
```

**unpkg (npm):**
```html
<script src="https://unpkg.com/jquery-radix-tree@latest/dist/tree.js"></script>
```

## NPM Usage

```sh
npm install jquery-radix-tree
```

```js
import 'jquery-radix-tree/dist/tree.js';
import $ from 'jquery';
$('.radix-tree').radixTree({ data: [ /* ... */ ] });
```

---

## Usage

### Basic Example

```js
const data = [
  {
    label: 'Universe',
    open: true,
    children: [
      { label: 'Galaxies', children: [ { label: 'Milky Way' }, { label: 'Andromeda' } ] },
      { label: 'Black Holes' }
    ]
  }
];
$('.radix-tree').radixTree({ data });
```

### Lazy Loading

Load children only when a node is expanded.  
The `lazyLoad` callback receives the node and a `done` function. Call `done(childrenArray)` when ready.

```js
function myLazyLoad(node, done) {
  setTimeout(() => {
    if (node.label === 'Galaxies') {
      done([{ label: 'Milky Way' }, { label: 'Andromeda' }]);
    } else {
      done([{ label: 'No data' }]);
    }
  }, 1000); // This delay is now controlled by the lazyLoadDelay option
}
$('.radix-tree').radixTree({
  data: [{ label: 'Galaxies', lazy: true }],
  lazyLoad: myLazyLoad,
  lazyLoadDelay: 1500 // Set delay dynamically (ms)
});
```

### Badges & Tags

Add badges and tags to any node for extra context.

```js
const data = [
  {
    label: 'Projects',
    badge: 2,
    tags: ['active'],
    children: [
      { label: 'Frontend', badge: 'New', tags: ['UI', 'urgent'], lazy: true },
      { label: 'Backend', badge: 5, tags: ['API'], lazy: true }
    ]
  }
];
$('.radix-tree').radixTree({ data });
```

### Infinite Scroll

For very large folders, enable infinite scroll and lazy paging:

```js
const demoData = [
  {
    label: 'Big Folder',
    open: true,
    infinite: true, // enables infinite scroll for this node
    lazy: true,     // triggers lazyLoad for paging
    badge: 100,
    tags: ['infinite', 'files']
  }
];

function infiniteLazyLoad(node, done, opts, delay) {
  const total = 100;
  const page = opts && opts.page ? opts.page : 1;
  const pageSize = opts && opts.pageSize ? opts.pageSize : 20; // Controlled by pageSize option
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const children = [];
  for (let i = start; i < end; i++) {
    children.push({
      label: 'File ' + (i + 1),
      badge: (i % 2 === 0) ? 'even' : 'odd',
      tags: (i % 10 === 0) ? ['milestone'] : []
    });
  }
  setTimeout(() => {
    done(children, end < total); // hasMore = true if more pages
  }, delay); // Use the dynamic delay
}

// Example 1: Small pageSize, default threshold (pagination enabled for 5)
$('.radix-tree-small').radixTree({
  data: demoData,
  lazyLoad: infiniteLazyLoad,
  pageSize: 5,         // Pagination enabled for 5 (default threshold is 5)
  lazyLoadDelay: 800
});

// Example 2: Custom threshold (pagination only for pageSize >= 10)
$('.radix-tree-large').radixTree({
  data: demoData,
  lazyLoad: infiniteLazyLoad,
  pageSize: 5,         // Pagination NOT enabled for 5 (threshold is 10)
  paginateThreshold: 10,
  lazyLoadDelay: 800
});
```

### Disabled Nodes

You can disable any node or entire subtrees:

```js
const data = [
  {
    label: 'Root',
    open: true,
    children: [
      { label: 'Enabled Node' },
      {
        label: 'Disabled Subtree',
        disabled: true,
        children: [
          { label: 'Child 1' },
          { label: 'Child 2', children: [{ label: 'Grandchild 1' }] }
        ]
      }
    ]
  }
];
$('.radix-tree').radixTree({ data });
```

### Dynamic Class Names

You can add custom classes to the root container, parent nodes, and child nodes for advanced styling:

#### Root Container Class
```js
$('.my-tree').radixTree({
  rootClassName: 'custom-root-class', // Added to the root container
  data: [ /* ...tree data... */ ]
});
```

#### Parent Node Class
```js
const data = [
  {
    label: 'Fruits',
    open: true,
    className: 'parent-fruits', // Added to the <li> for this parent node
    children: [
      { label: 'Apple', checked: true },
      { label: 'Banana' }
    ]
  }
];
$('.my-tree').radixTree({ data });
```

#### Child Node Class
```js
const data = [
  {
    label: 'Fruits',
    open: true,
    children: [
      { label: 'Apple', checked: true, className: 'child-apple' }, // Added to <li> for this child node
      { label: 'Banana', className: 'child-banana' }
    ]
  }
];
$('.my-tree').radixTree({ data });
```

#### Combined Example
```js
const data = [
  {
    label: 'Fruits',
    open: true,
    className: 'parent-fruits',
    children: [
      { label: 'Apple', checked: true, className: 'child-apple' },
      { label: 'Banana', className: 'child-banana' }
    ]
  },
  {
    label: 'Vegetables',
    open: true,
    className: 'parent-veggies',
    children: [
      { label: 'Carrot', className: 'child-carrot' },
      { label: 'Broccoli', className: 'child-broccoli' }
    ]
  }
];
$('.my-tree').radixTree({
  rootClassName: 'custom-root',
  data
});
```

### Lazy Load Delay & Pagination Size

You can control the delay for lazy loading and the number of items per page for infinite scroll/lazy loading:

- `lazyLoadDelay` (number, default: 1000): Delay in milliseconds before lazy loaded children are returned (simulates async loading).
- `pageSize` (number, default: 20): Number of items to load per page for infinite scroll/lazy loading.
- `paginateThreshold` (number, optional): Minimum pageSize to enable pagination/scroll. If not provided, defaults to Math.min(10, pageSize).

**Example (default threshold):**
```js
$('.radix-tree').radixTree({
  data: myData,
  pageSize: 5,         // Pagination enabled for 5 (default threshold is 5)
  lazyLoadDelay: 500   // 500ms delay for lazy loading
});
```

**Example (custom threshold):**
```js
$('.radix-tree').radixTree({
  data: myData,
  pageSize: 5,
  paginateThreshold: 10, // Pagination only enabled for pageSize >= 10
  lazyLoadDelay: 500
});
```

### Command API

Interact with the tree after initialization:

```js
// Get all checked nodes
const checked = $('.radix-tree').radixTree('getChecked');

// Set a node as checked
$('.radix-tree').radixTree('setChecked', nodeId, true);

// Expand/collapse nodes programmatically
$('.radix-tree').radixTree('expand', nodeId);
$('.radix-tree').radixTree('collapse', nodeId);

// Get or set the entire data
const currentData = $('.radix-tree').radixTree('getData');
$('.radix-tree').radixTree('setData', newData);
```

---

## Data Structure

Each node is an object with these properties:

- `label` (string): The display text.
- `children` (array): Child nodes.
- `open` (bool): Whether the node is expanded.
- `checked` (bool): Checkbox state.
- `indeterminate` (bool): Checkbox indeterminate state.
- `lazy` (bool): If true, children are loaded on demand.
- `badge` (string|number): Optional badge.
- `tags` (array): Optional tags.
- `disabled` (bool): Disable the node.
- `infinite` (bool): Enable infinite scroll for this node.
- `className` (string): Custom class for this node's `<li>`. Applies to parent or child nodes.
- `lazyLoadDelay` (number): Delay in ms for lazy loading (plugin option, not per node).
- `pageSize` (number): Items per page for infinite scroll/lazy load (plugin option, not per node).
- `paginateThreshold` (number, optional): Minimum pageSize to enable pagination/scroll. If not provided, defaults to Math.min(10, pageSize).

**Example:**
```js
{
  label: 'Frontend',
  open: true,
  checked: false,
  lazy: true,
  badge: 'New',
  tags: ['UI', 'urgent'],
  disabled: false,
  infinite: false,
  children: [ ... ],
  className: 'custom-class',
  lazyLoadDelay: 1000,
  pageSize: 20,
  paginateThreshold: 5
}
```

---

## Styling & Customization

- All styles are in `style.css`.
- Uses CSS variables for easy theming.
- SVG-based checkboxes for modern look.
- Customizable spacing, colors, and more.
- You can override styles or add your own classes for further customization.

---

## Keyboard Navigation

- **Arrow Up/Down:** Move between nodes.
- **Arrow Right:** Expand a node.
- **Arrow Left:** Collapse a node.
- **Space/Enter:** Toggle checkbox or expand/collapse.
- **Tab:** Move focus into and out of the tree.

---

## File Overview

- `index.html` — Main HTML entry point.
- `tree.js` — The jQuery plugin (UMD, works in browser and Node).
- `index.js` — Example usage, data, and advanced demos.
- `data.js` — Example data structure for the tree.
- `style.css` — All styles for the tree and UI.
- `expand-collapse.svg` — SVG icon for expand/collapse (inlined in CSS).
- `.gitignore` — Node, macOS, and log file ignores.

---

## Development & Testing

- **Testing:** (Optional) Mocha/Chai tests are available for plugin logic.
- **Customization:** Fork and edit `tree.js` and `style.css` for your needs.
- **Contributions:** PRs and issues welcome!
- **Advanced:** You can use the plugin in Node.js for server-side rendering or testing.

---

## License

MIT License.  
See [LICENSE](LICENSE) for details.

---

## Troubleshooting

- **Tree not rendering?**  
  Make sure you included jQuery and the plugin script before your initialization code.

- **Checkboxes not working?**  
  Check for JavaScript errors in the console and ensure your data structure is correct.

- **Custom classes not appearing?**  
  Verify you are using the `className` and `rootClassName` options as shown in the examples.

---

## FAQ

**Q: How do I update the tree data after initialization?**  
A: Use the command API:  
```js
$('.radix-tree').radixTree('setData', newData);
```

**Q: How do I get the checked nodes?**  
A:  
```js
const checked = $('.radix-tree').radixTree('getChecked');
```

**Q: Can I use custom icons or templates for nodes?**  
A: Not out of the box, but you can fork and extend `renderTree` for custom rendering.

---

## Advanced Customization

You can override any style in `style.css` or add your own classes via the `className` and `rootClassName` options.

**Example:**
```css
.custom-root {
  background: #f9f9f9;
  border: 2px solid #bada55;
}
.parent-fruits {
  font-weight: bold;
  color: #4caf50;
}
.child-apple {
  color: #e53935;
}
```

---

## Events & Callbacks

You can hook into tree events for custom logic:

```js
$('.radix-tree').radixTree({
  data,
  onExpand: (node, detailsElem) => {
    console.log('Expanded:', node.label);
  },
  onCollapse: (node, detailsElem) => {
    console.log('Collapsed:', node.label);
  },
  onClick: (node, elem) => {
    alert('Clicked: ' + node.label);
  },
  onCheck: (node, checkboxElem) => {
    console.log('Checked:', node.label, checkboxElem.checked);
  }
});
```

---

## Accessibility

- All checkboxes and labels are accessible and keyboard-navigable.
- Use Tab, Arrow keys, Space, and Enter to navigate and interact.
- The tree uses ARIA attributes for better screen reader support.

---

## Contributing

We welcome pull requests and issues!  
To contribute:
- Fork the repo
- Create a feature branch
- Add tests if possible
- Open a PR with a clear description

For questions, open an issue or start a discussion.

---

## Who's Using Radix Tree?

Here are some awesome projects and companies using Radix Tree:

| Logo | Name/Link | Description |
|------|-----------|-------------|
| ![Example Logo](https://placehold.co/40x40) | [Awesome Dashboard](https://example.com) | Enterprise data explorer for finance teams |
| ![Example Logo](https://placehold.co/40x40) | [OpenSource CRM](https://example.com) | Open-source customer management platform |
| ... | ... | ... |

> Are you using Radix Tree? [Open a PR](https://github.com/dxmari/jquery-radix-tree/pulls) or [let us know!](mailto:maaricse8@gmail.com)
> We'd love to feature your project here!

---

**Enjoy your new interactive tree!**  
For questions or contributions, open an issue or PR on GitHub.

> “Integrating the Radix Tree jQuery Plugin into our platform was seamless and impactful. Its flexibility and performance allowed us to build complex, interactive data views with minimal effort. The plugin’s robust feature set and excellent documentation made it easy for our team to customize and scale as our needs evolved. Highly recommended for any engineering team looking for a reliable tree component.”
>
> — [CultureMonkey](https://www.culturemonkey.io/), Siva Samraj, Director Of Engineering

> “Radix Tree has been a game-changer for our UI development. The plugin’s intuitive API and responsive design enabled us to deliver a polished, user-friendly experience to our clients. We especially appreciate the attention to detail in handling large datasets and multiple instances. Support from the maintainers has been prompt and helpful. It’s now our go-to solution for tree structures.”
>
> — [effy](https://www.effy.co.in/), Gopi, Engineering Manager
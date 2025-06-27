# Radix Tree jQuery Plugin

[![npm version](https://badge.fury.io/js/jquery-radix-tree.svg)](https://badge.fury.io/js/jquery-radix-tree)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/dxmari/jquery-radix-tree/badge)](https://www.jsdelivr.com/package/gh/dxmari/jquery-radix-tree)
[![GitHub stars](https://img.shields.io/github/stars/dxmari/jquery-radix-tree?style=social)](https://github.com/dxmari/jquery-radix-tree)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A powerful, modern, and highly interactive tree view component for jQuery, supporting deep nesting, lazy loading, checkboxes, badges, tags, keyboard navigation, infinite scroll, sibling detection, and more.  
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
  - [Sibling Detection](#sibling-detection)
  - [Enhanced Events](#enhanced-events)
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
- [Recent Improvements (v1.0.2)](#recent-improvements-v102)

---

## Features

- **Deeply Nested Trees:** Supports unlimited levels of nesting.
- **Checkboxes:** Each node can have a checkbox, with indeterminate and parent-child propagation.
- **Lazy Loading:** Load children on demand, with async support and paging.
- **Badges & Tags:** Display badges (numbers, labels) and tags on any node.
- **Infinite Scroll:** For large datasets, load more nodes as you scroll.
- **Disabled Nodes:** Disable any node or entire subtrees.
- **Sibling Detection:** Get sibling nodes for any node with complete properties.
- **Enhanced Events:** All events now include sibling information and complete node properties.
- **Keyboard Navigation:** Full arrow-key and space/enter navigation.
- **Custom Callbacks:** onExpand, onCollapse, onClick, onCheck, and lazyLoad with sibling data.
- **Dynamic Data:** Update the tree data or structure at runtime.
- **Modern UI:** SVG-based checkboxes, beautiful lines, and smooth focus/hover states.
- **Accessible:** ARIA-friendly, focusable, and keyboard-usable.
- **Lightweight:** No dependencies except jQuery.

---

## Demo

Open `index.html` in your browser to see the tree in action.  
You can also experiment with different data and features by editing `index.js`.

**Additional Demo Pages:**
- **Sibling Demo:** `example/sibling-demo.html` - Test sibling detection and complete node properties
- **Expand/Collapse Test:** `example/expand-collapse-test.html` - Test enhanced expand/collapse events
- **Employee Directory:** `example/lazyload-example2.html` - Multi-level org structure with lazy loading
- **GitHub Integration:** `example/lazyload-github.html` - Real API integration example
- **Focus Mode Demo:** `example/focus-mode-demo.html` - Interactive focus mode examples
- **Multiple Focus Modes:** `example/multiple-focus-modes-demo.html` - Combine multiple focus modes
- **NodeId Demo:** `example/nodeid-demo.html` - Database integration with nodeId

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
```

### Sibling Detection

Get sibling nodes (nodes that share the same parent) for any node:

```js
// In event callbacks
onCheck: function(node, checkbox, siblings) {
  console.log('Node changed:', node.label);
  console.log('Siblings:', siblings.map(s => s.label));
  console.log('Complete sibling objects:', siblings);
}

// Programmatically
const siblings = $('.radix-tree').radixTree('getSiblings', nodeId);
console.log('Siblings:', siblings);
```

### Enhanced Events

All events now provide complete node information and sibling data:

```js
$('.radix-tree').radixTree({
  onExpand: function(node, details, siblings) {
    console.log('Node expanded:', {
      node: node.label,
      id: node.id,
      checked: node.checked,
      open: node.open,
      siblings: siblings.map(s => s.label)
    });
  },
  onCollapse: function(node, details, siblings) {
    console.log('Node collapsed:', {
      node: node.label,
      siblings: siblings.map(s => s.label)
    });
  },
  onCheck: function(node, checkbox, siblings) {
    console.log('Node checked:', {
      node: node.label,
      checked: checkbox.checked,
      siblings: siblings.map(s => s.label)
    });
  }
});
```

### Focus Mode

Control how the tree behaves when expanding nodes with configurable focus modes:

```js
$('.radix-tree').radixTree({
  data: myData,
  focusMode: {
    enabled: true,
    type: 'highlight', // Single mode: 'accordion', 'highlight', 'collapse-siblings', 'scroll'
    // OR multiple modes:
    // type: ['highlight', 'accordion'], // Combine multiple modes
    autoScroll: true,
    highlightColor: '#4caf50',
    animationDuration: 300,
    preserveRoot: true,
    maxOpenLevels: 2
  }
});
```

#### Single Mode vs Multiple Modes

**Single Mode (Default):**
```js
focusMode: {
  enabled: true,
  type: 'highlight'
}
```

**Multiple Modes (Enhanced):**
```js
focusMode: {
  enabled: true,
  type: ['highlight', 'accordion'] // Apply both modes simultaneously
}
```

**Available Mode Combinations:**
- `['highlight', 'accordion']` - Highlight current node while keeping only one open per level
- `['highlight', 'collapse-siblings']` - Highlight current node while collapsing siblings
- `['accordion', 'scroll']` - Accordion behavior with auto-scroll
- `['highlight', 'accordion', 'scroll']` - All three modes combined

**Note:** When combining modes, highlight is applied last to ensure it persists through any re-renders from other modes.

#### Focus Mode Types

**Accordion Mode (`'accordion'`):**
- Only one node open at a time per level
- Opening a new node automatically closes the previously open one
- Perfect for limited screen space

```js
focusMode: {
  enabled: true,
  type: 'accordion'
}
```

**Highlight Mode (`'highlight'`):**
- Multiple nodes can stay open
- Current node gets visual focus with colored border and background
- Includes smooth auto-scroll to the focused node

```js
focusMode: {
  enabled: true,
  type: 'highlight',
  highlightColor: '#4caf50', // Custom highlight color
  autoScroll: true
}
```

**Collapse Siblings Mode (`'collapse-siblings'`):**
- When opening a node, all its siblings automatically collapse
- Keeps the tree clean while maintaining context

```js
focusMode: {
  enabled: true,
  type: 'collapse-siblings'
}
```

**Auto-Scroll Mode (`'scroll'`):**
- Simply scrolls to the newly opened node
- Doesn't change any open/close states
- Great for large trees

```js
focusMode: {
  enabled: true,
  type: 'scroll',
  autoScroll: true
}
```

#### Focus Mode Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable/disable focus mode |
| `type` | string | `'highlight'` | Focus behavior type |
| `autoScroll` | boolean | `true` | Auto-scroll to focused node |
| `highlightColor` | string | `'#4caf50'` | Color for highlight mode |
| `animationDuration` | number | `300` | Animation duration in ms |
| `preserveRoot` | boolean | `true` | Keep root nodes open |
| `maxOpenLevels` | number | `2` | Maximum open levels |

#### Complete Focus Mode Example

```js
const treeData = [
  {
    label: '📁 Documents',
    open: true,
    children: [
      {
        label: '📄 Work',
        children: [
          { label: '📊 Reports' },
          { label: '📋 Projects' },
          { label: '📧 Emails' }
        ]
      },
      {
        label: '🏠 Personal',
        children: [
          { label: '📸 Photos' },
          { label: '📚 Books' },
          { label: '🎵 Music' }
        ]
      }
    ]
  }
];

$('.radix-tree').radixTree({
  data: treeData,
  focusMode: {
    enabled: true,
    type: ['highlight', 'accordion'], // Single mode: 'highlight' or multiple modes: ['highlight', 'accordion']
    autoScroll: true,
    highlightColor: '#4caf50',
    animationDuration: 300,
    preserveRoot: true,
    maxOpenLevels: 2
  },
  onExpand: function(node, details, siblings) {
    console.log('Focused on:', node.label);
  },
  onCollapse: function(node, details, siblings) {
    console.log('Collapsed:', node.label);
  }
});
```

**Demo:** See `example/focus-mode-demo.html` for interactive examples of all focus modes.

### Complete Node Properties

Access all node properties including internal radix tree properties:

```js
onCheck: function(node, checkbox, siblings) {
  console.log('Complete node:', {
    id: node.id,                    // Custom ID
    _radixId: node._radixId,        // Internal radix ID
    label: node.label,              // Display text
    checked: node.checked,          // Checkbox state
    open: node.open,                // Expansion state
    indeterminate: node.indeterminate, // Indeterminate state
    disabled: node.disabled,        // Disabled state
    lazy: node.lazy,                // Lazy loading flag
    children: node.children,        // Child nodes
    _radixParentId: node._radixParentId, // Parent node ID
    badge: node.badge,              // Badge text/number
    tags: node.tags,                // Array of tags
    // ... any other custom properties
  });
}
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

// Get only checked parent nodes that are currently open
const openChecked = $('.radix-tree').radixTree('getOpenChecked');

// Get only checked parent nodes that are currently closed
const closedChecked = $('.radix-tree').radixTree('getClosedChecked');

// Get all nodes that are visible in the UI (regardless of open/closed state)
const visibleNodes = $('.radix-tree').radixTree('getVisibleNodes');

// Get all checked nodes that are visible in the UI
const visibleCheckedNodes = $('.radix-tree').radixTree('getVisibleCheckedNodes');

// Set a node as checked/unchecked
$('.radix-tree').radixTree('setChecked', nodeId, true);   // Check
$('.radix-tree').radixTree('setChecked', nodeId, false);  // Uncheck

// Get sibling nodes of a specific node
const siblings = $('.radix-tree').radixTree('getSiblings', nodeId);

// Expand/collapse nodes programmatically
$('.radix-tree').radixTree('expand', nodeId);
$('.radix-tree').radixTree('collapse', nodeId);

// Get or set the entire data
const currentData = $('.radix-tree').radixTree('getData');
$('.radix-tree').radixTree('setData', newData);
```

**Note:** Use `node._radixId` (from event callbacks) or `checkedNode.id` (from `getChecked()`) for the `nodeId` parameter in commands.

---

## Data Structure

Each node in the tree can have the following properties:

```js
{
  label: 'Node Label',           // Display text (required)
  nodeId: 'db_id_123',          // Database-friendly identifier (optional)
  id: 'legacy_id',              // Legacy identifier (optional, deprecated)
  checked: false,               // Checkbox state
  open: false,                  // Expansion state
  disabled: false,              // Disable node and children
  lazy: false,                  // Enable lazy loading
  infinite: false,              // Enable infinite scroll
  children: [],                 // Child nodes
  badge: 'New',                 // Badge text/number
  tags: ['urgent', 'feature'],  // Array of tags
  className: 'custom-class'     // Custom CSS class
}
```

### Node Identifiers

The plugin supports multiple ways to identify nodes:

1. **`nodeId` (Recommended)**: Database-friendly identifier
   - Used for database integration and data collection
   - Takes priority over `id` property
   - Example: `nodeId: 'user_123'` or `nodeId: 456`

2. **`id` (Legacy)**: Legacy identifier
   - Maintained for backward compatibility
   - Used if `nodeId` is not provided

3. **Auto-generated**: Internal radix tree ID
   - Generated automatically if no `nodeId` or `id` is provided
   - Format: `radix-tree-{instance}-{random}-checkbox-{path}-{counter}`

**Example with nodeId:**
```js
const data = [
  {
    label: 'Users',
    nodeId: 'users_folder',
    open: true,
    children: [
      { label: 'John Doe', nodeId: 'user_123', checked: true },
      { label: 'Jane Smith', nodeId: 'user_456', checked: false }
    ]
  }
];
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

You can hook into tree events for custom logic. All events now include sibling information and complete node properties:

```js
$('.radix-tree').radixTree({
  data,
  onExpand: (node, detailsElem, siblings) => {
    console.log('Expanded:', node.label);
    console.log('Siblings:', siblings.map(s => s.label));
    console.log('Complete node:', {
      id: node.id,
      _radixId: node._radixId,
      label: node.label,
      checked: node.checked,
      open: node.open,
      indeterminate: node.indeterminate,
      disabled: node.disabled,
      lazy: node.lazy,
      children: node.children,
      _radixParentId: node._radixParentId,
      badge: node.badge,
      tags: node.tags,
    });
  },
  onCollapse: (node, detailsElem, siblings) => {
    console.log('Collapsed:', node.label);
    console.log('Siblings:', siblings.map(s => s.label));
  },
  onClick: (node, elem) => {
    alert('Clicked: ' + node.label);
  },
  onCheck: (node, checkboxElem, siblings) => {
    console.log('Checked:', node.label, checkboxElem.checked);
    console.log('Siblings:', siblings.map(s => s.label));
    console.log('Complete node:', {
      id: node.id,
      _radixId: node._radixId,
      label: node.label,
      checked: node.checked,
      open: node.open,
      indeterminate: node.indeterminate,
      disabled: node.disabled,
      lazy: node.lazy,
      children: node.children,
      _radixParentId: node._radixParentId,
      badge: node.badge,
      tags: node.tags,
    });
  }
});
```

**Event Parameters:**
- **`node`** - The node object with all properties (including internal radix properties)
- **`detailsElem`** - The HTML details element (for expand/collapse events)
- **`checkboxElem`** - The HTML checkbox element (for check events)
- **`elem`** - The clicked element (for click events)
- **`siblings`** - Array of sibling nodes (nodes that share the same parent)

**Available Node Properties:**
- `id` - Custom node ID
- `_radixId` - Internal radix tree ID (use for API commands)
- `label` - Display text
- `checked` - Checkbox state
- `open` - Expansion state
- `indeterminate` - Indeterminate state
- `disabled` - Disabled state
- `lazy` - Lazy loading flag
- `children` - Child nodes array
- `_radixParentId` - Parent node's internal ID
- `badge` - Badge text/number
- `tags` - Array of tags
- Plus any custom properties you add to your nodes

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

<!-- ## Who's Using Radix Tree?

Here are some awesome projects and companies using Radix Tree:

| Logo | Name/Link | Description |
|------|-----------|-------------|
| ![Example Logo](https://placehold.co/40x40) | [Awesome Dashboard](https://example.com) | Enterprise data explorer for finance teams |
| ![Example Logo](https://placehold.co/40x40) | [OpenSource CRM](https://example.com) | Open-source customer management platform |
| ... | ... | ... |

> Are you using Radix Tree? [Open a PR](https://github.com/dxmari/jquery-radix-tree/pulls) or [let us know!](mailto:maaricse8@gmail.com)
> We'd love to feature your project here!

--- -->

**Enjoy your new interactive tree!**  
For questions or contributions, open an issue or PR on GitHub.

> "Integrating the Radix Tree jQuery Plugin into our platform was seamless and impactful. Its flexibility and performance allowed us to build complex, interactive data views with minimal effort. The plugin's robust feature set and excellent documentation made it easy for our team to customize and scale as our needs evolved. Highly recommended for any engineering team looking for a reliable tree component."
>
> — [CultureMonkey](https://www.culturemonkey.io/), Siva Samraj, Director Of Engineering

> "Radix Tree has been a game-changer for our UI development. The plugin's intuitive API and responsive design enabled us to deliver a polished, user-friendly experience to our clients. We especially appreciate the attention to detail in handling large datasets and multiple instances. Support from the maintainers has been prompt and helpful. It's now our go-to solution for tree structures."
>
> — [effy](https://www.effy.co.in/), Gopi, Engineering Manager

---

## Recent Improvements (v1.0.2)

### 🆔 NodeId Support for Database Integration

Based on user feedback, we've added a new `nodeId` property for database-friendly identifiers:

```js
{
  label: 'John Doe',        // Display text
  nodeId: 'user_123',       // Database-friendly ID
  checked: true
}
```

**Perfect for PHP/Backend Integration:**
```js
// Frontend - Get checked nodes with database IDs
const checked = $('#tree').radixTree('getChecked');
const nodeIds = checked.map(n => n.nodeId);
// Result: ['user_123', 'user_456', ...]

// PHP Backend
$checkedNodeIds = $_POST['checked_nodes'];
$query = "SELECT * FROM users WHERE id IN (" . implode(',', $checkedNodeIds) . ")";
```

**Priority System:**
1. `nodeId` - Database-friendly identifier (recommended)
2. `id` - Legacy identifier (backward compatibility)
3. Auto-generated - Internal radix tree ID

### 🧹 Simplified Default Data

Removed complex 5+ level default data. Now starts with a simple, clean structure:
```js
const defaultData = [
  {
    label: 'Root',
    open: true,
    checked: false
  }
];
```

### 🎯 Focus Mode Feature

Added configurable focus modes for better user experience:
- **Accordion Mode**: Only one node open at a time
- **Highlight Mode**: Visual focus with auto-scroll
- **Collapse Siblings**: Auto-collapse sibling nodes
- **Auto-Scroll Mode**: Smooth scrolling to opened nodes

See `example/focus-mode-demo.html` for interactive examples.
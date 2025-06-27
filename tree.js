// Minimal dynamic tree rendering with callbacks

(function (factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS/Node: export as a function
    module.exports = factory;
  } else {
    // Browser: attach to global jQuery
    // --- Inject styles if not already present ---
    if (!document.getElementById('radix-tree-styles')) {
      var style = document.createElement('style');
      style.id = 'radix-tree-styles';
      style.textContent = `
/* --- tree.css --- */
:root {
  --width: 12;
  --rounding: 4px;
  --accent: #696;
  --dark-grey: #ddd;
  --grey: #eee;
  --light-grey: #f8f8f8;
  --checkbox-size: 1.2em;
  --checkbox-border: 2px solid #bbb;
  --checkbox-radius: 6px;
  --checkbox-shadow: 0 1px 2px rgba(0,0,0,0.07);
  --checkbox-checked-bg: #4caf50;
  --checkbox-checked-border: 2px solid #388e3c;
  --checkbox-indeterminate-bg: #ffc107;
  --checkbox-indeterminate-border: 2px solid #ffa000;
}

.radix-tree{
  line-height: 1.5;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

.radix-tree .tree {
 --spacing: 1.5rem;
 --radius: 10px;
}

.radix-tree .tree li {
 display: block;
 position: relative;
 padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
}

.radix-tree .tree ul {
 margin-left: calc(var(--radius) - var(--spacing));
 padding-left: 0;
}

.radix-tree .tree ul li {
 border-left: 2px solid #ddd;
}

.radix-tree .tree ul li:last-child {
 border-color: transparent;
}

.radix-tree .tree ul li::before {
 content: '';
 display: block;
 position: absolute;
 top: calc(var(--spacing) / -2);
 left: -2px;
 width: calc(var(--spacing) + 2px);
 height: calc(var(--spacing) + 1px);
 border: solid #ddd;
 border-width: 0 0 2px 2px;
}

.radix-tree .tree summary {
 display: block;
 cursor: pointer;
}

.radix-tree .tree summary::marker,
.radix-tree .tree summary::-webkit-details-marker {
 display: none;
}

.radix-tree .tree summary:focus {
 outline: none;
}

.radix-tree .tree summary:focus-visible {
 outline: 1px dotted #000;
}

.radix-tree .tree li::after,
.radix-tree .tree summary::before {
 content: '';
 display: block;
 position: absolute;
 top: calc(var(--spacing) / 2 - var(--radius));
 left: calc(var(--spacing) - var(--radius) - 1px);
 width: calc(2 * var(--radius));
 height: calc(2 * var(--radius));
 border-radius: 50%;
 background: #ddd;
 margin-top: 0px;
}

.radix-tree .tree summary::before {
 z-index: 1;
 background: #696 url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCI+CiAgPGcgZmlsbD0iI2ZmZiI+CiAgICA8cGF0aCBkPSJtNSA5aDR2LTRoMnY0aDR2MmgtNHY0aC0ydi00aC00eiIvPgogICAgPHBhdGggZD0ibTI1IDloMTB2MmgtMTB6Ii8+CiAgPC9nPgo8L3N2Zz4=') 0 0;
}

.radix-tree .tree details[open] > summary::before {
 background-position: calc(-2 * var(--radius)) 0;
}

/* Hide native checkbox for SVG UI */
.radix-tree input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 1.2em;
  height: 1.2em;
  margin: 10px 0 0 5px !important;
  cursor: pointer;
  z-index: 2;
}

/* SVG Checkbox UI */
.radix-checkbox-svg {
  display: inline-block;
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
  margin-right: 0m;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.2s;
  border-radius: 4px;
  margin-top: -4px;
}
.radix-checkbox-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}
.radix-checkbox-svg .box {
  pointer-events: none;
}
.radix-checkbox-svg .checkmark {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  opacity: 0;
  transition: stroke-dashoffset 0.25s cubic-bezier(.4,2,.6,1), opacity 0.18s;
}
.radix-checkbox-svg.checked .checkmark {
  stroke-dashoffset: 0;
  stroke: #ffffff;
  opacity: 1;
}
.radix-checkbox-svg .indeterminate-bar {
  opacity: 0;
  transform: scaleX(0);
  transition: opacity 0.18s, transform 0.18s cubic-bezier(.4,2,.6,1);
}
.radix-checkbox-svg.indeterminate .indeterminate-bar {
  opacity: 1;
  transform: scaleX(1);
  fill: #ffffff !important;
}
.radix-checkbox-svg.checked .box rect {
  fill: #4caf50;
  stroke: #388e3c;
}
.radix-checkbox-svg.indeterminate .box rect {
  fill: #ffc107;
  stroke: #ffa000;
}
.radix-checkbox-svg.disabled .box rect {
  fill: #dcd2d2;
  stroke: #dcd2d2;
}
.radix-checkbox-svg.disabled {
  opacity: 0.95;
  cursor: not-allowed;
}
.radix-checkbox-svg.focus {
  box-shadow: 0 0 0 3px #b2dfdb, 2px 2px 6px #e0e0e0, -2px -2px 6px #ffffff;
}

/* Disabled State */
.radix-tree input[type="checkbox"]:disabled {
  background: #f0f0f0;
  border: 2px solid #e0e0e0;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.7;
}
.radix-tree input[type="checkbox"]:disabled + label {
  color: #bbb;
  cursor: not-allowed;
}

/* Increase clickable area for label */
.radix-tree label {
  cursor: pointer;
  user-select: none;
  padding: 0.1em 0.2em;
  border-radius: 4px;
  transition: background 0.15s;
}
.radix-tree label:focus, .radix-tree label:hover {
  background: var(--grey);
}

/* --- style.css --- */
/* (TRUNCATED: Insert the full contents of style.css here, up to 1058 lines) */
`;
      document.head.appendChild(style);
    }
    factory(window.jQuery);
  }
})(function ($) {
  // Simple default data - just one node
  const defaultData = [
    {
      label: 'Root',
      open: true,
      checked: false
    }
  ];

  // Global instance counter for unique tree instance IDs
  let radixTreeInstanceCounter = 0;

  // Helper: generate a random string for extra uniqueness
  function randomString(len = 6) {
    return Math.random().toString(36).substr(2, len);
  }

  // Helper: set checked state recursively for node and children
  function setCheckedRecursive(node, checked) {
    node.checked = checked;
    node.indeterminate = false;
    if (node.children && node.children.length) {
      node.children.forEach(child => setCheckedRecursive(child, checked));
    }
  }

  // Helper: update parent checked/indeterminate state based on children
  function updateParentChecked(node, parent) {
    if (!parent) return;
    const allChecked = parent.children.every(child => child.checked);
    const noneChecked = parent.children.every(child => !child.checked && !child.indeterminate);
    if (allChecked) {
      parent.checked = true;
      parent.indeterminate = false;
    } else if (noneChecked) {
      parent.checked = false;
      parent.indeterminate = false;
    } else {
      parent.checked = false;
      parent.indeterminate = true;
    }
  }

  // Helper: get sibling nodes of a given node
  function getSiblingNodes(node, idNodeMap) {
    if (!node._radixParentId) {
      // Root level nodes - find all nodes at the same level
      const rootNodes = [];
      Object.values(idNodeMap).forEach(n => {
        if (!n._radixParentId) {
          rootNodes.push(n);
        }
      });
      return rootNodes.filter(n => n._radixId !== node._radixId);
    }
    
    // Get parent node
    const parent = idNodeMap[node._radixParentId];
    if (!parent || !parent.children) {
      return [];
    }
    
    // Return all siblings except the current node
    return parent.children.filter(sibling => sibling._radixId !== node._radixId);
  }

  // Helper: generate unique id for each checkbox (now with idPrefix)
  function generateCheckboxId(path, idPrefix, checkboxIdCounter, node) {
    // Priority: nodeId (database-friendly) > id (legacy) > auto-generated
    if (node && typeof node.nodeId !== 'undefined' && node.nodeId !== null) {
      return idPrefix + '-checkbox-' + node.nodeId;
    }
    if (node && typeof node.id !== 'undefined' && node.id !== null) {
      return idPrefix + '-checkbox-' + node.id;
    }
    return idPrefix + '-checkbox-' + path.join('-') + '-' + (checkboxIdCounter++);
  }

  // Helper: build id->node map (now with idPrefix)
  function buildIdNodeMap(data, path = [], map = {}, parentId = null, idPrefix = '', checkboxIdCounter = { val: 0 }) {
    data.forEach((node, idx) => {
      let id;
      // Priority: nodeId (database-friendly) > id (legacy) > auto-generated
      if (typeof node.nodeId !== 'undefined' && node.nodeId !== null) {
        id = idPrefix + '-checkbox-' + node.nodeId;
      } else if (typeof node.id !== 'undefined' && node.id !== null) {
        id = idPrefix + '-checkbox-' + node.id;
      } else {
        id = idPrefix + '-checkbox-' + [...path, idx].join('-') + '-' + (checkboxIdCounter.val++);
      }
      node._radixId = id;
      node._radixParentId = parentId;
      map[id] = node;
      if (node.children && node.children.length) {
        buildIdNodeMap(node.children, [...path, idx], map, id, idPrefix, checkboxIdCounter);
      }
    });
    return map;
  }

  // Helper: collect open state for all nodes in the tree
  function collectOpenStates(data, path = [], openMap = {}) {
    data.forEach((node, idx) => {
      const nodePath = [...path, idx].join('-');
      openMap[nodePath] = node.open === true;
      if (node.children && node.children.length) {
        collectOpenStates(node.children, [...path, idx], openMap);
      }
    });
    return openMap;
  }

  // Helper: restore open state for all nodes in the tree
  function restoreOpenStates(data, openMap, path = []) {
    data.forEach((node, idx) => {
      const nodePath = [...path, idx].join('-');
      if (typeof openMap[nodePath] !== 'undefined') {
        node.open = openMap[nodePath];
      }
      if (node.children && node.children.length) {
        restoreOpenStates(node.children, openMap, [...path, idx]);
      }
    });
  }

  // Keyboard navigation helpers
  function getFocusableElements(container) {
    return $(container).find('[tabindex="0"]:visible').toArray();
  }

  // Infinite scroll: default page size is now dynamic via settings.pageSize

  // Helper: trigger lazy load for open nodes on initial render
  function triggerInitialLazyLoad(node, settings, callbacks, path, idNodeMap, $container) {
    if ((node.open === true) && (node.lazy || node.infinite) && !node._lazyLoaded && typeof settings.lazyLoad === 'function') {
      node._loading = true;
      settings.lazyLoad(node, function (children, hasMore) {
        node.children = children;
        node._lazyLoaded = true;
        node._loading = false;
        node.hasMore = hasMore !== false;
        node._page = 2;
        if ($container && $container.length) {
          $container.empty();
          const idPrefix = $container.data('radixTreeIdPrefix');
          const checkboxIdCounter = { val: 0 };
          const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          const $treeWrapper = $('<div class="radix-tree"></div>');
          $treeWrapper.append(renderTree(settings.data, callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
          $container.append($treeWrapper);
        }
      }, {
        page: 1,
        pageSize: node.pageSize || settings.pageSize
      }, settings.lazyLoadDelay);
    }
    if (node.children && node.children.length) {
      node.children.forEach((child, idx) => {
        triggerInitialLazyLoad(child, settings, callbacks, [...path, idx], idNodeMap, $container);
      });
    }
  }

  // Helper: get loading text from settings or use default
  function getLoadingText(settings) {
    return settings.loadingText || 'Loading more...';
  }

  // Helper: handle focus mode behavior
  function handleFocusMode(node, settings, idNodeMap, $container) {
    if (!settings.focusMode || !settings.focusMode.enabled) return;

    const focusMode = settings.focusMode;
    
    // Support multiple modes: can be string or array
    const modes = Array.isArray(focusMode.type) ? focusMode.type : [focusMode.type];
    
    // Check if we need to re-render (accordion or collapse-siblings)
    const needsReRender = modes.some(mode => mode === 'accordion' || mode === 'collapse-siblings');
    
    // Store the node that should be highlighted after any re-renders
    if (modes.includes('highlight')) {
      $container.data('radix-highlighted-node', node._radixId);
    }
    
    // Apply non-highlight modes first
    modes.forEach(mode => {
      if (mode !== 'highlight') {
        switch (mode) {
          case 'accordion':
            handleAccordionMode(node, settings, idNodeMap, $container);
            break;
          case 'collapse-siblings':
            handleCollapseSiblingsMode(node, settings, idNodeMap, $container);
            break;
          case 'scroll':
            handleScrollMode(node, settings, idNodeMap, $container);
            break;
        }
      }
    });
    
    // Apply highlight mode last (after any re-renders)
    if (modes.includes('highlight')) {
      if (needsReRender) {
        // If we had a re-render, the highlight will be restored by reRenderTree
        // No need to apply it here
      } else {
        // No re-render needed, apply highlight immediately
        handleHighlightMode(node, settings, idNodeMap, $container);
      }
    }
  }

  // Accordion mode: only one node open at a time per level
  function handleAccordionMode(node, settings, idNodeMap, $container) {
    const siblings = getSiblingNodes(node, idNodeMap);
    let hasChanges = false;
    
    siblings.forEach(sibling => {
      if (sibling.open && sibling !== node) {
        sibling.open = false;
        hasChanges = true;
      }
    });
    
    // Only re-render if we actually closed some nodes
    if (hasChanges) {
      reRenderTree($container, settings);
    }
  }

  // Highlight mode: highlight current node, de-emphasize others
  function handleHighlightMode(node, settings, idNodeMap, $container) {
    // Remove focus from all nodes
    $container.find('.radix-tree-focused').removeClass('radix-tree-focused');
    
    // Add focus to current node
    const nodeElement = $container.find(`[data-radix-id="${node._radixId}"]`);
    if (nodeElement.length) {
      nodeElement.addClass('radix-tree-focused');
      
      // Auto-scroll if enabled
      if (settings.focusMode.autoScroll) {
        nodeElement[0].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    }
  }

  // Collapse siblings mode: collapse sibling nodes when opening a new one
  function handleCollapseSiblingsMode(node, settings, idNodeMap, $container) {
    const siblings = getSiblingNodes(node, idNodeMap);
    let hasChanges = false;
    
    siblings.forEach(sibling => {
      if (sibling.open && sibling !== node) {
        sibling.open = false;
        hasChanges = true;
      }
    });
    
    // Only re-render if we actually closed some nodes
    if (hasChanges) {
      reRenderTree($container, settings);
    }
  }

  // Scroll mode: just scroll to the opened node
  function handleScrollMode(node, settings, idNodeMap, $container) {
    const nodeElement = $container.find(`[data-radix-id="${node._radixId}"]`);
    if (nodeElement.length && settings.focusMode.autoScroll) {
      nodeElement[0].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }

  // Helper: restore highlight after re-render
  function restoreHighlight($container, settings) {
    const highlightedNodeId = $container.data('radix-highlighted-node');
    if (highlightedNodeId && settings.focusMode && settings.focusMode.enabled) {
      const modes = Array.isArray(settings.focusMode.type) ? settings.focusMode.type : [settings.focusMode.type];
      if (modes.includes('highlight')) {
        // Wait a bit longer to ensure DOM is fully updated
        setTimeout(() => {
          const nodeElement = $container.find(`[data-radix-id="${highlightedNodeId}"]`);
          if (nodeElement.length) {
            $container.find('.radix-tree-focused').removeClass('radix-tree-focused');
            nodeElement.addClass('radix-tree-focused');
            
            // Auto-scroll if enabled
            if (settings.focusMode.autoScroll) {
              nodeElement[0].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
              });
            }
          } else {
            // If element not found, try again after a longer delay
            setTimeout(() => {
              const nodeElement = $container.find(`[data-radix-id="${highlightedNodeId}"]`);
              if (nodeElement.length) {
                $container.find('.radix-tree-focused').removeClass('radix-tree-focused');
                nodeElement.addClass('radix-tree-focused');
                
                // Auto-scroll if enabled
                if (settings.focusMode.autoScroll) {
                  nodeElement[0].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                  });
                }
              }
            }, 100);
          }
        }, 50);
      }
    }
  }

  // Helper: re-render tree with current settings
  function reRenderTree($container, settings) {
    const idPrefix = $container.data('radixTreeIdPrefix');
    const checkboxIdCounter = { val: 0 };
    const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
    $container.empty();
    const $treeWrapper = $('<div class="radix-tree"></div>');
    $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
    $container.append($treeWrapper);
    
    // Restore highlight after re-render
    restoreHighlight($container, settings);
  }

  // Render function with checkboxes, unique ids, keyboard navigation, lazy loading, badges/tags, and infinite scroll
  function renderTree(data, callbacks, parentNode = null, path = [], settings = {}, idNodeMap = {}, $container, parentDisabled = false, idPrefix = '', checkboxIdCounter = { val: 0 }) {
    const rowHeight = 32; // px, approximate height of a row (used for scroll container and last <li> padding)
    
    // Add loading spinner styles if not already added
    if (!document.getElementById('radix-tree-loading-styles')) {
      const style = document.createElement('style');
      style.id = 'radix-tree-loading-styles';
      style.textContent = `
        .radix-tree-loading {
          display: flex !important;
          align-items: center;
          justify-content: flex-start;
          padding: 12px;
          padding-top: 3px !important;
          color: #666;
          font-size: 14px;
        }
        .radix-tree-spinner {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-left: 5px !important;
          border: 2px solid #e0e0e0;
          border-radius: 50%;
          border-top-color: #4caf50;
          animation: radix-tree-spin 1s ease-in-out infinite;
          margin-right: 8px;
        }
        @keyframes radix-tree-spin {
          to { transform: rotate(360deg); }
        }
        .radix-tree-loading-text {
          font-size: 13px;
          color: #666;
        }
        .radix-tree-focused {
          background: rgba(76, 175, 80, 0.1) !important;
          transition: all 0.3s ease;
        }
        .radix-tree-focused details {
          background: rgba(76, 175, 80, 0.05);
        }
        .radix-tree-focus-transition {
          transition: all 0.3s ease;
        }
      `;
      document.head.appendChild(style);
    }
    
    const ul = document.createElement('ul');
    ul.className = 'tree';
    // Infinite scroll: only enable if pageSize >= paginateThreshold and children count >= pageSize
    if (parentNode && parentNode.infinite && settings.pageSize >= settings.paginateThreshold && (parentNode.children && parentNode.children.length >= settings.pageSize)) {
      // Dynamically calculate max-height based on pageSize
      if (settings.pageSize < 10) {
        ul.style.maxHeight = (settings.pageSize * rowHeight) + 'px';
      } else {
        ul.style.maxHeight = '300px';
      }
      ul.style.overflowY = 'auto';
      ul.setAttribute('data-infinite', 'true');
      // Attach scroll event for infinite loading
      setTimeout(() => {
        if (!ul._infiniteScrollAttached) {
          ul._infiniteScrollAttached = true;
          ul.addEventListener('scroll', function () {
            if (parentNode._loadingMore) return;
            if (ul.scrollTop + ul.clientHeight >= ul.scrollHeight - 40) {
              // Near bottom, load more
              if (parentNode.hasMore && typeof settings.lazyLoad === 'function') {
                parentNode._loadingMore = true;
                // Show loading indicator
                const loadingLi = document.createElement('li');
                loadingLi.className = 'radix-tree-loading';
                loadingLi.innerHTML = `
                  <div class="radix-tree-spinner"></div>
                  <span class="radix-tree-loading-text">${getLoadingText(settings)}</span>
                `;
                ul.appendChild(loadingLi);
                // Record scroll position before loading
                const prevScrollTop = ul.scrollTop;
                settings.lazyLoad(parentNode, function (children, hasMore) {
                  // Remove loading indicator
                  if (ul.contains(loadingLi)) ul.removeChild(loadingLi);
                  if (!parentNode.children) parentNode.children = [];
                  parentNode.children = parentNode.children.concat(children);
                  parentNode.hasMore = hasMore !== false;
                  parentNode._loadingMore = false;
                  // Re-render just this node's children
                  const $container = $(ul).closest('.radix-tree');
                  if ($container.length) {
                    // Find the parent details node to re-render only this subtree
                    const details = ul.parentNode;
                    if (details && details.tagName === 'DETAILS') {
                      // Save scroll position
                      const scrollPos = ul.scrollTop;
                      // Remove and re-render the children ul
                      details.removeChild(ul);
                      const newUl = renderTree(parentNode.children, callbacks, parentNode.infinite ? parentNode : parentNode, path, settings, idNodeMap, $container);
                      details.appendChild(newUl);
                      // Restore scroll position
                      newUl.scrollTop = scrollPos;
                    } else {
                      // Fallback: re-render whole tree
                      $container.empty();
                      const idPrefix = $container.data('radixTreeIdPrefix');
                      const checkboxIdCounter = { val: 0 };
                      const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
                      const $treeWrapper = $('<div class="radix-tree"></div>');
                      $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
                      $container.append($treeWrapper);
                    }
                  }
                }, {
                  page: parentNode._page || 1,
                  pageSize: parentNode.pageSize || settings.pageSize
                }, settings.lazyLoadDelay);
                parentNode._page = (parentNode._page || 1) + 1;
              }
            }
          });
        }
      }, 0);
    }
    data.forEach((node, idx) => {
      const li = document.createElement('li');
      // Add data attribute for focus mode
      li.setAttribute('data-radix-id', node._radixId);
      // Dynamic className for parent/child nodes
      if (node.className) {
        if ((node.children && node.children.length) || node.lazy) {
          li.classList.add(node.className); // Parent node
        } else {
          li.classList.add(node.className); // Child node
        }
      }
      // Propagate disabled state from parent
      const isDisabled = !!node.disabled || !!parentDisabled;
      // Checkbox with unique id
      const checkboxId = generateCheckboxId([...path, idx], idPrefix, checkboxIdCounter.val, node);
      if (typeof node.id === 'undefined' || node.id === null) {
        checkboxIdCounter.val++;
      }
      node._radixId = checkboxId;
      idNodeMap[node._radixId] = node;
      // Checkbox (visually hidden, accessible)
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = checkboxId;
      checkbox.checked = !!node.checked;
      checkbox.indeterminate = !!node.indeterminate;
      checkbox.tabIndex = 0;
      checkbox.style.position = 'absolute';
      checkbox.style.opacity = 0;
      checkbox.style.width = '1.2em';
      checkbox.style.height = '1.2em';
      checkbox.style.margin = 0;
      checkbox.style.zIndex = 2;
      // Set data-value with priority: nodeId > id
      if (typeof node.nodeId !== 'undefined' && node.nodeId !== null) {
        checkbox.setAttribute('data-value', node.nodeId);
      } else if (typeof node.id !== 'undefined' && node.id !== null) {
        checkbox.setAttribute('data-value', node.id);
      }
      if (isDisabled) {
        checkbox.disabled = true;
      }
      checkbox.addEventListener('change', function (e) {
        e.stopPropagation();
        setCheckedRecursive(node, checkbox.checked);
        if (parentNode) {
          updateParentChecked(node, parentNode);
          // Propagate indeterminate state up the tree
          let current = parentNode;
          let parent = idNodeMap[current._radixParentId];
          while (parent) {
            updateParentChecked(current, parent);
            current = parent;
            parent = idNodeMap[current._radixParentId];
          }
        }
        // Use the specific container that contains this checkbox
        let $container = $(checkbox).closest('.radix-tree-parent');
        if ($container.length) {
          // Save scroll position if infinite scroll is present
          let $scrollTree = $container.find('.tree[data-infinite="true"]');
          let scrollTop = $scrollTree.length ? $scrollTree.scrollTop() : null;

          const settings = $container.data('radixTreeSettings');
          const idPrefix = $container.data('radixTreeIdPrefix');
          const checkboxIdCounter = { val: 0 };
          $container.empty();
          const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          const $treeWrapper = $('<div class="radix-tree"></div>');
          $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
          $container.append($treeWrapper);

          // Restore scroll position if needed
          if (scrollTop !== null) {
            let $newScrollTree = $container.find('.tree[data-infinite="true"]');
            if ($newScrollTree.length) {
              $newScrollTree.scrollTop(scrollTop);
            }
          }
          
          // Restore highlight after checkbox change re-render
          restoreHighlight($container, settings);
        }
        // Get sibling nodes for the onCheck callback
        const siblingNodes = getSiblingNodes(node, idNodeMap);
        callbacks.onCheck && callbacks.onCheck(node, checkbox, siblingNodes);
      });
      // Keyboard navigation for checkbox
      checkbox.addEventListener('keydown', function (e) {
        handleKeyboardNav(e, checkbox, li);
      });
      li.appendChild(checkbox);
      // Custom SVG Checkbox UI
      const svgSpan = document.createElement('span');
      svgSpan.className = 'radix-checkbox-svg';
      svgSpan.innerHTML = `
        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="box">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" stroke="#bbb" stroke-width="1.5"/>
          <path class="checkmark" d="M7 13l3 3 7-7" fill="none" stroke="#4caf50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect class="indeterminate-bar" x="6" y="11" width="12" height="2.5" rx="1.2" fill="#ffc107"/>
        </svg>
      `;
      // Sync SVG state with checkbox
      function updateSvgState() {
        if (checkbox.checked) {
          svgSpan.classList.add('checked');
        } else {
          svgSpan.classList.remove('checked');
        }
        if (checkbox.indeterminate) {
          svgSpan.classList.add('indeterminate');
        } else {
          svgSpan.classList.remove('indeterminate');
        }
        if (checkbox.disabled) {
          svgSpan.classList.add('disabled');
        } else {
          svgSpan.classList.remove('disabled');
        }
        if (document.activeElement === checkbox) {
          svgSpan.classList.add('focus');
        } else {
          svgSpan.classList.remove('focus');
        }
      }
      checkbox.addEventListener('change', updateSvgState);
      checkbox.addEventListener('focus', updateSvgState);
      checkbox.addEventListener('blur', updateSvgState);
      updateSvgState();
      // Clicking SVG toggles checkbox
      svgSpan.addEventListener('click', function(e) {
        if (!checkbox.disabled) {
          checkbox.focus();
          checkbox.click();
        }
      });
      li.appendChild(svgSpan);
      // Label for accessibility
      const label = document.createElement('label');
      label.setAttribute('for', checkboxId);
      label.textContent = node.label;
      label.style.marginLeft = '0.5em';
      label.tabIndex = 0;
      if (isDisabled) {
        label.classList.add('disabled');
        label.style.cursor = 'not-allowed';
      }
      label.addEventListener('keydown', function (e) {
        handleKeyboardNav(e, label, li);
      });
      if (!(node.children && node.children.length) && !node.lazy) {
        label.addEventListener('click', e => {
          e.stopPropagation();
          callbacks.onClick && callbacks.onClick(node, label);
        });
      }
      li.appendChild(label);
      // Badge support: node.badge (string or number)
      if (typeof node.badge !== 'undefined') {
        const badge = document.createElement('span');
        badge.className = 'radix-tree-badge';
        badge.textContent = node.badge;
        badge.setAttribute('aria-label', 'Badge: ' + node.badge);
        badge.style.marginLeft = '0.5em';
        badge.style.background = '#eee';
        badge.style.borderRadius = '10px';
        badge.style.padding = '0 0.5em';
        badge.style.fontSize = '0.85em';
        badge.style.color = '#333';
        badge.style.display = 'inline-block';
        badge.style.verticalAlign = 'middle';
        li.appendChild(badge);
      }
      // Tags support: node.tags (array of strings)
      if (Array.isArray(node.tags)) {
        node.tags.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'radix-tree-tag';
          tagSpan.textContent = tag;
          tagSpan.setAttribute('aria-label', 'Tag: ' + tag);
          tagSpan.style.marginLeft = '0.3em';
          tagSpan.style.background = '#cce5ff';
          tagSpan.style.borderRadius = '6px';
          tagSpan.style.padding = '0 0.4em';
          tagSpan.style.fontSize = '0.8em';
          tagSpan.style.color = '#0056b3';
          tagSpan.style.display = 'inline-block';
          tagSpan.style.verticalAlign = 'middle';
          li.appendChild(tagSpan);
        });
      }
      // Details/summary for children or lazy
      if ((node.children && node.children.length) || node.lazy) {
        const details = document.createElement('details');
        if (node.open === true) details.open = true;
        const summary = document.createElement('summary');
        summary.tabIndex = 0;
        summary.addEventListener('keydown', function (e) {
          handleKeyboardNav(e, summary, li);
        });
        summary.addEventListener('click', e => {
          e.stopPropagation();
          // Store the previous state before the click
          const wasOpen = node.open;
          
          setTimeout(() => {
            node.open = details.open;
            
            // Determine the action based on state change
            if (!wasOpen && details.open) {
              // Was closed, now open = EXPAND
              const siblings = getSiblingNodes(node, idNodeMap);
              callbacks.onExpand && callbacks.onExpand(node, details, siblings);
              
              // Handle focus mode with a small delay to ensure DOM is updated
              let $container = $(summary).closest('.radix-tree-parent');
              if ($container.length) {
                setTimeout(() => {
                  const idPrefix = $container.data('radixTreeIdPrefix');
                  const checkboxIdCounter = { val: 0 };
                  const currentIdNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
                  handleFocusMode(node, settings, currentIdNodeMap, $container);
                }, 10);
              }
            } else if (wasOpen && !details.open) {
              // Was open, now closed = COLLAPSE
              const siblings = getSiblingNodes(node, idNodeMap);
              callbacks.onCollapse && callbacks.onCollapse(node, details, siblings);
            }
            
            // Lazy loading
            if (details.open && node.lazy && !node._lazyLoaded && typeof settings.lazyLoad === 'function') {
              // Show loading indicator
              if (!node.children) node.children = [];
              node._loading = true;
              // Use the specific container that contains this summary
              let $container = $(summary).closest('.radix-tree-parent');
              if ($container.length) {
                const idPrefix = $container.data('radixTreeIdPrefix');
                const checkboxIdCounter = { val: 0 };
                const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
                $container.empty();
                const $treeWrapper = $('<div class="radix-tree"></div>');
                $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
                $container.append($treeWrapper);
                
                // Restore highlight after lazy loading re-render
                restoreHighlight($container, settings);
              }
              settings.lazyLoad(node, function (children, hasMore) {
                node.children = children;
                node._lazyLoaded = true;
                node._loading = false;
                node.hasMore = hasMore !== false;
                node._page = 2;
                if ($container.length) {
                  $container.empty();
                  const idPrefix = $container.data('radixTreeIdPrefix');
                  const checkboxIdCounter = { val: 0 };
                  const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
                  const $treeWrapper = $('<div class="radix-tree"></div>');
                  $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
                  $container.append($treeWrapper);
                  
                  // Restore highlight after lazy loading completion re-render
                  restoreHighlight($container, settings);
                }
              }, {
                page: 1,
                pageSize: node.pageSize || settings.pageSize
              }, settings.lazyLoadDelay);
            }
          }, 0);
          
          callbacks.onClick && callbacks.onClick(node, summary);
        });
        details.appendChild(summary);
        if (node._loading) {
          const loadingLi = document.createElement('li');
          loadingLi.className = 'radix-tree-loading';
          loadingLi.innerHTML = `
            <div class="radix-tree-spinner"></div>
            <span class="radix-tree-loading-text">${getLoadingText(settings)}</span>
          `;
          details.appendChild(document.createElement('ul')).appendChild(loadingLi);
        } else if (node.children && node.children.length) {
          // Infinite scroll: pass node as parentNode if infinite
          details.appendChild(renderTree(
            node.children,
            callbacks,
            node.infinite ? node : node,
            [...path, idx],
            settings,
            idNodeMap,
            $container,
            isDisabled, // propagate disabled state
            idPrefix,
            checkboxIdCounter
          ));
        }
        li.appendChild(details);
      }
      ul.appendChild(li);
    });
    // Add padding-bottom to the last <li> if this is a scrollable container
    if (parentNode && parentNode.infinite && settings.pageSize >= settings.paginateThreshold && (parentNode.children && parentNode.children.length >= settings.pageSize)) {
      if (ul.lastElementChild) {
        ul.lastElementChild.style.paddingBottom = rowHeight/3 + 'px';
      }
    }
    return ul;
  }

  // Keyboard navigation handler
  function handleKeyboardNav(e, currentElem, li) {
    let $container = $(li).closest('.radix-tree-parent');
    if (!$container.length) $container = $(li).parent();
    if (!$container.length) return;
    const focusables = getFocusableElements($container);
    const idx = focusables.indexOf(currentElem);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx < focusables.length - 1) focusables[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx > 0) focusables[idx - 1].focus();
    } else if (e.key === 'ArrowRight') {
      // Expand if summary or details
      const details = li.querySelector('details');
      if (details && !details.open) {
        e.preventDefault();
        details.open = true;
        // Trigger click to sync state
        const summary = details.querySelector('summary');
        if (summary) summary.click();
      }
    } else if (e.key === 'ArrowLeft') {
      // Collapse if details
      const details = li.querySelector('details');
      if (details && details.open) {
        e.preventDefault();
        details.open = false;
        // Trigger click to sync state
        const summary = details.querySelector('summary');
        if (summary) summary.click();
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (currentElem.tagName === 'INPUT' && currentElem.type === 'checkbox') {
        currentElem.checked = !currentElem.checked;
        currentElem.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (currentElem.tagName === 'SUMMARY') {
        currentElem.click();
      } else if (currentElem.tagName === 'LABEL') {
        currentElem.click();
      }
    }
  }

  // Main plugin
  $.fn.radixTree = function (optionsOrCommand) {
    // Command API
    if (typeof optionsOrCommand === 'string') {
      const command = optionsOrCommand;
      const args = Array.prototype.slice.call(arguments, 1);
      const $container = this.first();
      const settings = $container.data('radixTreeSettings');
      if (!settings) return;
      // Build id->node map
      const idPrefix = $container.data('radixTreeIdPrefix');
      const checkboxIdCounter = { val: 0 };
      const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
      switch (command) {
        case 'getChecked':
          // Return array of checked nodes (with id)
          const checked = [];
          // Rebuild idNodeMap with current settings to ensure IDs match
          const currentIdNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          
          function collectChecked(nodes) {
            nodes.forEach(node => {
              if (node.checked) checked.push({ id: node._radixId, label: node.label, node });
              if (node.children) collectChecked(node.children);
            });
          }
          collectChecked(settings.data);
          return checked;
        case 'getOpenChecked':
          // Return array of checked nodes that are currently open (parent nodes only)
          const openChecked = [];
          // Rebuild idNodeMap with current settings to ensure IDs match
          const currentIdNodeMap2 = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          
          function collectOpenChecked(nodes) {
            nodes.forEach(node => {
              // Only include checked nodes that are open (have children and are expanded)
              if (node.checked && node.open && node.children && node.children.length > 0) {
                openChecked.push({ id: node._radixId, label: node.label, node });
              }
              // Continue traversing children if node is open
              if (node.open && node.children) {
                collectOpenChecked(node.children);
              }
            });
          }
          collectOpenChecked(settings.data);
          return openChecked;
        case 'getClosedChecked':
          // Return array of checked nodes that are currently closed (parent nodes only)
          const closedChecked = [];
          // Rebuild idNodeMap with current settings to ensure IDs match
          const currentIdNodeMap3 = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          
          function collectClosedChecked(nodes, parentOpen = true) {
            nodes.forEach(node => {
              // Only include checked nodes that are closed (have children but are collapsed)
              // AND are visible in the UI (parent is open)
              if (node.checked && !node.open && node.children && node.children.length > 0 && parentOpen) {
                closedChecked.push({ id: node._radixId, label: node.label, node });
              }
              // Only traverse children if the current node is open (so children would be visible)
              if (node.open && node.children && node.children.length > 0) {
                collectClosedChecked(node.children, true);
              }
            });
          }
          collectClosedChecked(settings.data);
          return closedChecked;
        case 'setChecked': {
          const [id, checkedVal] = args;
          // Build idNodeMap first
          const idPrefix = $container.data('radixTreeIdPrefix');
          const checkboxIdCounter = { val: 0 };
          const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          
          const node = idNodeMap[id];
          if (node) {
            setCheckedRecursive(node, checkedVal);
            // update parents
            function updateParents(node, idNodeMap) {
              if (!node._radixParentId) return;
              const parent = idNodeMap[node._radixParentId];
              if (parent) {
                updateParentChecked(node, parent);
                updateParents(parent, idNodeMap);
              }
            }
            updateParents(node, idNodeMap);
            $container.empty();
            const $treeWrapper = $('<div class="radix-tree"></div>');
            $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
            $container.append($treeWrapper);
          }
          return;
        }
        case 'expand': {
          const [id] = args;
          const node = idNodeMap[id];
          if (node) {
            const wasOpen = node.open;
            node.open = true;
            
            // Trigger onExpand callback if node was not previously open
            if (!wasOpen && settings.callbacks.onExpand) {
              const siblings = getSiblingNodes(node, idNodeMap);
              settings.callbacks.onExpand(node, { open: true }, siblings);
            }
            
            // Handle focus mode if enabled
            if (settings.focusMode && settings.focusMode.enabled) {
              handleFocusMode(node, settings, idNodeMap, $container);
            }
            
            $container.empty();
            const newIdNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
            const $treeWrapper = $('<div class="radix-tree"></div>');
            $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, newIdNodeMap, $container, false, idPrefix, checkboxIdCounter));
            $container.append($treeWrapper);
            
            // Restore highlight after re-render
            restoreHighlight($container, settings);
          }
          return;
        }
        case 'collapse': {
          const [id] = args;
          const node = idNodeMap[id];
          if (node) {
            const wasOpen = node.open;
            node.open = false;
            
            // Trigger onCollapse callback if node was previously open
            if (wasOpen && settings.callbacks.onCollapse) {
              const siblings = getSiblingNodes(node, idNodeMap);
              settings.callbacks.onCollapse(node, { open: false }, siblings);
            }
            
            $container.empty();
            const newIdNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
            const $treeWrapper = $('<div class="radix-tree"></div>');
            $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, newIdNodeMap, $container, false, idPrefix, checkboxIdCounter));
            $container.append($treeWrapper);
          }
          return;
        }
        case 'getData':
          return settings.data;
        case 'setData': {
          const [newData] = args;
          settings.data = newData;
          $container.empty();
          const newIdNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          const $treeWrapper = $('<div class="radix-tree"></div>');
          $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, newIdNodeMap, $container, false, idPrefix, checkboxIdCounter));
          $container.append($treeWrapper);
          return;
        }
        case 'getSiblings': {
          const [nodeId] = args;
          // Rebuild idNodeMap with current settings to ensure IDs match
          const currentIdNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
          const node = currentIdNodeMap[nodeId];
          if (node) {
            return getSiblingNodes(node, currentIdNodeMap);
          }
          return [];
        }
        case 'getVisibleNodes': {
          // Return array of all nodes that are visible in the UI
          const visibleNodes = [];
          
          function collectVisibleNodes(nodes, parentOpen = true) {
            nodes.forEach(node => {
              // Include node if it's visible (parent is open)
              if (parentOpen) {
                visibleNodes.push({ id: node._radixId, label: node.label, node });
              }
              // Continue traversing children if the current node is open
              if (node.open && node.children && node.children.length > 0) {
                collectVisibleNodes(node.children, true);
              }
            });
          }
          collectVisibleNodes(settings.data);
          return visibleNodes;
        }
        case 'getVisibleCheckedNodes': {
          // Return array of all checked nodes that are visible in the UI
          const visibleCheckedNodes = [];
          
          function collectVisibleCheckedNodes(nodes, parentOpen = true) {
            nodes.forEach(node => {
              // Include checked node if it's visible (parent is open)
              if (parentOpen && node.checked) {
                visibleCheckedNodes.push({ id: node._radixId, label: node.label, node });
              }
              // Continue traversing children if the current node is open
              if (node.open && node.children && node.children.length > 0) {
                collectVisibleCheckedNodes(node.children, true);
              }
            });
          }
          collectVisibleCheckedNodes(settings.data);
          return visibleCheckedNodes;
        }
      }
      return;
    }

    // Initialization
    const settings = $.extend({
      data: defaultData,
      onExpand: null,
      onCollapse: null,
      onClick: null,
      onCheck: null,
      lazyLoadDelay: 1000, // ms, default delay for lazy loading
      pageSize: 20,        // default page size for infinite scroll/lazy load
      // Focus mode configuration
      focusMode: {
        enabled: false,
        type: 'highlight', // 'accordion', 'highlight', 'scroll', 'collapse-siblings'
        autoScroll: true,
        highlightColor: '#4caf50',
        animationDuration: 300,
        preserveRoot: true, // Keep root nodes open
        maxOpenLevels: 2    // Max number of open levels
      },
      // paginateThreshold is now optional
      // Sample lazyLoad function for demo
      lazyLoad: function(node, done) {
        // Simulate async loading based on label
        setTimeout(function() {
          let children = [];
          switch (node.label) {
            case 'Planets':
              children = [
                { label: 'Mercury', checked: false },
                { label: 'Venus', checked: false },
                { label: 'Earth', open: false, checked: false, lazy: true },
                { label: 'Mars', checked: false },
                { label: 'Jupiter', checked: false },
                { label: 'Saturn', checked: false },
                { label: 'Uranus', checked: false },
                { label: 'Neptune', checked: false }
              ];
              break;
            case 'Asteroid Belt':
              children = [
                { label: 'Ceres', checked: false },
                { label: 'Vesta', checked: false },
                { label: 'Pallas', checked: false },
                { label: 'Hygiea', checked: false }
              ];
              break;
            case 'Alpha Centauri System':
              children = [
                { label: 'Alpha Centauri A', checked: false },
                { label: 'Alpha Centauri B', checked: false },
                { label: 'Proxima Centauri', checked: false }
              ];
              break;
            case 'Andromeda':
              children = [
                { label: 'Star System 1', checked: false },
                { label: 'Star System 2', checked: false }
              ];
              break;
            case 'Supermassive':
              children = [
                { label: 'Sagittarius A*', checked: false },
                { label: 'M87*', checked: false }
              ];
              break;
            case 'Stellar-mass':
              children = [
                { label: 'Cygnus X-1', checked: false },
                { label: 'V404 Cygni', checked: false }
              ];
              break;
            case 'Nebulae':
              children = [
                { label: 'Orion Nebula', checked: false },
                { label: 'Crab Nebula', checked: false },
                { label: 'Eagle Nebula', checked: false }
              ];
              break;
            case 'Earth':
              children = [
                { label: 'Moon', checked: false },
                { label: 'ISS', checked: false }
              ];
              break;
            case 'Parallel Universe 1':
              children = [
                { label: 'Alt Galaxy', checked: false, lazy: true }
              ];
              break;
            case 'Parallel Universe 2':
              children = [
                { label: 'Alt Galaxy', checked: false, lazy: true }
              ];
              break;
            case 'Alt Galaxy':
              children = [
                { label: 'Alt Solar System', checked: false, lazy: true }
              ];
              break;
            case 'Alt Solar System':
              children = [
                { label: 'Alt Earth', checked: false, lazy: true }
              ];
              break;
            case 'Alt Earth':
              children = [
                { label: 'Alt Moon', checked: false },
                { label: 'Alt Mars', checked: false }
              ];
              break;
            default:
              children = [
                { label: 'Loading complete', checked: false }
              ];
          }
          done(children);
        }, settings.lazyLoadDelay);
      }
    }, optionsOrCommand);

    // Set paginateThreshold to Math.min(10, settings.pageSize) if not provided
    if (typeof settings.paginateThreshold === 'undefined') {
      settings.paginateThreshold = Math.min(10, settings.pageSize);
    }

    // Store callbacks for command API
    settings.callbacks = {
      onExpand: settings.onExpand,
      onCollapse: settings.onCollapse,
      onClick: settings.onClick,
      onCheck: settings.onCheck
    };

    return this.each(function () {
      const $container = $(this);
      $container.empty();
      $container.addClass('radix-tree-parent'); // Ensure parent class is always set
      if (settings.rootClassName) {
        $container.addClass(settings.rootClassName);
      }
      $container.data('radixTreeSettings', settings); // Store settings for rerender
      // Assign a unique idPrefix for this tree instance
      if (typeof $container.data('radixTreeIdPrefix') === 'undefined') {
        const instanceId = ++radixTreeInstanceCounter;
        const rand = randomString(6);
        $container.data('radixTreeIdPrefix', 'radix-tree-' + instanceId + '-' + rand);
      }
      const idPrefix = $container.data('radixTreeIdPrefix');
      const checkboxIdCounter = { val: 0 };
      const idNodeMap = buildIdNodeMap(settings.data, [], {}, null, idPrefix, checkboxIdCounter);
      // Trigger initial lazy load for open nodes
      settings.data.forEach((node, idx) => {
        triggerInitialLazyLoad(node, settings, settings.callbacks, [idx], idNodeMap, $container);
      });
      // Wrap the tree in a parent div.radix-tree
      const $treeWrapper = $('<div class="radix-tree"></div>');
      $treeWrapper.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container, false, idPrefix, checkboxIdCounter));
      $container.append($treeWrapper);
    });
  };
});

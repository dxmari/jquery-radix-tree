// Minimal dynamic tree rendering with callbacks

(function (factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS/Node: export as a function
    module.exports = factory;
  } else {
    // Browser: attach to global jQuery
    factory(window.jQuery);
  }
})(function ($) {
  // Complex default data with 5+ levels, multiple nodes, and lazy loading
  const defaultData = [
    {
      label: 'Universe',
      open: true,
      checked: false,
      children: [
        {
          label: 'Galaxies',
          open: true,
          checked: false,
          children: [
            {
              label: 'Milky Way',
              open: false,
              checked: false,
              children: [
                {
                  label: 'Solar System',
                  open: false,
                  checked: false,
                  children: [
                    {
                      label: 'Planets',
                      open: false,
                      checked: false,
                      lazy: true // Lazy load planets
                    },
                    {
                      label: 'Asteroid Belt',
                      open: false,
                      checked: false,
                      lazy: true // Lazy load asteroids
                    }
                  ]
                },
                {
                  label: 'Alpha Centauri System',
                  open: false,
                  checked: false,
                  lazy: true // Lazy load Alpha Centauri stars
                }
              ]
            },
            {
              label: 'Andromeda',
              open: false,
              checked: false,
              lazy: true // Lazy load Andromeda star systems
            }
          ]
        },
        {
          label: 'Black Holes',
          open: false,
          checked: false,
          children: [
            { label: 'Supermassive', open: false, checked: false, lazy: true },
            { label: 'Stellar-mass', open: false, checked: false, lazy: true }
          ]
        },
        {
          label: 'Nebulae',
          open: false,
          checked: false,
          lazy: true // Lazy load nebulae
        }
      ]
    },
    {
      label: 'Multiverse',
      open: false,
      checked: false,
      children: [
        { label: 'Parallel Universe 1', checked: false, lazy: true },
        { label: 'Parallel Universe 2', open: false, checked: false, lazy: true }
      ]
    }
  ];

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

  // Helper: generate unique id for each checkbox
  let checkboxIdCounter = 0;
  function generateCheckboxId(path) {
    return 'radix-tree-checkbox-' + path.join('-') + '-' + (checkboxIdCounter++);
  }

  // Helper: build id->node map
  function buildIdNodeMap(data, path = [], map = {}, parentId = null) {
    data.forEach((node, idx) => {
      const id = 'radix-tree-checkbox-' + [...path, idx].join('-');
      node._radixId = id;
      node._radixParentId = parentId;
      map[id] = node;
      if (node.children && node.children.length) {
        buildIdNodeMap(node.children, [...path, idx], map, id);
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

  // Infinite scroll: default page size
  const DEFAULT_PAGE_SIZE = 20;

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
          buildIdNodeMap(settings.data); // update ids
          $container.append(renderTree(settings.data, callbacks, null, [], settings, {}, $container));
        }
      }, {
        page: 1,
        pageSize: node.pageSize || DEFAULT_PAGE_SIZE
      });
    }
    if (node.children && node.children.length) {
      node.children.forEach((child, idx) => {
        triggerInitialLazyLoad(child, settings, callbacks, [...path, idx], idNodeMap, $container);
      });
    }
  }

  // Render function with checkboxes, unique ids, keyboard navigation, lazy loading, badges/tags, and infinite scroll
  function renderTree(data, callbacks, parentNode = null, path = [], settings = {}, idNodeMap = {}, $container, parentDisabled = false) {
    const ul = document.createElement('ul');
    ul.className = 'tree';
    // Infinite scroll: if parentNode has infinite: true, make ul scrollable
    if (parentNode && parentNode.infinite) {
      ul.style.maxHeight = '300px';
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
                loadingLi.textContent = 'Loading...';
                loadingLi.className = 'radix-tree-loading';
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
                      buildIdNodeMap(settings.data); // update ids
                      const newTree = renderTree(settings.data, callbacks, null, [], settings, {}, $container);
                      $container.append(newTree);
                    }
                  }
                }, {
                  page: parentNode._page || 1,
                  pageSize: parentNode.pageSize || DEFAULT_PAGE_SIZE
                });
                parentNode._page = (parentNode._page || 1) + 1;
              }
            }
          });
        }
      }, 0);
    }
    data.forEach((node, idx) => {
      const li = document.createElement('li');
      // Propagate disabled state from parent
      const isDisabled = !!node.disabled || !!parentDisabled;
      // Checkbox with unique id
      const checkboxId = generateCheckboxId([...path, idx]);
      node._radixId = 'radix-tree-checkbox-' + [...path, idx].join('-');
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
        const $container = $(li).closest('.radix-tree');
        if ($container.length) {
          const settings = $container.data('radixTreeSettings');
          $container.empty();
          buildIdNodeMap(settings.data); // update ids
          $container.append(renderTree(settings.data, callbacks, null, [], settings, {}, $container));
        }
        callbacks.onCheck && callbacks.onCheck(node, checkbox);
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
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" stroke="#bbb" stroke-width="2"/>
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
          setTimeout(() => {
            node.open = details.open;
            // Lazy loading
            if (details.open && node.lazy && !node._lazyLoaded && typeof settings.lazyLoad === 'function') {
              // Show loading indicator
              if (!node.children) node.children = [];
              node._loading = true;
              const $container = $(li).closest('.radix-tree');
              if ($container.length) {
                $container.empty();
                buildIdNodeMap(settings.data); // update ids
                $container.append(renderTree(settings.data, callbacks, null, [], settings, {}, $container));
              }
              settings.lazyLoad(node, function (children, hasMore) {
                node.children = children;
                node._lazyLoaded = true;
                node._loading = false;
                node.hasMore = hasMore !== false;
                node._page = 2;
                if ($container.length) {
                  $container.empty();
                  buildIdNodeMap(settings.data); // update ids
                  $container.append(renderTree(settings.data, callbacks, null, [], settings, {}, $container));
                }
              }, {
                page: 1,
                pageSize: node.pageSize || DEFAULT_PAGE_SIZE
              });
            }
          }, 0);
          if (details.open) {
            callbacks.onExpand && callbacks.onExpand(node, details);
          } else {
            callbacks.onCollapse && callbacks.onCollapse(node, details);
          }
          callbacks.onClick && callbacks.onClick(node, summary);
        });
        details.appendChild(summary);
        if (node._loading) {
          const loadingLi = document.createElement('li');
          loadingLi.textContent = 'Loading...';
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
            isDisabled // propagate disabled state
          ));
        }
        li.appendChild(details);
      }
      ul.appendChild(li);
    });
    return ul;
  }

  // Keyboard navigation handler
  function handleKeyboardNav(e, currentElem, li) {
    const $container = $(li).closest('.radix-tree');
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
      const idNodeMap = buildIdNodeMap(settings.data);
      switch (command) {
        case 'getChecked':
          // Return array of checked nodes (with id)
          const checked = [];
          function collectChecked(nodes) {
            nodes.forEach(node => {
              if (node.checked) checked.push({ id: node._radixId, label: node.label, node });
              if (node.children) collectChecked(node.children);
            });
          }
          collectChecked(settings.data);
          return checked;
        case 'setChecked': {
          const [id, checkedVal] = args;
          const node = idNodeMap[id];
          if (node) {
            setCheckedRecursive(node, checkedVal);
            // update parents
            function updateParents(node) {
              if (!node._radixParentId) return;
              const parent = idNodeMap[node._radixParentId];
              if (parent) {
                updateParentChecked(node, parent);
                updateParents(parent);
              }
            }
            updateParents(node);
            $container.empty();
            buildIdNodeMap(settings.data); // update ids
            $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}, $container));
          }
          return;
        }
        case 'expand': {
          const [id] = args;
          const node = idNodeMap[id];
          if (node) {
            node.open = true;
            $container.empty();
            buildIdNodeMap(settings.data); // update ids
            $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}, $container));
          }
          return;
        }
        case 'collapse': {
          const [id] = args;
          const node = idNodeMap[id];
          if (node) {
            node.open = false;
            $container.empty();
            buildIdNodeMap(settings.data); // update ids
            $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}, $container));
          }
          return;
        }
        case 'getData':
          return settings.data;
        case 'setData': {
          const [newData] = args;
          settings.data = newData;
          $container.empty();
          buildIdNodeMap(settings.data); // update ids
          $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}, $container));
          return;
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
        }, 1000);
      }
    }, optionsOrCommand);

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
      $container.data('radixTreeSettings', settings); // Store settings for rerender
      checkboxIdCounter = 0; // Reset counter for each render
      const idNodeMap = buildIdNodeMap(settings.data); // Ensure _radixId is set
      // Trigger initial lazy load for open nodes
      settings.data.forEach((node, idx) => {
        triggerInitialLazyLoad(node, settings, settings.callbacks, [idx], idNodeMap, $container);
      });
      $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap, $container));
    });
  };
});

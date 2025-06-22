// Minimal dynamic tree rendering with callbacks

(function ($) {
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

  // Render function with checkboxes, unique ids, keyboard navigation, and lazy loading
  function renderTree(data, callbacks, parentNode = null, path = [], settings = {}, idNodeMap = {}) {
    const ul = document.createElement('ul');
    ul.className = 'tree';
    data.forEach((node, idx) => {
      const li = document.createElement('li');
      // Checkbox with unique id
      const checkboxId = generateCheckboxId([...path, idx]);
      node._radixId = 'radix-tree-checkbox-' + [...path, idx].join('-');
      idNodeMap[node._radixId] = node;
      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = checkboxId;
      checkbox.checked = !!node.checked;
      checkbox.indeterminate = !!node.indeterminate;
      checkbox.tabIndex = 0;
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
          $container.append(renderTree(settings.data, callbacks, null, [], settings, {}));
        }
        callbacks.onCheck && callbacks.onCheck(node, checkbox);
      });
      // Keyboard navigation for checkbox
      checkbox.addEventListener('keydown', function (e) {
        handleKeyboardNav(e, checkbox, li);
      });
      li.appendChild(checkbox);
      // Label for accessibility
      const label = document.createElement('label');
      label.setAttribute('for', checkboxId);
      label.textContent = node.label;
      label.style.marginLeft = '0.5em';
      label.tabIndex = 0;
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
                $container.append(renderTree(settings.data, callbacks, null, [], settings, {}));
              }
              settings.lazyLoad(node, function (children) {
                node.children = children;
                node._lazyLoaded = true;
                node._loading = false;
                if ($container.length) {
                  $container.empty();
                  buildIdNodeMap(settings.data); // update ids
                  $container.append(renderTree(settings.data, callbacks, null, [], settings, {}));
                }
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
          details.appendChild(renderTree(node.children, callbacks, node, [...path, idx], settings, idNodeMap));
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
            $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}));
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
            $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}));
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
            $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}));
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
          $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, {}));
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
      $container.append(renderTree(settings.data, settings.callbacks, null, [], settings, idNodeMap));
    });
  };
})(jQuery);

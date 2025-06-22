// Entry for Radix Tree landing page demo (Nice Select style)
// Handles demo rendering, code copy, and (if needed) tab logic

// --- Demo Data and Renderers ---
window.radixDemoData = {
  basic: [
    {
      label: 'Universe',
      open: true,
      children: [
        { label: 'Galaxies', children: [ { label: 'Milky Way' }, { label: 'Andromeda' } ] },
        { label: 'Black Holes' }
      ]
    }
  ],
  badges: [
    {
      label: 'Projects',
      badge: 2,
      tags: ['active'],
      children: [
        { label: 'Frontend', badge: 'New', tags: ['UI', 'urgent'], lazy: true },
        { label: 'Backend', badge: 5, tags: ['API'], lazy: true }
      ]
    }
  ],
  disabled: [
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
  ]
};

window.renderRadixDemo = function(selector, data, opts) {
  $(selector).empty().append('<div class="example"></div>');
  $('.example', selector).radixTree(Object.assign({ data }, opts || {}));
};

// --- Copy Code Logic ---
window.copyCode = function (id) {
  const code = document.querySelector('#' + id + ' pre code').innerText;
  navigator.clipboard.writeText(code);
  const btn = document.querySelector('#' + id + ' .copy-btn');
  btn.innerText = 'Copied!';
  setTimeout(() => { btn.innerText = 'Copy'; }, 1200);
};

// --- (Optional) Tab Logic ---
window.initRadixTabs = function() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
};

// --- On DOM Ready ---
$(function () {
  // Basic Example
  window.renderRadixDemo('#demo-basic', window.radixDemoData.basic);

  // Lazy Loading Example
  function myLazyLoad(node, done, delay) {
    setTimeout(() => {
      if (node.label === 'Galaxies') {
        done([{ label: 'Milky Way' }, { label: 'Andromeda' }]);
      } else {
        done([{ label: 'No data' }]);
      }
    }, delay);
  }
  $('#demo-lazy').empty().append('<div class="radix-tree"></div>');
  $('.radix-tree', '#demo-lazy').radixTree({
    data: [{ label: 'Galaxies', lazy: true }],
    lazyLoad: myLazyLoad,
    lazyLoadDelay: 1200
  });

  // Badges & Tags Example
  window.renderRadixDemo('#demo-badges', window.radixDemoData.badges);

  // Infinite Scroll Example
  const demoData = [
    {
      label: 'Big Folder',
      open: true,
      infinite: true,
      lazy: true,
      badge: 100,
      tags: ['infinite', 'files']
    }
  ];
  function infiniteLazyLoad(node, done, opts, delay) {
    const total = 100;
    const page = opts && opts.page ? opts.page : 1;
    const pageSize = opts && opts.pageSize ? opts.pageSize : 20;
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
      done(children, end < total);
    }, delay);
  }
  $('#demo-infinite').empty().append('<div class="radix-tree-small"></div>');
  $('.radix-tree-small', '#demo-infinite').radixTree({
    data: demoData,
    lazyLoad: infiniteLazyLoad,
    pageSize: 5,
    lazyLoadDelay: 800
  });

  // Disabled Nodes Example
  window.renderRadixDemo('#demo-disabled', window.radixDemoData.disabled);

  // Command API Example
  // For demo, show a tree and expose API via window for console testing
  window.renderRadixDemo('#demo-api', window.radixDemoData.basic);
});

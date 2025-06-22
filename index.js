const data = [
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

// Initial data with lazy nodes
const initialData = [
  {
    label: 'Projects',
    open: true,
    checked: false,
    children: [
      {
        label: 'Frontend',
        lazy: true // Will load children on demand
      },
      {
        label: 'Backend',
        lazy: true
      }
    ]
  }
];

const newData = [
  {
    label: 'Company',
    open: true,
    checked: false,
    children: [
      {
        label: 'HR',
        lazy: true
      },
      {
        label: 'Engineering',
        lazy: true
      }
    ]
  }
];

// Custom lazyLoad function
function myLazyLoad(node, done) {
  setTimeout(function () {
    if (node.label === 'Frontend') {
      done([
        { label: 'React', checked: false },
        { label: 'Vue', checked: false }
      ]);
    } else if (node.label === 'Backend') {
      done([
        { label: 'Node.js', checked: false, lazy: true },
        { label: 'Python', checked: false }
      ]);
    } else if (node.label === 'Node.js') {
      done([
        { label: 'Express', checked: false },
        { label: 'NestJS', checked: false }
      ]);
    } else {
      done([{ label: 'No data', checked: false }]);
    }
  }, 1000); // Simulate async delay
}

$(document).ready(() => {
  console.log('Init');

  const demoData = [
    {
      label: 'Big Folder',
      open: false,
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
  
  // Example 1: Large page size (pagination and scroll enabled)
  $('.radix-tree-large').radixTree({
    data: demoData,
    lazyLoad: infiniteLazyLoad,
    pageSize: 20,        // Pagination and scroll enabled (>= 10)
    lazyLoadDelay: 500   // Delay for each page load
  });
  
  // Example 2: Small page size (no pagination or scroll)
  $('.radix-tree-small').radixTree({
    data: demoData,
    lazyLoad: infiniteLazyLoad,
    pageSize: 5,         // No pagination or scroll (< 10)
    lazyLoadDelay: 800
  });

  // --- Basic Demo ---
  $('#demo-basic').empty().radixTree({
    data
  });

  // --- Lazy Loading Demo ---
  function myLazyLoad(node, done, delay) {
    setTimeout(() => {
      if (node.label === 'Galaxies') {
        done([{ label: 'Milky Way' }, { label: 'Andromeda' }]);
      } else {
        done([{ label: 'No data' }]);
      }
    }, 1200);
  }
  $('#demo-lazy').empty().radixTree({
    data: [{ label: 'Galaxies', lazy: true }],
    lazyLoad: myLazyLoad,
    lazyLoadDelay: 1200
  });

  // --- Badges & Tags Demo ---
  const dataWithBadgesAndTags = [
    {
      label: 'Projects',
      open: true,
      badge: 2,
      tags: ['active'],
      children: [
        { label: 'Frontend', badge: 'New', tags: ['UI', 'urgent'], lazy: true },
        { label: 'Backend', badge: 5, tags: ['API'], lazy: true }
      ]
    },
    { label: 'Inbox', badge: 12, tags: ['unread', 'priority'] },
    { label: 'Archive', tags: ['old'] }
  ];
  $('#demo-badges').empty().radixTree({
    data: dataWithBadgesAndTags
  });

  // --- Infinite Scroll Demo ---
  $('#demo-infinite').empty().radixTree({
    data: demoData,
    lazyLoad: infiniteLazyLoad,
    pageSize: 5,
    paginateThreshold: 5,
    lazyLoadDelay: 800
  });

  // --- Disabled Nodes Demo ---
  const disabledData = [
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
            { label: 'Child 2', children: [ { label: 'Grandchild 1' } ] }
          ]
        }
      ]
    }
  ];
  $('#demo-disabled').empty().radixTree({
    data: disabledData
  });

  // --- Command API Demo ---
  const apiData = [
    {
      label: 'Fruits',
      open: true,
      children: [
        { label: 'Apple', checked: true },
        { label: 'Banana' },
        { label: 'Citrus', children: [{ label: 'Orange' }, { label: 'Lemon', checked: true }] }
      ]
    }
  ];
  $('#demo-api').empty().radixTree({
    data: apiData
  });
});
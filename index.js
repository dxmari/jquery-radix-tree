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
  // $('.radix-tree').radixTree({
  //   data,
  //   onExpand: (node, el) => console.log('Expanded:', node.label),
  //   onCollapse: (node, el) => console.log('Collapsed:', node.label),
  //   onClick: (node, el) => console.log('Clicked:', node.label)
  // });

  // $('.radix-tree').radixTree({
  //   data: initialData,
  //   lazyLoad: myLazyLoad
  // });

  // // Update the data dynamically
  // $('.radix-tree').radixTree('setData', newData);

  // // If you want to change the lazyLoad function, re-initialize:
  // $('.radix-tree').radixTree({
  //   data: newData,
  //   lazyLoad: function (node, done) {
  //     setTimeout(function () {
  //       if (node.label === 'HR') {
  //         done([{ label: 'Recruitment', checked: false }]);
  //       } else if (node.label === 'Engineering') {
  //         done([{ label: 'DevOps', checked: false }]);
  //       } else {
  //         done([{ label: 'No data', checked: false }]);
  //       }
  //     }, 1000);
  //   }
  // });
  // const dataWithBadgesAndTags = [
  //   {
  //     label: 'Projects',
  //     open: true,
  //     badge: 2,
  //     tags: ['active'],
  //     children: [
  //       {
  //         label: 'Frontend',
  //         badge: 'New',
  //         tags: ['UI', 'urgent'],
  //         lazy: true
  //       },
  //       {
  //         label: 'Backend',
  //         badge: 5,
  //         tags: ['API'],
  //         lazy: true
  //       }
  //     ]
  //   },
  //   {
  //     label: 'Inbox',
  //     badge: 12,
  //     tags: ['unread', 'priority']
  //   },
  //   {
  //     label: 'Archive',
  //     tags: ['old']
  //   }
  // ];

  // // Custom lazyLoad function for demo
  // function myLazyLoad(node, done) {
  //   setTimeout(function () {
  //     if (node.label === 'Frontend') {
  //       done([
  //         { label: 'React', badge: 1, tags: ['library'] },
  //         { label: 'Vue', tags: ['framework'] }
  //       ]);
  //     } else if (node.label === 'Backend') {
  //       done([
  //         { label: 'Node.js', badge: '!', tags: ['runtime'], lazy: true },
  //         { label: 'Python', tags: ['language'] }
  //       ]);
  //     } else if (node.label === 'Node.js') {
  //       done([
  //         { label: 'Express', tags: ['framework'] },
  //         { label: 'NestJS', tags: ['framework'] }
  //       ]);
  //     } else {
  //       done([{ label: 'No data', checked: false }]);
  //     }
  //   }, 1000);
  // }

  // $('.radix-tree').radixTree({
  //   data: dataWithBadgesAndTags,
  //   lazyLoad: myLazyLoad
  // });


  // Demo data: a root with a big folder (infinite scroll), and a normal folder
  const demoData = [
    {
      label: 'Big Folder',
      open: true,
      infinite: true, // enables infinite scroll for this node
      lazy: true,     // triggers lazyLoad for paging
      badge: 100,
      tags: ['infinite', 'files']
    },
    {
      label: 'Normal Folder',
      open: false,
      disabled: true,
      children: [
        { label: 'Document 1', badge: 'PDF', tags: ['important'] },
        { label: 'Document 2', badge: 'DOCX' }
      ]
    }
  ];

  // Infinite scroll lazyLoad function
  function infiniteLazyLoad(node, done, opts) {
    // Simulate a large folder with 100 files
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
    // Simulate async delay
    setTimeout(() => {
      done(children, end < total); // hasMore = true if more pages
    }, 500);
  }

  // Initialize the tree
  $('.radix-tree').radixTree({
    data: demoData,
    lazyLoad: infiniteLazyLoad
  });

  // const data = [
  //   {
  //     label: 'Root',
  //     open: true,
  //     children: [
  //       {
  //         label: 'Enabled Node'
  //       },
  //       {
  //         label: 'Disabled Subtree',
  //         disabled: true, // disables this node and all its children
  //         children: [
  //           { label: 'Child 1' },
  //           { label: 'Child 2', children: [
  //             { label: 'Grandchild 1' }
  //           ]}
  //         ]
  //       }
  //     ]
  //   }
  // ];
  
  // $('.radix-tree').radixTree({
  //   data: data
  // });
})
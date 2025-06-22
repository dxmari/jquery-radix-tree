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
  $('.radix-tree').radixTree({
    data,
    onExpand: (node, el) => console.log('Expanded:', node.label),
    onCollapse: (node, el) => console.log('Collapsed:', node.label),
    onClick: (node, el) => console.log('Clicked:', node.label)
  });

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
})
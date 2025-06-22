data = [
  {
    label: 'Universe',
    open: true,
    children: [
      {
        label: 'Galaxies',
        open: true,
        children: [
          {
            label: 'Milky Way',
            open: false,
            children: [
              {
                label: 'Solar System',
                open: false,
                children: [
                  {
                    label: 'Planets',
                    open: false,
                    children: [
                      { label: 'Mercury' },
                      { label: 'Venus' },
                      {
                        label: 'Earth', open: true, children: [
                          { label: 'Moon', open: false },
                          { label: 'ISS', open: false }
                        ]
                      },
                      {
                        label: 'Mars', open: false, children: [
                          { label: 'Phobos' },
                          { label: 'Deimos' }
                        ]
                      },
                      {
                        label: 'Jupiter', open: false, children: [
                          { label: 'Io' },
                          { label: 'Europa' },
                          { label: 'Ganymede' },
                          { label: 'Callisto' }
                        ]
                      },
                      { label: 'Saturn' },
                      { label: 'Uranus' },
                      { label: 'Neptune' }
                    ]
                  },
                  {
                    label: 'Asteroid Belt',
                    open: false,
                    children: [
                      { label: 'Ceres' },
                      { label: 'Vesta' },
                      { label: 'Pallas' },
                      { label: 'Hygiea' }
                    ]
                  }
                ]
              },
              {
                label: 'Alpha Centauri System',
                open: false,
                children: [
                  { label: 'Alpha Centauri A' },
                  { label: 'Alpha Centauri B' },
                  { label: 'Proxima Centauri' }
                ]
              }
            ]
          },
          {
            label: 'Andromeda',
            open: false,
            children: [
              { label: 'Star System 1' },
              { label: 'Star System 2' }
            ]
          }
        ]
      },
      {
        label: 'Black Holes',
        open: false,
        children: [
          {
            label: 'Supermassive', open: false, children: [
              { label: 'Sagittarius A*' },
              { label: 'M87*' }
            ]
          },
          {
            label: 'Stellar-mass', open: false, children: [
              { label: 'Cygnus X-1' },
              { label: 'V404 Cygni' }
            ]
          }
        ]
      },
      {
        label: 'Nebulae',
        open: false,
        children: [
          { label: 'Orion Nebula' },
          { label: 'Crab Nebula' },
          { label: 'Eagle Nebula' }
        ]
      }
    ]
  },
  {
    label: 'Multiverse',
    open: false,
    children: [
      { label: 'Parallel Universe 1' },
      {
        label: 'Parallel Universe 2', open: false, children: [
          {
            label: 'Alt Galaxy', open: false, children: [
              {
                label: 'Alt Solar System', open: false, children: [
                  {
                    label: 'Alt Earth', open: false, children: [
                      { label: 'Alt Moon' },
                      { label: 'Alt Mars' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
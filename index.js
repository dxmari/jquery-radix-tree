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
  ],
  siblings: [
    {
      label: 'Projects',
      badge: 3,
      tags: ['active'],
      children: [
        { label: 'Frontend', badge: 'New', tags: ['UI', 'urgent'], id: 'frontend' },
        { label: 'Backend', badge: 5, tags: ['API'], id: 'backend' },
        { label: 'Mobile', badge: 2, tags: ['React Native'], id: 'mobile' }
      ]
    }
  ],
  events: [
    {
      label: 'Organization',
      open: true,
      children: [
        { label: 'Engineering', badge: 15, tags: ['tech'], id: 'eng' },
        { label: 'Marketing', badge: 8, tags: ['creative'], id: 'marketing' },
        { label: 'Sales', badge: 12, tags: ['revenue'], id: 'sales' }
      ]
    }
  ]
};

window.renderRadixDemo = function(selector, data, opts) {
  $(selector).empty().append('<div class="example"></div>');
  $('.example', selector).radixTree(Object.assign({ data }, opts || {}));
};

// --- Copy Code Logic ---
window.copyCode = function (id, event) {
  const code = document.querySelector('#' + id + ' code').innerText;
  navigator.clipboard.writeText(code);
  const btn = event.currentTarget;
  // Save original SVG
  const originalSvg = btn.querySelector('svg');
  const originalSvgHtml = originalSvg ? originalSvg.outerHTML : '';
  // Tick SVG
  const tickSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" height="1em" class="nextra-copy-icon"><polyline points="20 6 10 18 4 12" style="stroke:#4caf50;stroke-width:3;fill:none;"/></svg>`;
  if (originalSvg) originalSvg.outerHTML = tickSvg;
  btn.classList.add('copied');
  setTimeout(() => {
    // Restore original SVG
    if (btn.querySelector('svg')) btn.querySelector('svg').outerHTML = originalSvgHtml;
    btn.classList.remove('copied');
  }, 1200);
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

// --- Real-time API Examples ---

// GitHub API Lazy Loader
window.githubLazyLoad = function(node, done, opts, delay) {
  const page = opts && opts.page ? opts.page : 1;
  const perPage = opts && opts.pageSize ? opts.pageSize : 10;
  
  // Simulate different GitHub API endpoints based on node type
  let endpoint = '';
  if (node.label === 'Repositories') {
    endpoint = `https://api.github.com/users/${node.username || 'octocat'}/repos?page=${page}&per_page=${perPage}`;
  } else if (node.label === 'Followers') {
    endpoint = `https://api.github.com/users/${node.username || 'octocat'}/followers?page=${page}&per_page=${perPage}`;
  } else if (node.label === 'Following') {
    endpoint = `https://api.github.com/users/${node.username || 'octocat'}/following?page=${page}&per_page=${perPage}`;
  } else if (node.repoName) {
    // For repository contents
    endpoint = `https://api.github.com/repos/${node.username || 'octocat'}/${node.repoName}/contents?page=${page}&per_page=${perPage}`;
  }
  
  if (endpoint) {
    fetch(endpoint)
      .then(response => {
        if (!response.ok) throw new Error('API limit exceeded or user not found');
        return response.json();
      })
      .then(data => {
        const children = data.map(item => {
          if (item.type === 'dir') {
            return {
              label: item.name,
              lazy: true,
              repoName: node.repoName || item.name,
              username: node.username || 'octocat',
              badge: '📁',
              tags: ['directory']
            };
          } else if (item.type === 'file') {
            return {
              label: item.name,
              badge: '📄',
              tags: [item.name.split('.').pop() || 'file'],
              id: item.sha
            };
          } else {
            return {
              label: item.login || item.name || item.full_name,
              badge: item.public_repos || item.followers || '👤',
              tags: item.type === 'User' ? ['user'] : ['repo'],
              id: item.id
            };
          }
        });
        done(children, data.length === perPage);
      })
      .catch(error => {
        console.warn('GitHub API Error:', error.message);
        // Fallback to mock data
        const mockData = [
          { label: 'Mock Repository 1', badge: '⭐', tags: ['repo'], id: 1 },
          { label: 'Mock Repository 2', badge: '🔧', tags: ['repo'], id: 2 }
        ];
        done(mockData, false);
      });
  } else {
    // Mock data for other nodes
    setTimeout(() => {
      const mockData = [
        { label: 'Sample File 1.txt', badge: '📄', tags: ['txt'], id: 1 },
        { label: 'Sample File 2.js', badge: '📄', tags: ['js'], id: 2 }
      ];
      done(mockData, false);
    }, delay);
  }
};

// JSONPlaceholder API Lazy Loader
window.jsonPlaceholderLazyLoad = function(node, done, opts, delay) {
  const page = opts && opts.page ? opts.page : 1;
  const pageSize = opts && opts.pageSize ? opts.pageSize : 10;
  const start = (page - 1) * pageSize;
  
  let endpoint = '';
  if (node.label === 'Users') {
    endpoint = 'https://jsonplaceholder.typicode.com/users';
  } else if (node.label === 'Posts') {
    endpoint = 'https://jsonplaceholder.typicode.com/posts';
  } else if (node.label === 'Comments') {
    endpoint = 'https://jsonplaceholder.typicode.com/comments';
  } else if (node.label === 'Albums') {
    endpoint = 'https://jsonplaceholder.typicode.com/albums';
  } else if (node.userId) {
    // For user-specific data
    endpoint = `https://jsonplaceholder.typicode.com/posts?userId=${node.userId}`;
  }
  
  if (endpoint) {
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        const paginatedData = data.slice(start, start + pageSize);
        const children = paginatedData.map(item => {
          if (item.title) {
            return {
              label: item.title.substring(0, 30) + (item.title.length > 30 ? '...' : ''),
              badge: item.id,
              tags: ['post'],
              id: item.id,
              userId: item.userId
            };
          } else if (item.name) {
            return {
              label: item.name,
              badge: item.id,
              tags: ['user'],
              id: item.id,
              email: item.email
            };
          } else {
            return {
              label: item.name || item.title || `Item ${item.id}`,
              badge: item.id,
              tags: ['item'],
              id: item.id
            };
          }
        });
        done(children, start + pageSize < data.length);
      })
      .catch(error => {
        console.warn('JSONPlaceholder API Error:', error.message);
        // Fallback to mock data
        const mockData = [
          { label: 'Mock Post 1', badge: 1, tags: ['post'], id: 1 },
          { label: 'Mock Post 2', badge: 2, tags: ['post'], id: 2 }
        ];
        done(mockData, false);
      });
  } else {
    setTimeout(() => {
      const mockData = [
        { label: 'Sample Item 1', badge: 1, tags: ['item'], id: 1 },
        { label: 'Sample Item 2', badge: 2, tags: ['item'], id: 2 }
      ];
      done(mockData, false);
    }, delay);
  }
};

// File System API Lazy Loader (Mock)
window.fileSystemLazyLoad = function(node, done, opts, delay) {
  const page = opts && opts.page ? opts.page : 1;
  const pageSize = opts && opts.pageSize ? opts.pageSize : 10;
  
  // Simulate file system structure
  const mockFileSystem = {
    'Documents': [
      { name: 'report.pdf', type: 'file', size: '2.3MB', id: 1 },
      { name: 'presentation.pptx', type: 'file', size: '5.1MB', id: 2 },
      { name: 'spreadsheet.xlsx', type: 'file', size: '1.8MB', id: 3 },
      { name: 'Projects', type: 'dir', id: 4 },
      { name: 'Archive', type: 'dir', id: 5 }
    ],
    'Pictures': [
      { name: 'vacation.jpg', type: 'file', size: '3.2MB', id: 6 },
      { name: 'family.png', type: 'file', size: '1.5MB', id: 7 },
      { name: 'Screenshots', type: 'dir', id: 8 }
    ],
    'Music': [
      { name: 'playlist.mp3', type: 'file', size: '8.7MB', id: 9 },
      { name: 'album.flac', type: 'file', size: '45.2MB', id: 10 }
    ]
  };
  
  setTimeout(() => {
    let data = [];
    if (node.label === 'Documents' || node.label === 'Pictures' || node.label === 'Music') {
      data = mockFileSystem[node.label] || [];
    } else if (node.label === 'Projects') {
      data = [
        { name: 'web-app', type: 'dir', id: 11 },
        { name: 'mobile-app', type: 'dir', id: 12 },
        { name: 'api-backend', type: 'dir', id: 13 }
      ];
    } else if (node.label === 'Archive') {
      data = [
        { name: 'old-docs.zip', type: 'file', size: '12.5MB', id: 14 },
        { name: 'backup.tar.gz', type: 'file', size: '89.3MB', id: 15 }
      ];
    } else if (node.label === 'Screenshots') {
      data = [
        { name: 'screenshot-2024-01.png', type: 'file', size: '2.1MB', id: 16 },
        { name: 'screenshot-2024-02.png', type: 'file', size: '1.9MB', id: 17 }
      ];
    } else {
      data = [
        { name: 'index.html', type: 'file', size: '15KB', id: 18 },
        { name: 'style.css', type: 'file', size: '8KB', id: 19 },
        { name: 'script.js', type: 'file', size: '25KB', id: 20 }
      ];
    }
    
    const start = (page - 1) * pageSize;
    const paginatedData = data.slice(start, start + pageSize);
    
    const children = paginatedData.map(item => ({
      label: item.name,
      badge: item.type === 'dir' ? '📁' : item.size || '📄',
      tags: item.type === 'dir' ? ['directory'] : [item.name.split('.').pop() || 'file'],
      id: item.id,
      lazy: item.type === 'dir'
    }));
    
    done(children, start + pageSize < data.length);
  }, delay);
};

// --- On DOM Ready ---
$(function () {
  // Basic Example
  window.renderRadixDemo('#demo-basic', window.radixDemoData.basic);

  // Lazy Loading Example
  function myLazyLoad(node, done, opts, delay) {
    setTimeout(() => {
      if (node.label === 'Galaxies') {
        done([{ label: 'Milky Way' }, { label: 'Andromeda' }]);
      } else {
        done([{ label: 'No data' }]);
      }
    }, delay);
  }
  $('#demo-lazy').empty().append('<div class="demo-radix-tree"></div>');
  $('.demo-radix-tree', '#demo-lazy').radixTree({
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

  // Sibling Detection Example
  $('#demo-siblings').empty().append('<div class="demo-radix-tree"></div>');
  $('.demo-radix-tree', '#demo-siblings').radixTree({
    data: window.radixDemoData.siblings,
    onCheck: function(node, checkbox, siblings) {
      console.log('Checked:', node.label, checkbox.checked);
      console.log('Siblings:', siblings.map(s => s.label));
      console.log('Complete sibling objects:', siblings);
    }
  });

  // Enhanced Events Example
  $('#demo-events').empty().append('<div class="demo-radix-tree"></div>');
  $('.demo-radix-tree', '#demo-events').radixTree({
    data: window.radixDemoData.events,
    onExpand: function(node, details, siblings) {
      console.log('Node expanded:', {
        node: node.label,
        id: node.id,
        _radixId: node._radixId,
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

  // Command API Example
  // For demo, show a tree and expose API via window for console testing
  window.renderRadixDemo('#demo-api', window.radixDemoData.basic);

  // Real-time API Examples
  // GitHub API Example
  $('#demo-github-api').empty().append('<div class="demo-radix-tree"></div>');
  $('.demo-radix-tree', '#demo-github-api').radixTree({
    data: [
      { 
        label: 'GitHub User: octocat', 
        open: true,
        children: [
          { label: 'Repositories', lazy: true, username: 'octocat' },
          { label: 'Followers', lazy: true, username: 'octocat' },
          { label: 'Following', lazy: true, username: 'octocat' }
        ]
      }
    ],
    lazyLoad: window.githubLazyLoad,
    lazyLoadDelay: 1000,
    pageSize: 10
  });

  // JSONPlaceholder API Example
  $('#demo-json-api').empty().append('<div class="demo-radix-tree"></div>');
  $('.demo-radix-tree', '#demo-json-api').radixTree({
    data: [
      {
        label: 'JSONPlaceholder API',
        open: true,
        children: [
          { label: 'Users', lazy: true },
          { label: 'Posts', lazy: true },
          { label: 'Comments', lazy: true },
          { label: 'Albums', lazy: true }
        ]
      }
    ],
    lazyLoad: window.jsonPlaceholderLazyLoad,
    lazyLoadDelay: 800,
    pageSize: 8
  });

  // File System API Example
  $('#demo-filesystem-api').empty().append('<div class="demo-radix-tree"></div>');
  $('.demo-radix-tree', '#demo-filesystem-api').radixTree({
    data: [
      {
        label: 'File System',
        open: true,
        children: [
          { label: 'Documents', lazy: true },
          { label: 'Pictures', lazy: true },
          { label: 'Music', lazy: true }
        ]
      }
    ],
    lazyLoad: window.fileSystemLazyLoad,
    lazyLoadDelay: 600,
    pageSize: 5
  });
});

import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import jquery from 'jquery';
import { createRequire } from 'module';

// Use dynamic import for your plugin
const treePluginPath = './tree.js';

describe('Radix Tree', () => {
  let window, document, $, jq;
  beforeEach(async () => {
    const dom = new JSDOM('<!DOCTYPE html><div class="radix-tree"></div>');
    window = dom.window;
    document = dom.window.document;
    jq = jquery(window);
    $ = jq;
    global.window = window;
    global.document = document;
    global.$ = jq;
    global.jQuery = jq;
    // Import the plugin factory and attach to this jQuery instance
    const require = createRequire(import.meta.url);
    const treePluginFactory = require('./tree.cjs');
    treePluginFactory($);
  });

  it('renders a node', () => {
    const data = [{ label: 'Test Node', children: [] }];
    $('.radix-tree').radixTree({ data });
    expect($('.radix-tree label').text()).to.include('Test Node');
  });

  it('expands and collapses nodes on summary click', () => {
    const data = [
      {
        label: 'Parent',
        children: [
          { label: 'Child 1' },
          { label: 'Child 2' }
        ]
      }
    ];
    $('.radix-tree').radixTree({ data });
    const summary = $('.radix-tree summary').get(0);
    let details = $('.radix-tree details').get(0);
    expect(details.open).to.be.true;
    summary.click();
    expect(details.open).to.be.false;
    summary.click();
    expect(details.open).to.be.true;
  });
}); 
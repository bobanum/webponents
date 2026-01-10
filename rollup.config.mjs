import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Get all component entry points
function getEntryPoints() {
  const srcPath = 'src';
  const entries = {};
  
  // Read all items in src/
  const items = readdirSync(srcPath);
  
  items.forEach(item => {
    const itemPath = join(srcPath, item);
    const stat = statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Check for index.js in folder
      const indexPath = join(itemPath, 'index.js');
      try {
        statSync(indexPath);
        entries[item] = indexPath;
      } catch (e) {
        // No index.js, skip
      }
    } else if (item.endsWith('.js') && item !== 'Webponent.js' && item !== 'PropsProxy.js') {
      // Individual component file (exclude base classes)
      const name = item.replace('.js', '');
      entries[name] = itemPath;
    }
  });
  
  return entries;
}

const entries = getEntryPoints();

export default [
  // Individual component bundles for direct browser use
  ...Object.entries(entries).map(([name, input]) => ({
    input,
    output: {
      file: `dist/components/${name}.js`,
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      postcss({
        inject: false,
        extract: false,
        extensions: ['.css']
      }),
      resolve(),
      commonjs()
    ]
  })),
  
  // Main bundle with all components
  {
    input: 'index.js',
    output: {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      postcss({
        inject: false,
        extract: false,
        extensions: ['.css']
      }),
      resolve(),
      commonjs()
    ]
  },
  // UMD build for CDN usage (bundles all dependencies)
  {
    input: 'index.js',
    output: {
      file: 'dist/bundle.umd.min.js',
      format: 'umd',
      name: 'Webponents',
      sourcemap: true
    },
    plugins: [
      postcss({
        inject: false,
        extract: false,
        extensions: ['.css']
      }),
      resolve(),
      commonjs(),
      terser()
    ]
  },
  // UMD build with all dependencies bundled (standalone)
  {
    input: 'index.js',
    output: {
      file: 'dist/bundle.standalone.min.js',
      format: 'umd',
      name: 'Webponents',
      sourcemap: true
    },
    plugins: [
      postcss({
        inject: false,
        extract: false,
        extensions: ['.css']
      }),
      resolve(),
      commonjs(),
      terser()
    ]
  }
];

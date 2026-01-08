import * as esbuild from 'esbuild';

const config = {
  entryPoints: ['src/**/*.js'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  loader: {
    '.css': 'text'
  },
  minify: true,
  splitting: true,
  sourcemap: true,
};

// For build
if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(config);
  console.log('Build complete!');
}

const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    extract: false,
  },
  configureWebpack: {
    output: {
      filename: 'constructor.js',
    },
    optimization: {
      splitChunks: false,
    },
    resolve: {
      alias: {
        vue: path.resolve('./node_modules/vue'),
      },
    },
  },
  outputDir: path.resolve(__dirname, '../../BaSys.Back/src/BaSys.Host/wwwroot/app/constructor'),
  devServer: {
    proxy: 'http://localhost:5231',
  },
});

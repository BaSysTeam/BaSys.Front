const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    extract: false,
  },
  configureWebpack: {
    output: {
      filename: 'admin.js',
    },
    optimization: {
      splitChunks: false,
    },
  },
  outputDir: path.resolve(__dirname, '../../BaSys.Back/src/BaSys.Host/wwwroot/app/admin'),
});

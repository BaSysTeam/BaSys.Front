const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    extract: false,
  },
  configureWebpack: {
    output: {
      filename: 'super_admin.js',
    },
    optimization: {
      splitChunks: false,
    },
  },
});

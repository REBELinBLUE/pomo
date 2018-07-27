// Shimming

module.exports = {
  baseUrl: '/',

  configureWebpack: {
    // Shim the ipcRenderer
  },

  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess: (config) => {
        return config;
      },
      chainWebpackMainProcess: (config) => {
        config.externals({
          // 'node-hid': 'commonjs node-hid',
          'node-luxafor': 'commonjs node-luxafor',
        });

        return config;
      },
    },
  },
};

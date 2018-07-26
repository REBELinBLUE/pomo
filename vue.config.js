module.exports = {
  baseUrl: '/',
  pluginOptions: {
    electronBuilder: {
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

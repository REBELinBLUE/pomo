module.exports = {
  baseUrl: '/',
  configureWebpack: {
    externals: {
      'node-hid': 'commonjs node-hid',
    },
  },
};

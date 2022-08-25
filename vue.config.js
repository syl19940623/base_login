const webpack = require('webpack');

module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '统一登录平台'
        return args
      })
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.23',
        ws: false,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '/'
        // }
      },
      '/uploadresources': {
        target: 'http://192.168.0.12:9000',
        ws: false,
        changeOrigin: true
      }
    }
  },
  productionSourceMap: true
}

const webpack = require('webpack');
const splitChunks = false;

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
  configureWebpack: config => {
    if (splitChunks) {
      return {
        optimization: {
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 20000,
            maxSize: 60000,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                name(module) {
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                  return `npm.${packageName.replace('@', '')}`
                },
              },
            },
          }
        }
      }
    }
  },
  productionSourceMap: false
}

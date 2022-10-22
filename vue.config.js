const webpack = require('webpack');
const splitChunks = true;

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
        pathRewrite: {
          '^/api': '/'
        }
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
            minSize: 1024 * 10,
            maxSize: 1024 * 50,
            maxInitialRequests: Infinity,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true,
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

module.exports = {
  devServer: {
    open: true, //自动打开页面
    proxy: {
      '/': {
        target: 'http://127.0.0.1/', //后台接口
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          '^/':'/'
        }
      }
    }
  },
  pages: { //多页面开发
    index: {
      entry: 'src/pages/index/main.js',
      template: 'src/pages/index/index.html',
      filename: 'index.html',
      title: 'Index Page',
    },
    //   subpage: 'src/subpage/main.js'
  },
  publicPath: './' //打包文件路径
}
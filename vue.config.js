// const { config } = require("vue/types/umd");

module.exports = {
  devServer: {
    open: true, //自动打开页面
    proxy: {
      '/': {
        target: 'http://127.0.0.1:8888/api/private/v1', //后台接口
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
  publicPath: './' ,//打包文件路径

  //发布模式
  // chainWebpack:config =>{
  //  config.when(process.env.NOdE_ENV === 'production',config=>{
  //    config.entry('app').clear().add('./src/pages/index/main-prod.js')
  //  })
  //  //开发模式
  //  config.when(process.env.NOdE_ENV === 'devuction',config=>{
  //   config.entry('app').clear().add('./src/pages/index/main-dev.js')
  // })
  // }
}
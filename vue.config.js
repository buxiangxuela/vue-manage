/* 通过 chainWebpack自定义打包入口 */
module.exports ={
    chainWebpack: config =>{
        //发布模式
        config.when(process.env.NODE_ENV === 'production',config =>{
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals',{
                vue:'Vue',
                /* 'vue-router':'router', */
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                store:'store',
               /*  'vue-quill-editor':'VueQuillEditor' */
            })

            config.plugin('html').tap(args =>{
                args[0].isProd = true
                return args
            })
        })
        //开发模式
        config.when(process.env.NODE_ENV === 'development',config =>{
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args =>{
                args[0].isProd = false
                return args
            })
        })
    }
}
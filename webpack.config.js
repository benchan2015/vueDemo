var webpack = require('webpack');


module.exports = {
    //插件项
    plugins: [
         new webpack.optimize.CommonsChunkPlugin({
             // 提取出的公共模块的名称，js会打包为common.js，css为common.css
             // common.js会按照module.exports中output的路径打包，
             // common.css会按照ExtractTextPlugin插件设置的路径打包
             //如果按照网上的例子直接写为common.js,
             //会导致提取出来的公共css被打包成css/js/common.js/css
             name: 'common',
             //chunks----从哪些文件中提取
             //目前这里不需要设置，因为所有js文件都需要被提取
             //chunks: getEntry('./public/src/js/Entry/*/**.js')

         })
     ],
    //页面入口文件配置
    entry: {
         demo: ['./src/js/demo.js']
        
    },
    //入口文件输出配置
    output: {
        path: 'build/js',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.js$/,
            loader: 'jsx-loader?harmony'
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: /\.(png|jpg|svg)$/,
            loader: 'url-loader?limit=8192'
        }, {
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.html$/,
            loader: "html"
        }, {
            test: /\.tpl$/,
            loader: "html"
        }]
    },
    //其它解决方案配置
    resolve: {
        root: './src/js', //绝对路径
        alias: {
            jquery: 'jquery.js'
 
        }
    }
};

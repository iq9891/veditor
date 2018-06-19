var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');

var webpackBaseConfig = require('./webpack.base.config.js');
var config = require('../config');
var pkg = require('../package.json');

var env = config.build.env;
var isPro = env.NODE_ENV === '"production"';
var isDev = env.NODE_ENV === '"development"';
var dist = ''; // 生成的文件夹目录是可以配的，根据环境的不同生成的文件夹不同
// 公共的 banner
var banner = require( './banner' )();

var entry = {
  main: ['./src/veditor/index.js']
};

var plugins = [
  new webpack.DefinePlugin({
    ENV: JSON.stringify(env),
  }),
];

//设置 生成的文件夹目录

if (isDev) {
  dist = config.dev.dist;
} else {
  dist = config.build.dist;
}
// 注入内容
plugins.push(new webpack.BannerPlugin( banner ));

if (isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin());

  var HtmlWebpackPlugin = require('html-webpack-plugin')
  plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: 'head',
    hash: true,
    cache: true,
  }));
  // 插入热重载
  Object.keys(entry).forEach(function (name) {
    entry[name] = ['./build/dev-client'].concat(entry[name]);
  });
}

// 如果是开发
if (isPro) {
  // 压缩
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(webpackBaseConfig, {
  entry,
  devServer: {
    contentBase: [
      dist
    ],
    inline: true
  },
  output: {
    path: path.resolve(__dirname, '../'+dist),
    publicPath: '/'+ dist +'/',
    filename: pkg.name + (isPro ? '.min' : '') +'.js',
    // library: pkg.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      'style': resolve('src/style'),
    }
  },
  plugins: plugins
});

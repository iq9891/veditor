# veditor

>移动端富文本编辑器。[官网](https://iq9891.github.io/veditor)

[![veditor](https://img.shields.io/npm/v/@iq9891/veditor.svg?style=flat-square)](https://www.npmjs.org/package/@iq9891/veditor)
[![NPM downloads](http://img.shields.io/npm/dm/@iq9891/veditor.svg?style=flat-square)](https://npmjs.org/package/@iq9891/veditor)
[![NPM downloads](https://img.shields.io/npm/dt/@iq9891/veditor.svg?style=flat-square)](https://npmjs.org/package/@iq9891/veditor)

![GitHub language count](https://img.shields.io/github/languages/count/@iq9891/veditor.svg?style=flat-square)

[![Sauce Labs Test Status (for master branch)](https://badges.herokuapp.com/browsers?android=6&iphone=8&googlechrome=7&firefox=7&microsoftedge=10&iexplore=9&safari=10.10&style=flat-square)](https://saucelabs.com/u/_wmhilton)

[立即体验](https://output.jsbin.com/yowanag)

## 功能

1. 加粗
2. 下划线
3. 倾斜
4. 上传图片(ajax&base64)
5. 可配置的标题编辑
6. 列表编辑
7. 可配置的字体颜色编辑

## 适用人群

1. 移动端开发工程师-可直接引用 [demo 页面](https://iq9891.github.io/veditor/demo.html)，直接开发使用
2. 大前端，直接 npm 安装一下即可使用
3. 混合开发的后端工程师，直接饮用 [cdn](https://unpkg.com/@iq9891/veditor) ， new 一下即可使用。

## 安装

```
npm install @iq9891/veditor
```

## 使用

```
var myEditor = new window.vEditor('#ve');
myEditor.create();
```

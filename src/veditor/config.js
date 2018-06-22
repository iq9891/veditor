// xEditor 配置文件
/* eslint-disable no-alert */
export default {
  menu: {
    list: [ // 配置所显示菜单的功能
      'bold', // 加粗
      'underline', // 下划线
      'italic', // 倾斜
      'image', // 插入图像
      'head', // 标题
      'insertUnorderedList', // 列表
      'forecolor', //文字颜色
    ],
    lang: {
      bold: '加粗',
      image: '插入图像',
      italic: '倾斜',
      underline: '下划线',
      head: '标题', // 标题
      insertUnorderedList: '列表', //列表
      forecolor: '文字颜色', //文字颜色
    },
    high: [], // 当菜单够多，需要隐藏的时候
    position: 'bottom', // 当菜在上面
  },
  color: '#ff4949',
  head: {
    size: 'h3', // 标题级别
  },
  image: {
    type: 'ajax', // 上传图片显示的类型, base64, ajax
    ajaxurl: 'https://www.easy-mock.com/mock/5a2e29ed89d2205cbfe7a459/emfe/upload', // ajax 类型的上传地址
    emptyLinkTip: 'vEditor: 请设置请求链接', // 空连接报错提示信息
    LinkErrorTip: 'vEditor: 请求链接错误', // 错误连接报错提示信息
    success(res) { // 上传成功的处理， 需要返回 url 才能真正的添加内容
      if (res.code === 10000) {
        return res.data.url;
      }
      return alert('上传错误');
    },
    error() {
      alert('上传错误');
    },
    unit: '%',
    multiple: true, // 允许多选
    accept: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp', // 选择的类型
  },
  debug: false, // debug 为 true ，抛出错误
  alert(info) { // 错误提示
    console.log(info);
    alert(info);
  },
  zindex: 10000, // 编辑器的层级
  name: {
    prefix: '',
    menu: '',
    wrap: '',
  },
};

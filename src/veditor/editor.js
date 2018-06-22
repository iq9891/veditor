// XDom 主类
import $ from './dom';
import browser from './tools/browser';
import config from './config';
import Menu from './menus';
import Text from './text';
import Selection from './selection';

let editorId = 1; // 编辑器变化 多个编辑器自动累加

/**
* xEditor 对象
* @example
* new VEditor();
*/
const VEditor = class {
  /**
   * 构造函数
   *
   * @param {Object} selector 编辑器的选择器
   * @param {Object} config 配置
   * @returns {Object} The constructed target object
   */
  constructor(selector) {
    // id，用以区分单个页面不同的编辑器对象
    this.uid = editorId++;
    this.$editor = $(selector);
    this.cfg = config;
    this.node = null; // 点击的节点，用于元素操作之用，比如加粗
    this.browser = browser(); // 浏览器 UA
    this.isMobile = this.browser.isMobile;
    // 获取之前的内容
    this.childrens = this.getChilds();
  }
  /**
   * 创建编辑器
   */
  create() {
    // 设置层级
    this.setIndex();
    // 内容
    this.text = new Text(this);
    // 初始化 菜单
    this.menu = new Menu(this);
    // 选区
    this.selection = new Selection(this);
    // 修复之前的内容
    if (this.childrens.length > 0) {
      this.setInsertHtml();
    } else {
      // 新建一行
      this.text.newline();
    }
    // 事件绑定
    this.bind();
  }
  /**
   * 设置层级
   *
   * @param {Number} index 层级数
   * @returns {}
   */
  setIndex(index) {
    this.$editor.css('zIndex', index || this.cfg.zindex);
  }
  /**
   * 配置编辑器
   *
   * @param {Object} cfg 配置
   * @returns {}
   */
  config(cfg) {
    Object.keys(cfg).forEach((conf) => {
      if (this.cfg[conf] && typeof cfg[conf] === 'object' && !Array.isArray(cfg[conf])) {
        // 继承子级
        Object.keys(cfg[conf]).forEach((confChild) => {
          if (typeof cfg[conf][confChild] === 'object' && !Array.isArray(cfg[conf][confChild])) {
            // 不为空
            if (JSON.stringify(cfg[conf][confChild]) !== '{}') {
              this.cfg[conf][confChild] = Object.assign({}, cfg[conf][confChild]);
            }
          } else if (Array.isArray(cfg[conf][confChild])) {
            // 不为空
            if (cfg[conf][confChild].length > 0) {
              this.cfg[conf][confChild] = cfg[conf][confChild].slice();
            }
          } else {
            this.cfg[conf][confChild] = cfg[conf][confChild];
          }
        });
      } else if (this.cfg[conf] && Array.isArray(cfg[conf])) {
        // 不为空
        if (cfg[conf].length > 0) {
          this.cfg[conf] = cfg[conf].slice();
        }
      } else {
        this.cfg[conf] = cfg[conf];
      }
    });
  }
  /**
  * 获取之前里面内容
  */
  getChilds() {
    const children = this.$editor.children();
    this.$editor.html('');
    return children;
  }
  /**
  * 追加里面内容
  * @param {Object} html 内容
  */
  setInsertHtml(html = '') {
    this.text.setInsertHtml(html);
  }
  /**
  * 设置里面内容
  * @param {Object} html 内容
  */
  setHtml(html = '') {
    this.text.setHtml(html);
  }
  /**
  * 设置里面内容
  * @return {Object} html 内容
  */
  getHtml() {
    return this.text.getHtml();
  }
  /**
  * 设置里面内容
  * @return {Object} 编辑器对象
  */
  el() {
    return this.$editor;
  }

  bind() {
    window.addEventListener('resize', () => {
      this.browser = browser(); // 浏览器 UA
      this.isMobile = this.browser.isMobile;
    }, true);
    document.oncontextmenu = () => false;
  }
};
/**
 * VEditor 模块.
 * @module VEditor
 */
export default VEditor;

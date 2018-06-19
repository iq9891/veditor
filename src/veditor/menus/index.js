// XDom 主类
import $ from '../dom';
import list from './config';
import svgFn from '../tools/svg';
/**
* XMenu 对象
* @example
* new XMenu();
*/
const XMenu = class {
  /**
   * 构造函数
   *
   * @param {Object} editor 编辑器的对象
   */
  constructor(editor) {
    this.editor = editor;
    this.$editor = editor.$editor;
    this.cfg = editor.cfg;
    this.menucfg = this.cfg.menucfg || {};
    const {
      often = [],
      high = [],
    } = this.menucfg;
    this.highText = high.text || '';
    this.oftenMenus = often || [];
    this.highMenus = high || [];
    this.moreStatus = this.highMenus.length;
    // 当前菜单的状态, 用于图片那里
    this.status = '';
    this.btns = [];
    // 初始化菜单
    this.createMenu();
    //根据配置渲染创建功能按钮
    this.renderBtns();
  }
  /**
   * 创建菜单外层
   *
   * @param {Object} editor 编辑器的对象
   */
  createMenu() {
    const { name } = this.cfg;
    const { prefix, menu } = name;
    const { uid } = this.editor;

    this.$menuTem = $(`<div id="ve-menu${uid}" class="ve-menu${menu ? ` ${prefix}${menu}` : ''}${this.moreStatus ? ' ve-menu-more' : ''}"></div>`);
    this.$editor.append(this.$menuTem);

    this.$menu = $(`#ve-menu${uid}`);
    // 如果有配置
    if (this.moreStatus) {
      this.$oftenTem = $(`<div id="ve-menu-often${uid}" class="ve-menu-often${menu ? ` ${prefix}${menu}-often` : ''}"></div>`);
      this.$menu.append(this.$oftenTem);
      this.$often = $(`#ve-menu-often${uid}`);

      this.$highTem = $(`<div id="ve-menu-high${uid}" class="ve-menu-high${menu ? ` ${prefix}${menu}-high` : ''}">
        <h2 class="ve-menu-title${menu ? ` ${prefix}-menu-title` : ''}">${this.highText}</h2>
      </div>`);
      this.$menu.append(this.$highTem);
      this.$high = $(`#ve-menu-high${uid}`);
    }
  }
  /**
   * 根据配置渲染创建功能按钮
   *
   * @param {Object} editor 编辑器的对象
   */
  renderBtns() {
    // 如果有配置
    if (this.moreStatus) {
      const highTems = [];
      const oftenTems = [];
      this.cfg.menus.forEach((menu) => {
        const menuBtn = new list[menu](this.editor);
        const $tem = menuBtn.$tem[0];
        // 如果在高级选项里
        if (this.highMenus.find(v => v === menu)) {
          highTems.push($tem);
        } else {
          oftenTems.push($tem);
        }
        this.btns.push(menuBtn);
      });
      // 添加更多按钮
      this.renderDownBtn(oftenTems);
      this.$often.append(oftenTems);
      this.$high.append(highTems);
      // 更多按钮绑定事件
      this.bindDownEvent();
    } else {
      const tems = [];
      this.cfg.menus.forEach((menu) => {
        const menuBtn = new list[menu](this.editor);
        const $tem = menuBtn.$tem[0];
        tems.push($tem);
        this.btns.push(menuBtn);
      });
      this.$menu.append(tems);
    }

    this.btns.forEach((btn) => {
      btn.bind();
    });
  }

  renderDownBtn(oftenTems) {
    const { editor } = this;
    const $more = $(`<a id="ve-menu-down${editor.uid}" href="javascript:void('更多');" title="更多" class="ve-menu-down"><?xml version="1.0" encoding="UTF-8"?></a>`);
    svgFn($more, 'down');
    oftenTems.push($more[0]);
  }

  bindDownEvent() {
    const { uid, isMobile } = this.editor;
    this.$down = $(`#ve-menu-down${uid}`);
    let isMore = false;
    this.$down.on(isMobile ? 'touchend' : 'click', () => {
      if (isMore) {
        this.downFn();
      } else {
        this.upFn();
      }
      isMore = !isMore;
    });
  }
  // 更多的时候向下函数
  downFn() {
    this.$high.addClass('ve-menu-high-active');
    this.$down.addClass('ve-menu-down-active');
  }
  // 更多的时候向上函数
  upFn() {
    this.$high.removeClass('ve-menu-high-active');
    this.$down.removeClass('ve-menu-down-active');
  }
  // 检测哪个是激活
  testActive() {
    this.btns.forEach((btn) => {
      if (btn.isActive) {
        btn.isActive();
      }
    });
  }
  // 删除
  remove() {
    $(`#ve-dialog${this.editor.uid}`).remove();
  }
};
/**
 * XMenu 模块.
 * @module XMenu
 */
export default XMenu;

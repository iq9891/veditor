// XDom 主类
import $ from '../dom';
import list from './list';
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
      often = {
        text: '',
      },
      high = {
        text: '',
        menus: [],
      },
    } = this.menucfg;
    this.oftenText = often.text || '';
    this.highText = high.text || '';
    this.highMenus = high.menus || [];
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

    this.$menuTem = $(`<div id="ve-menu${uid}" class="ve-menu${menu ? ` ${prefix}${menu}` : ''}"></div>`);
    this.$editor.append(this.$menuTem);

    this.$menu = $(`#ve-menu${uid}`);
    // 如果有配置
    if (this.oftenText && this.highText && this.highMenus.length) {
      this.$oftenTem = $(`<div id="ve-menu-often${uid}" class="ve-menu-often${menu ? ` ${prefix}${menu}-often` : ''}">
        <h2 class="ve-menu-title${menu ? ` ${prefix}-menu-title` : ''}">${this.oftenText}</h2>
      </div>`);
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
    if (this.oftenText && this.highText && this.highMenus.length) {
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
      this.$often.append(oftenTems);
      this.$high.append(highTems);
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
  // 检测哪个是激活
  testActive() {
    this.btns.forEach((btn) => {
      if (btn.isActive) {
        btn.isActive();
      }
    });
  }
  // 设置|取消禁用状态
  testDisable() {
    const $link = $('.ve-menu-link');
    const $select = $('.ve-select');
    if (this.editor.code) {
      $link.addClass('ve-menu-link-disable');
      $select.addClass('ve-select-disable');
      $('#ve-code1').removeClass('ve-menu-link-disable');
    } else {
      $link.removeClass('ve-menu-link-disable');
      $select.removeClass('ve-select-disable');
    }
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

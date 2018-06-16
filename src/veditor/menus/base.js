// XDom 主类
import $ from '../dom';
import svgFn from '../tools/svg';
/**
* XMenuBase 对象
* bold，inserthorizontalrule，italic，underline 继承
* @example
* new XMenuBase(editor);
*/
const XMenuBase = class {
  /**
   * 构造函数
   *
   * @param {Object} editor 编辑器的对象
   * @param {String} type 什么类型，如 bold
   */
  constructor(editor, type) {
    this.editor = editor;
    this.$editor = editor.$editor;
    this.cfg = editor.cfg;
    this.type = type;
    // 初始化
    this.create();
  }

  create() {
    const { cfg, type, editor } = this;
    const { lang } = cfg;
    this.$tem = $(`<a id="ve-${type}${editor.uid}" href="javascript:void('${lang[type]}');" title="${lang[type]}" class="ve-menu-link"><?xml version="1.0" encoding="UTF-8"?></a>`);
    svgFn(this.$tem, type);
  }

  bind() {
    const { type, editor } = this;
    $(`#ve-${type}${editor.uid}`).on(editor.isMobile ? 'touchend' : 'click', () => {
      const { text, selection } = editor;
      // 只有选中了才有效果
      // insertHorizontalRule
      // insertOrderedList insertUnorderedList
      // undo redo removeFormat
      if (!selection.isSelectionEmpty()) {
        // bold italic underline subscript superscript
        // 加粗操作
        text.handle(type);
        this.isActive();
      }
    });
  }
  // 是否是选中
  isActive() {
    const { type, editor } = this;
    const $item = $(`#ve-${type}${editor.uid}`);
    if (document.queryCommandState(type)) {
      $item.addClass('ve-menu-link-active');
    } else {
      $item.removeClass('ve-menu-link-active');
    }
  }
};
/**
 * XMenuBase 模块.
 * @module XMenuBase
 */
export default XMenuBase;

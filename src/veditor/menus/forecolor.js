import Base from './base';
import $ from '../dom';
import cfg from '../config';
/**
* XMenuForecolor 对象
* @example
* new XMenuForecolor(editor);
*/
class XMenuForecolor extends Base {
  /**
   * 构造函数
   *
   * @param {Object} editor 编辑器的对象
   */
  constructor(editor) {
    super(editor, 'forecolor');
  }

  bind() {
    const { type, editor } = this;
    let isForeColor = true;
    $(`#ve-${type}${editor.uid}`).on(editor.isMobile ? 'touchend' : 'click', () => {
      const { text, selection } = editor;
      if (!selection.isSelectionEmpty()) {
        text.handle(type, isForeColor ? cfg.color : '#333');
        isForeColor = !isForeColor;
        this.isActive();
      }
    });
  }
  // 是否是加粗
  isActive() {
    const { selection, uid } = this.editor;
    const $rang = selection.getSelectionContainerElem(selection.getRange());
    this.$link = $(`#ve-${this.type}${uid} g`);

    if (this.$link && $rang) {
      const color = $rang.css('color');
      this.$link.css('fill', /rgba/.test(color) ? '#666' : color);
    }
  }
}
/**
 * XMenuForecolor 模块.
 * @module XMenuForecolor
 */
export default XMenuForecolor;

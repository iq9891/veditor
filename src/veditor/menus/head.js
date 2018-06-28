import $ from '../dom';
import Base from './base';
import { searchElement } from '../tools/el';
/**
* XMenuHead 对象
* @example
* new XMenuHead(editor);
*/
class XMenuHead extends Base {
  /**
   * 构造函数
   *
   * @param {Object} editor 编辑器的对象
   */
  constructor(editor) {
    super(editor, 'head');
  }

  bind() {
    const { cfg, type, editor } = this;
    const {
      head,
    } = cfg;
    let isHead = false;

    $(`#ve-${type}${editor.uid}`).on(editor.isMobile ? 'touchend' : 'click', () => {
      const { text, selection } = editor;
      if (!selection.isSelectionEmpty()) {
        text.handle('formatBlock', isHead ? 'p' : head.size);
        isHead = !isHead;
        this.isActive();
      }
    });
  }
  // 是否是选中
  isActive() {
    const { cfg, type, editor } = this;
    const $item = $(`#ve-${type}${editor.uid}`);
    const { selection } = editor;
    const $ele = selection.getSelectionContainerElem(selection.getRange());

    if (searchElement($ele, cfg.head.size.toUpperCase()) || ($ele.length && /H/.test($ele[0].tagName))) {
      $item.addClass('ve-menu-link-active');
    } else {
      $item.removeClass('ve-menu-link-active');
    }
  }
}
/**
 * XMenuHead 模块.
 * @module XMenuHead
 */
export default XMenuHead;

import $ from '../dom';
import Base from './base';
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
    super(editor, 'head', true);
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
    const { type, editor } = this;
    const $item = $(`#ve-${type}${editor.uid}`);
    const $itemBold = $(`#ve-bold${editor.uid}`);
    const { selection } = editor;
    const $ele = selection.getSelectionContainerElem(selection.getRange());
    console.log($itemBold, '$itemBold');
    if ($ele.length && /H/.test($ele[0].tagName)) {
      $item.addClass('ve-menu-link-active');
      $itemBold.addClass('ve-menu-link-active');
    } else {
      $item.removeClass('ve-menu-link-active');
      $itemBold.removeClass('ve-menu-link-active');
    }
  }
}
/**
 * XMenuHead 模块.
 * @module XMenuHead
 */
export default XMenuHead;

// XDom 主类
import $ from '../dom';
import Base from './base';
/**
* XMenuImage 对象
* @example
* new XMenuImage(editor);
*/
class XMenuImage extends Base {
  /**
   * 构造函数
   *
   * @param {Object} editor 编辑器的对象
   */
  constructor(editor) {
    super(editor, 'image', true);
    this.now = 0;
    // 图片点击记录
    this.$selectedImg = null;
    // 是 base64 还是 ajax
    this.imageType = this.editor.cfg.image.type;
  }

  bind() {
    const { type, editor } = this;
    const { uid } = editor;
    this.$item = $(`#ve-${type}${uid}`);
    const $file = $(`<input type="file" class="ve-menu-file" id="ve-menu-file${uid}">`);
    this.$item.append($file);
    this.$file = $(`#ve-menu-file${uid}`);
    // 添加上传文件按钮
    this.$file.on('input', (ev) => {
      editor.text.$text.append(editor.text.addPTag());
      editor.text.cursorEnd();
      editor.text.handleFiles(ev.target.files, this);
    });
  }
}
/**
 * XMenuImage 模块.
 * @module XMenuImage
 */
export default XMenuImage;

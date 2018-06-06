// XDom 主类
import $ from '../dom';
import Base from './base';
import inset from '../tools/inset';
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
    $(`#ve-${type}${editor.uid}`).on('click', () => {
      // 如果是源代码
      if (editor.code) {
        return;
      }
      // 如果选中了
      if (this.$selectedImg) {
        if (this.editor.menu.status === 'modify') {
          this.removeDialog();
        } else {
          this.modifyImageDialog();
        }
      } else if (this.editor.menu.status === 'new') {
        this.removeDialog();
      } else {
        this.createDialog();
      }
    });
    // 图片点击
    setTimeout(() => {
      editor.text.$text.on('click', 'img', (ev = window.evente) => {
        const { target } = ev;
        const $img = $(target);
        // 记录当前点击过的图片
        this.$selectedImg = $img;
        // 修改选区并 restore ，防止用户此时点击退格键，会删除其他内容
        editor.selection.createRangeByElem($img);
        this.restoreSelection();
        // 点击图片其他地方 删除 dialog
        this.removeDialog();
        // 更新图片菜单状态
        this.isActive();
      }).on('click  keyup', (ev = window.evente) => {
        if (ev.target.matches('img')) {
          // 点击的是图片，忽略
          return false;
        }
        // 删除记录
        this.$selectedImg = null;
        // 点击图片其他地方 删除 dialog
        this.removeDialog();
        // 更新图片菜单状态
        this.isActive();
        return false;
      });
    }, 0);
  }
  dialogOrigin() {
    this.removeDialog();

    const {
      uid, menu,
    } = this.editor;

    const $dialog = $(`<div id="ve-dialog${uid}" class="ve-dialog" style="top: ${menu.$menu.css('height')}"></div>`);
    this.$editor.append($dialog);
    this.$dialog = $(`#ve-dialog${uid}`);

    const $close = $(`<a id="ve-dialog-close${uid}" href="javascript:;" class="ve-dialog-close-btn">
      <i class="ve-dialog-close"></i>
    </a>`);
    this.$dialog.append($close);
    $(`#ve-dialog-close${uid}`).on('click', () => {
      this.removeDialog();
    });

    const $header = $(`<div id="ve-dialog-header${uid}" class="ve-dialog-header"></div>`);
    this.$dialog.append($header);
    this.$header = $(`#ve-dialog-header${uid}`);

    const $box = $(`<div id="ve-dialog-box${uid}" class="ve-dialog-box"></div>`);
    this.$dialog.append($box);
    this.$box = $(`#ve-dialog-box${uid}`);
  }
  // 修改
  modifyImageDialog() {
    this.editor.menu.status = 'modify';
    const { uid, cfg } = this.editor;

    this.dialogOrigin();

    const $upload = $('<a href="javascript:;" class="ve-dialog-title ve-dialog-title-active">图片宽度</a>');
    this.$header.append($upload);

    const $contentUrl = $(`<div id="ve-dialog-content-url2${uid}" class="ve-dialog-content ve-dialog-content-url">
      <div id="ve-dialog-url-box${uid}" class="ve-dialog-url-box">
      </div>
    </div>`);
    this.$box.append($contentUrl);
    this.$contentUrl = $(`#ve-dialog-content-url2${uid}`);
    this.$contentBox = $(`#ve-dialog-url-box${uid}`);
    this.$url = $(`#ve-dialog-url${uid}`);
    // 图片宽度
    const selectedStyle = this.$selectedImg.attr('style');
    let widthVal = '';

    if (selectedStyle) {
      widthVal = selectedStyle.match(new RegExp(`width:\\s?(\\d+)${cfg.image.unit};?`, 'i'));
    }

    const $width = $(`<input id="ve-dialog-width${uid}" type="tel" minlength="1" maxlength="3" class="ve-input ve-dialog-width" value="${widthVal ? widthVal[1] : ''}" placeholder="图片宽度">`);
    this.$contentBox.append($width);
    $(`#ve-dialog-width${uid}`).on('input', (ev = window.event) => {
      this.changeImageWidth($(ev.target).val());
      ev.preventDefault();
      return false;
    });
    // 宽度单位
    const $symbol = $(`<i class="ve-dialog-url-symbol">${cfg.image.unit}</i>`);
    this.$contentBox.append($symbol);
    // 删除
    const $btn = $(`<div class="ve-dialog-btn-box">
      <button id="ve-dialog-btn${uid}" class="ve-button ve-dialog-btn">删除</button>
    </div>`);
    this.$contentUrl.append($btn);
    this.$btn = $(`#ve-dialog-btn${uid}`).on('click', () => {
      this.$selectedImg.remove();
      this.$selectedImg = null;
      // 恢复选区，不然添加不上
      this.restoreSelection();
      this.removeDialog();
      this.isActive();
    });
  }
  // 创建
  createDialog() {
    this.removeDialog();

    this.editor.menu.status = 'new';
    const { uid, cfg, text } = this.editor;

    this.dialogOrigin();

    const $upload = $('<a href="javascript:;" class="ve-dialog-title">上传</a>');
    this.$header.append($upload);

    const $url = $('<a href="javascript:;" class="ve-dialog-title">图片</a>');
    this.$header.append($url);
    this.$title = $('.ve-dialog-title').on('click', (e) => {
      this.now = $(e.target).index();
      this.tab(this.now);
    });

    const $contentUpload = $(`<div id="ve-dialog-content-upload${uid}" class="ve-dialog-content ve-dialog-content-upload">
      <div id="ve-dialog-upload${uid}" class="ve-dialog-upload"></div>
    </div>`);
    this.$box.append($contentUpload);
    this.$contentUpload = $(`#ve-dialog-upload${uid}`);

    const $contentUrl = $(`<div id="ve-dialog-content-url${uid}" class="ve-dialog-content ve-dialog-content-url">
      <input id="ve-dialog-url${uid}" type="text" class="ve-input ve-dialog-url" placeholder="图片链接">
    </div>`);
    this.$box.append($contentUrl);
    this.$contentUrl = $(`#ve-dialog-content-url${uid}`);
    this.$url = $(`#ve-dialog-url${uid}`);
    // 插入
    const $btn = $(`<div class="ve-dialog-btn-box">
      <button id="ve-dialog-btn${uid}" class="ve-button ve-dialog-btn">插入</button>
    </div>`);
    this.$contentUrl.append($btn);
    this.$btn = $(`#ve-dialog-btn${uid}`).on('click', () => {
      inset(undefined, this);
      this.removeDialog();
    });
    // 上传 +
    const $uploadText = $(`<i id="ve-dialog-file-tip${uid}" class="ve-dialog-file-tip">+</i>`);
    this.$contentUpload.append($uploadText);
    this.$uploadText = $(`#ve-dialog-file-tip${uid}`);
    // 上传
    const multiple = cfg.image.multiple ? ' multiple="multiple"' : '';
    const $file = $(`<input class="ve-dialog-file"${multiple} accept="${cfg.image.accept}" type="file">`);
    this.$contentUpload.append($file).on('change', (ev = window.event) => {
      const { files } = ev.target;
      this.$uploadText.addClass('ve-dialog-file-tip-uping');
      text.handleFiles(files, this);
    });

    this.$content = $('.ve-dialog-content');
    // 切换到当前索引
    this.tab(this.now);
  }
  // 删除
  removeDialog() {
    const { menu } = this.editor;
    menu.remove();
    menu.status = '';
  }

  tab(now) {
    this.$content.css('display', 'none').eq(now).css('display', 'block');
    this.$title.removeClass('ve-dialog-title-active').eq(now).addClass('ve-dialog-title-active');
  }
  // 恢复选区
  restoreSelection() {
    // 恢复选区，不然添加不上
    this.editor.selection.restoreSelection();
  }
  // 改变图片宽度
  changeImageWidth(width) {
    this.$selectedImg.css('width', width ? `${width}${this.editor.cfg.image.unit}` : 'auto');
  }
  // 是否是选中
  isActive() {
    const { type, editor } = this;
    const $item = $(`#ve-${type}${editor.uid}`);
    if (this.$selectedImg) {
      $item.addClass('ve-menu-link-active');
    } else {
      $item.removeClass('ve-menu-link-active');
    }
  }
}
/**
 * XMenuImage 模块.
 * @module XMenuImage
 */
export default XMenuImage;

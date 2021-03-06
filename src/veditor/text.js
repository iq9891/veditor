import $ from './dom';
import Upload from './upload';
/**
* XText 对象
* 下面内容区
* @example
* new XText();
*/
const XText = class {
  constructor(editor) {
    this.editor = editor;
    this.isMobile = this.editor.isMobile;
    this.$editor = editor.$editor;
    this.cfg = editor.cfg;
    // 初始化内容
    this.create();
    // 绑定事件
    this.bind();
  }

  create() {
    const { prefix, wrap } = this.cfg.name;

    this.$tem = $(`<div id="ve-wrap${this.editor.uid}" class="ve-text-wrap${wrap ? ` ${prefix}${wrap}` : ''}">
        <div id="ve-text${this.editor.uid}" contenteditable="true" class="ve-text"></div>
        </div>`);

    this.$editor.append(this.$tem);
    this.$text = $(`#ve-text${this.editor.uid}`);
    this.$wrap = $(`#ve-wrap${this.editor.uid}`);
  }
  /**
  * 绑定事件
  */
  bind() {
    // 实时保存选取
    this.saveRangeRealTime();
    // 清空之后
    this.empty();
    // 绑定事件
    this.eventFn();
  }
  /**
  * 清空之后
  */
  empty() {
    this.$text.on('keydown', (e = window.event) => {
      if (e.keyCode !== 8) {
        return;
      }
      const txtHtml = this.$text.html().toLowerCase().trim();

      if (txtHtml === '<p><br></p>') {
        e.preventDefault();
      }
    });
  }
  /**
  * 绑定事件
  */
  eventFn() {
    // 点击选中操作的文字
    this.$text.on('blur', () => {
      if (this.isMobile) {
        this.editor.$editor.removeClass('ve-focus');
      }
    });
    this.$text.on('focus', () => {
      if (this.isMobile) {
        this.editor.$editor.addClass('ve-focus');
      }
    });
  }
  /**
  * 新建一行 <p><br/></p>
  * 下面内容区
  */
  newline() {
    const { $text } = this;
    const $children = $text.children();
    // 如果是空的
    if (!$children.length) {
      this.$line1 = $('<p>这里是内容</p>');
      this.$text.append(this.$line1);
      this.editor.selection.createRangeByElem(this.$line1[0]);
      // this.cursorEnd();
    }
  }
  /**
  * 新建一行 <p><br/></p>
  * @param {String} html 内容
  */
  setHtml(html = '<p><br/></p>') {
    this.$text.html(html);
    // this.cursorEnd();
  }
  /**
  * 获取内容
  * @return {String} html 内容
  */
  getHtml() {
    return this.$text.html();
  }
  /**
  * 新建一行 <p><br/></p>
  * @param {String} html 内容
  */
  setInsertHtml(html = '') {
    if (html) {
      this.$text.append($(html));
    } else {
      const { childrens } = this.editor;
      const newChilds = this.addPTag(childrens);
      this.$text.append(newChilds);
    }
    // this.cursorEnd();
  }
  /**
  * 检测是否是 p 标签，不是套个 p 标签
  * @param {Array} childs 子节点集合
  */
  addPTag(childrens) {
    const childs = [];
    if (!childrens || !childrens.length) {
      childs.push($('<p><br></p>')[0]);
    } else {
      const $p = $('<p></p>');
      childrens.forEach((cds) => {
        if (cds.tagName !== 'P') {
          $p.append([cds]);
          childs.push($p[0]);
        } else {
          childs.push(cds);
        }
      });
    }
    return childs;
  }
  /**
  * 新建选区，移动光标到最后
  */
  cursorEnd() {
    const { $text } = this;
    const $last = $text.children().last();
    let range = null;
    if (window.getSelection && $last.length) {
      $last[0].focus();
      range = window.getSelection();
      range.selectAllChildren($last[0]);
      range.collapseToEnd();
    } else if (document.selection) {
      range = document.selection.createTextRange();
      range.moveToElementText($last);
      range.collapse(false);
      // 避免产生空格
      range.select();
    }
  }
  // 实时保存选取
  saveRangeRealTime() {
    const $textElem = this.$text;
    const { isMobile } = this.editor;

    // 保存当前的选区
    const saveRange = () => {
      const { selection, menu } = this.editor;
      // 随时保存选区
      selection.saveRange();
      // 更新按钮 ative 状态
      menu.testActive();
    };
    // 按键后保存
    if (!isMobile) {
      $textElem.on('keyup', saveRange);
      $textElem.on('mousedown', () => {
        // mousedown 状态下，鼠标滑动到编辑区域外面，也需要保存选区
        $textElem.on('mouseleave', saveRange);
      });
      $textElem.on('mouseup', () => {
        saveRange();
        // 在编辑器区域之内完成点击，取消鼠标滑动到编辑区外面的事件
        $textElem.off('mouseleave', saveRange);
      });
    }
  }
  // 处理拖拽文件
  handleFiles(files, self, callback = () => {}) {
    const reader = new FileReader();
    const key = 0;
    const isImage = files[key].type.indexOf('image') > -1;
    const isText = files[key].type.indexOf('text') > -1;
    // 如果读取的是图片
    if (isImage) {
      reader.readAsDataURL(files[key]);
    } else if (isText) {
      // 读取的是文件
      reader.readAsText(files[key]);
    }
    reader.addEventListener('load', () => {
      const { type } = self.editor.cfg.image;
      // 如果是 图片
      if (isImage) {
        if (type === 'base64') {
          Upload.base64(files, self, 'images', callback);
        } else if (type === 'ajax') {
          Upload.ajax(files, self, callback);
        }
      } else if (isText) {
        Upload.base64(files, self, 'text', callback);
      }
    }, false);
  }
  /**
  * 按钮对文字的操作，如加粗。。
  * @param {String} name 操作的类型，name 的类型可以参照 https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand
  * @param {String} value 操作对应的值
  */
  handle(name, value) {
    if (this[name]) {
      this[name]();
    } else {
      document.execCommand(name, false, value);
      const { selection } = this.editor;
      // 可以多次操作
      selection.saveRange();
      selection.restoreSelection();
    }
  }
};
/**
 * XText 模块.
 * @module XText
 */
export default XText;

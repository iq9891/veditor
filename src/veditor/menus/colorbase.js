// XDom 主类
import $ from '../dom';
import { getElementLeft, getElementTop } from '../tools/el';
import color from '../tools/color';
import svgFn from '../tools/svg';

// 小圆点的固定宽高边框阴影
const dot = 5;
// 外框的内边距
const colorPadding = 8;
// 小点最大移动的距离
const dotMaxX = 172 - 5;
const dotMaxY = 172 - 5;
// hue 最大的 top
const hueMaxY = 172 - 3;
// 颜色对话框对象
let $colorDialog = {
  remove() {},
};
/**
* XMenuColorBase 对象
* fontcolor|backcolor 继承
* @example
* new XMenuColorBase(editor);
*/
const XMenuColorBase = class {
  /**
   * 构造函数
   *
   * @param {Object} editor 编辑器的对象
   * @param {String} type 什么类型，如 backcolor
   */
  constructor(editor, type) {
    this.editor = editor;
    this.$editor = editor.$editor;
    this.cfg = editor.cfg;
    this.type = type;
    this.$doc = $(document);
    this.hsb = {
      h: 0,
      s: 100,
      b: 100,
    };
    this.rgb = {
      r: 255,
      g: 255,
      b: 255,
    };
    // 默认颜色
    this.defaultHex = 'ffffff';
    // 重置一下
    this.reset();
    // 初始化
    this.create();
  }

  create() {
    const { cfg, type, editor } = this;
    const { lang } = cfg;
    this.$tem = $(`<a id="ve-${type}${editor.uid}" href="javascript:void('${lang[type]}');" title="${lang[type]}" class="ve-menu-link ve-menu-link-font"><?xml version="1.0" encoding="UTF-8"?></a>`);
    svgFn(this.$tem, type);
  }

  bind() {
    const { type, editor } = this;
    $(`#ve-${type}${editor.uid}`).on('click', () => {
      const { selection, code } = editor;
      // 如果是源代码
      if (code) {
        return;
      }
      // 只有选中了才有效果
      if (!selection.isSelectionEmpty()) {
        this.panel();
        this.setColor();
      }
    });
  }
  // 设置当前颜色
  setColor() {
    const { selection } = this.editor;
    const $range = selection.getSelectionContainerElem(selection.getRange());
    if ($range) {
      const oldColor = $range.css(this.type === 'backcolor' ? 'background' : 'color');
      console.log(oldColor, 'oldColor');
      this.setOldColor(oldColor);
    }
  }
  // 创建颜色面板
  panel() {
    const { uid, cfg, menu } = this.editor;

    this.remove();

    const $dialog = $(`<div id="ve-dialog${uid}" class="ve-dialog" style="top: ${menu.$menu.css('height')}"></div>`);
    this.$editor.append($dialog);
    $colorDialog = $(`#ve-dialog${uid}`);

    const $close = $(`<a id="ve-dialog-close${uid}" href="javascript:;" class="ve-dialog-close-btn">
      <i class="ve-dialog-close"></i>
    </a>`);
    $colorDialog.append($close);
    $(`#ve-dialog-close${uid}`).on('click', () => {
      this.remove();
    });

    const $header = $(`<div class="ve-dialog-header">
      <a href="javascript:;" class="ve-dialog-title ve-dialog-title-active">${cfg.lang[this.type]}</a>
    </div>`);
    $colorDialog.append($header);

    const $box = $(`<div id="ve-dialog-box${uid}" class="ve-dialog-color-box">`);
    $colorDialog.append($box);
    this.$box = $(`#ve-dialog-box${uid}`);

    const $color = $(`<div id="ve-dialog-color${uid}" class="ve-dialog-color" style="background-color: ${this.color};">
      <div id="ve-dialog-inner${uid}" class="ve-dialog-color-inner"></div>
    </div>`);
    this.$box.append($color);
    this.$inner = $(`#ve-dialog-inner${uid}`);
    this.$color = $(`#ve-dialog-color${uid}`);

    const $hue = $(`<div id="ve-dialog-hue${uid}" class="ve-dialog-color-hue">
      <div id="ve-dialog-move${uid}" class="ve-dialog-color-hue-move"></div>
    </div>`);
    this.$box.append($hue);
    this.$move = $(`#ve-dialog-move${uid}`);

    const $left = $('<i class="ve-dialog-color-hue-left"></i>');
    this.$move.append($left);

    const $right = $('<i class="ve-dialog-color-hue-right"></i>');
    this.$move.append($right);

    const $handle = $('<div class="ve-dialog-color-handle"></div>');

    const $show = $(`<div class="ve-dialog-color-show-color">
      <div id="ve-dialog-new${uid}" class="ve-dialog-color-new-color" style="background: ${this.newColor};"></div>
    </div>`);

    const $old = $(`<div id="ve-dialog-old${uid}" class="ve-dialog-color-old-color" style="background: ${this.oldColor};"></div>`);
    $show.append($old);

    $handle.append($show);

    const $fieldR = $(`<div class="ve-dialog-color-field">
      <p class="ve-dialog-color-title">R</p>
    </div>`);

    const $r = $(`<input id="ve-dialog-r${uid}" type="tel" maxlength="3" size="3" class="ve-dialog-color-inp">`);
    $fieldR.append($r);
    $handle.append($fieldR);

    const $fieldG = $(`<div class="ve-dialog-color-field">
      <p class="ve-dialog-color-title">G</p>
    </div>`);

    const $g = $(`<input id="ve-dialog-g${uid}" type="tel" maxlength="3" size="3" class="ve-dialog-color-inp">`);
    $fieldG.append($g);
    $handle.append($fieldG);

    const $fieldB = $(`<div class="ve-dialog-color-field">
      <p class="ve-dialog-color-title">B</p>
    </div>`);

    const $b = $(`<input id="ve-dialog-b${uid}" type="tel" maxlength="3" size="3" class="ve-dialog-color-inp">`);
    $fieldB.append($b);
    $handle.append($fieldB);

    const $fieldWrite = $(`<div class="ve-dialog-color-field">
      <p class="ve-dialog-color-title">#</p>
    </div>`);

    const $write = $(`<input id="ve-dialog-w${uid}" type="tel" maxlength="6" size="6" class="ve-dialog-color-inp">`);
    $fieldWrite.append($write);
    $handle.append($fieldWrite);

    const $fieldSub = $(`<a id="ve-dialog-sub${uid}" class="ve-dialog-color-sub" href="javascript:;">确定</a>`);
    $handle.append($fieldSub);

    this.$box.append($handle);

    $(`#ve-dialog-sub${uid}`).on('click', () => {
      this.sub();
    });

    this.$r = $(`#ve-dialog-r${uid}`).on('input', () => {
      this.writeColor();
    });
    this.$g = $(`#ve-dialog-g${uid}`).on('input', () => {
      this.writeColor();
    });
    this.$b = $(`#ve-dialog-b${uid}`).on('input', () => {
      this.writeColor();
    });
    this.$w = $(`#ve-dialog-w${uid}`).on('input', () => {
      this.writeColor('hex');
    });
    this.$new = $(`#ve-dialog-new${uid}`);
    this.$old = $(`#ve-dialog-old${uid}`).on('click', () => {
      this.setOldColor(this.oldColor);
    });
    this.$hue = $(`#ve-dialog-hue${uid}`);

    this.$link = $(`#ve-${this.type}${uid} g`);

    this.someEvent();
    this.setRgbVal();
  } // end panel
  setOldColor(value) {
    const rgbMatch = value.match(/rgba?\((.+)\)/);
    if (rgbMatch[1]) {
      const rgb = rgbMatch[1].split(',');
      const hex = color.rgbToHex({
        r: rgb[0] - 0,
        g: rgb[1] - 0,
        b: rgb[2] - 0,
      });
      this.setPanelColor(`#${hex}`);
    }
  }
  // 输入色值
  writeColor(type = 'rgb') {
    const r = this.$r.val() - 0;
    const g = this.$g.val() - 0;
    const b = this.$b.val() - 0;
    const w = this.$w.val();
    this.updateOld();

    if (type === 'rgb') {
      /* eslint-disable */
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        const hex = color.rgbToHex({
          r,
          g,
          b,
        });
        this.$w.val(hex);
        this.setPanelColor(`#${hex}`);
      }
    } else {
      const rgb = color.hexToRgb(w);
      this.$r.val(rgb.r);
      this.$g.val(rgb.g);
      this.$b.val(rgb.b);
      this.setPanelColor(`#${w}`);
    }
  }
  // 设置初始颜色
  setPanelColor(newColor) {
    this.hsb = color.rgbToHsb(color.hexToRgb(newColor));
    const sbPos = color.offsetSB(this, this.hsb);

    this.left = sbPos.left;
    this.top = sbPos.top;
    this.hubTop = color.offsetH(this, this.hsb);

    this.setMoveElem();
    this.setInnerElem();

    this.rgb = color.hsbToRgb({ h: this.hsb.h, s: 100, b: 100 });
    // 主色系渲染
    this.$color.css('background-color', `#${color.rgbToHex(this.rgb)}`);
    // 设置新颜色
    this.$new.css('background', newColor);
    // 备份新颜色，切换颜色的时候替换旧颜色
    this.oldColor = newColor;
  }
  // 确定
  sub() {
    const { editor } = this;
    const { selection, text } = editor;
    // 恢复选区，不然添加不上
    selection.restoreSelection();

    const type = this.type.replace(/(c)o/, ($1) => `${$1[0].toUpperCase()}${$1[1]}`);

    text.handle(type, `#${this.hex}`);
    this.remove();
  }

  remove() {
    $colorDialog.remove();
    this.isActive();
    this.reset();
  }
  // 重置
  reset() {
    this.hex = this.defaultHex;
    this.left = 0;
    this.top = 0;
    this.hubTop = 0;
    this.oldColor = 'rgb(255, 255, 255)';
    this.newColor = 'rgb(255, 255, 255)';
    this.color = 'rgb(255, 0, 0)';
  }
  // 拖拽绑定事件
  someEvent() {
    this.colorboxSize = this.$color[0].clientWidth - (colorPadding * 2);

    this.$color.on('mousedown', (ev = window.event) => {
      this.colorDown(ev);
    });

    this.$hue.on('mousedown', (ev = window.event) => {
      this.hubDown(ev);
    });
  }
  // 颜色的点击
  colorDown(ev) {
    this.left = ev.pageX - getElementLeft(this.$color[0]) - dot;
    this.top = ev.pageY - getElementTop(this.$color[0]) - dot;

    this.setInnerElem();
    this.getRgbColor();
    this.setRgbVal();

    this.$doc.on('mousemove', (evMove = window.evente) => {
      this.colorMove(evMove);
    }).on('mouseup', () => {
      this.colorUp();
    });
  }
  // 左边颜色
  colorMove(ev) {
    this.left = ev.pageX - getElementLeft(this.$color[0]) - dot;
    this.top = ev.pageY - getElementTop(this.$color[0]) - dot;
    // 拖拽限制
    if (this.left > dotMaxX) {
      this.left = dotMaxX;
    }
    if (this.left < -dot) {
      this.left = -dot;
    }
    if (this.top > dotMaxY) {
      this.top = dotMaxY;
    }
    if (this.top < -dot) {
      this.top = -dot;
    }

    this.setInnerElem();
    this.getRgbColor();
    this.setRgbVal();
  }

  colorUp() {
    this.$doc.off('mousemove mouseup');
  }
  // 颜色的点击
  hubDown(ev) {
    this.hubTop = ev.pageY - getElementTop(this.$color[0]) - dot;
    this.setMoveElem();

    this.setHubVal();

    this.$doc.on('mousemove', (evMove = window.evente) => {
      this.hubMove(evMove);
    }).on('mouseup', () => {
      this.hubUp();
    });
  }
  // 左边颜色
  hubMove(ev) {
    this.hubTop = ev.pageY - getElementTop(this.$color[0]) - dot;
    // 拖拽限制
    if (this.hubTop > hueMaxY) {
      this.hubTop = hueMaxY;
    }
    if (this.hubTop < 0) {
      this.hubTop = 0;
    }
    this.setMoveElem();
    this.setHubVal();
  }

  hubUp() {
    this.$doc.off('mousemove mouseup');
  }
  // 更新旧颜色
  updateOld() {
    this.$old.css('background', this.oldColor);
  }
  // 设置移动盒子的颜色
  setMoveElem() {
    this.$move.css({
      top: this.hubTop,
    });
  }
  // 设置移动盒子的颜色
  setInnerElem() {
    this.$inner.css({
      left: this.left,
      top: this.top,
    });
  }
  // 根据 top 获取颜色
  getHueColor() {
    const { r, g, b } = this.rgb;
    this.hsb.h = color.getH(this, this.hubTop);
    this.oldColor = `rgb(${r}, ${g}, ${b})`;
    const oldHsb = color.rgbToHsb(this.rgb);
    oldHsb.h = this.hsb.h;
    this.rgb = color.hsbToRgb(oldHsb);
    this.hex = color.rgbToHex(this.rgb);

    this.color = color.rgbToHex(color.hsbToRgb({
      h: this.hsb.h,
      s: 100,
      b: 100,
    }));
  }
  // 根据 left top 获取颜色
  getRgbColor() {
    const sb = color.getSB(this, this.left, this.top);
    const { r, g, b } = this.rgb;
    this.hsb.s = sb.s;
    this.hsb.b = sb.b;
    this.oldColor = `rgb(${r}, ${g}, ${b})`;
    this.rgb = color.hsbToRgb(this.hsb);
    this.hex = color.rgbToHex(this.rgb);
  }
  // 设置数值
  setRgbVal() {
    this.$r.val(this.rgb.r);
    this.$g.val(this.rgb.g);
    this.$b.val(this.rgb.b);
    this.$w.val(this.hex);
    this.updateOld();
    this.$new.css('background', `#${this.hex}`);
  }
  // 设置数值
  setHubVal() {
    this.getHueColor();
    this.setRgbVal();

    this.$color.css('background-color', `#${this.color}`);
  }
  // 是否是加粗
  isActive() {
    const { selection, uid } = this.editor;
    const $rang = selection.getSelectionContainerElem(selection.getRange());

    if (this.$link && $rang) {
      if (this.type === 'backcolor') {
        const color = this.getBackColor($rang);
        this.$link.css('fill', /rgba/.test(color) ? '#666' : color);
        ;
      } else {
        const color = $rang.css('color');
        this.$link.css('fill', /rgba/.test(color) ? '#666' : color);
      }
    }
  }
  // 获取背景
  getBackColor($rang) {
    let backColor = null;
    const getback = ($rang) => {
      const $parent = $rang.parent();
      backColor = $rang.css('background-color');
      if (/rgba/.test(backColor) && $parent.length > 0 && $parent[0].tagName !== 'P' && $rang[0].tagName !== 'P') {
        getback($parent);
      }
    }

    if ($rang) {
      getback($rang);
    }

    return backColor;
  }
};
/**
 * XMenuColorBase 模块.
 * @module XMenuColorBase
 */
export default XMenuColorBase;

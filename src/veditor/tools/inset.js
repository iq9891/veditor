// 插入图片
export default (result, self, isImage = true) => {
  const urlVal = result || self.$url.val();
  const { selection, text } = self.editor;
  // 恢复选区，不然添加不上
  selection.restoreSelection();
  // 光标移到最后
  text.cursorEnd();
  // 网址
  /* eslint-disable */
  const imgPattern = /https?:\/\/.+\.(jpg|gif|png|svg)/;

  if (imgPattern.test(urlVal) || isImage) {
    text.handle('insertHTML', `<img class="ve-text-img" src="${urlVal}" />`);
  } else {
    text.handle('insertText', urlVal);
  }
}

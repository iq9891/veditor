export function getElementLeft(element) {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}

export function getElementTop(element) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}
/**
 * 查找父级某一元素
 *
 * @param {Object} element 元素
 * @param {String} tagName 标签名字
 * @private
 * @returns {Boolean} 是否有
 */
export function searchElement(element, tagName) {
  const searchEle = (ele, tag) => {
    const eleParent = ele.parent();
    if (eleParent.length) {
      const eleParentTag = eleParent[0].tagName;
      if (eleParentTag === 'BODY') {
        return false;
      }
      if (eleParentTag === tag) {
        return true;
      }
      return searchEle();
    }
    return false;
  };
  return searchEle(element, tagName);
}

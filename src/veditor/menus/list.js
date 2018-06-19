import Base from './base';
/**
* XMenuList 对象
* @example
* new XMenuList(editor);
*/
class XMenuList extends Base {
  /**
   * 构造函数
   *
   * @param {Object} editor 编辑器的对象
   */
  constructor(editor) {
    super(editor, 'insertUnorderedList');
  }
}
/**
 * XMenuList 模块.
 * @module XMenuList
 */
export default XMenuList;

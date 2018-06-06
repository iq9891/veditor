// VEditor 主类
import VEditor from './editor';
// VEditor 样式
import '../styles/editor.scss';

if (typeof window !== 'undefined' && !window.vEditor) {
  window.vEditor = VEditor;
}

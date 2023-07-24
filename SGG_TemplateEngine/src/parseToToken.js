import Scanner from './Scanner.js';
import nextTokens from './nextTokens'
/* 
        将模板字符串转换为数组
*/
export default function parseToTokens(templateStr) {
  let tokens = [];
  // 创建扫描器
  let scanner = new Scanner(templateStr);
  let words;
  // 让扫描器工作
  while (!scanner.eos()) {
    // 收集开始标记出现之前的文字
    words = scanner.scanUtil('{{');
    if (words != '') {
      // 存起来
      tokens.push(['text', words]);
    }

    // 过双大括号
    scanner.scan('{{');

    // 收集开始标记出现之前的文字
    words = scanner.scanUtil('}}');
    if (words != '') {
      if (words[0] == '#') {
        // 存起来
        tokens.push(['#', words.substring(1)]);
      }else if (words[0] == '/') {
          tokens.push(['/',words.substring(1)]);
      }else {
        tokens.push(['name',words]);
    }
    }

    // 过双大括号
    scanner.scan('}}');
  }
  return  nextTokens(tokens);
}

/* 
折叠tokens，将#和/之间的tokens折叠起来，作为他下标为3的项
*/
export default function nextTokens(tokens) {
  // 结果数组
  var nextTokens = [];
  //栈结构存放小的tokens
  let sections = [];

  //   收集器
  var collector = nextTokens;

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    switch (token[0]) {
      case '#':
        // 给这个token下标为2的项创建一个数组，以收集元素
        collector.push(token);
        // 压栈 （入栈）
        sections.push(token);
        // 收集器换人
        collector = token[2] = [];
        break;
      case '/':
        //出栈
        sections.pop();
        //改变收集器为栈结构队尾（队尾是栈顶）哪项的下表为2的数组
        collector =
          sections.length > 0 ? sections[sections.length - 1][2] : nextTokens;
        break;
      default:
        //   甭管collector是谁，可能是nexttokens,也可能是某个token下标为2的数组，甭管是谁，退入collector即可
        collector.push(token);
        break;
    }
  }
  return nextTokens;
}

/*  
    扫描器类
*/
export default class Scanner {
  constructor(templateStr) {
    this.templateStr = templateStr;
    // 指针
    this.pos = 0;
    //尾巴
    this.tail = templateStr;
  }
  //走过指定内容，没有返回值
  scan(tag) {
      if(this.tail.indexOf(tag) == 0) {
          //tag 有多长，比如{{长度是2，就让指针后移多少位
          this.pos += tag.length
        //   尾巴也要变
        this.tail = this.templateStr.substring(this.pos)
      }

  }
  scanUtil(stopTag) {
    // 记录下执行脚本的时候poa的值
    const pos_backup = this.pos;
    //当尾巴的开头不是stop.tag的时候，就说明还没有扫描到stopTag
    // 写&&很有必要因为防止找不到，那么寻找到最后也要停止下来 
    while (!this.eos()  && this.tail.indexOf(stopTag) != 0) {
      this.pos++;
   

      this.tail = this.templateStr.substring(this.pos);
    }
    return this.templateStr.substring(pos_backup, this.pos);
  }
  eos() {
      return  this.pos >= this.templateStr.length
  }
}

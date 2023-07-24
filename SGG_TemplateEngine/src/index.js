
import parseToTokens from './parseToToken.js'
import renderTemplate from './renderTemplate.js'
import lookup from './lookup.js'
window.SSG_TemplateEngine = {
  render(templateStr, data) {
    //   调用parseToTokens（）函数让模板字符串变为tokens数组
      let tokens = parseToTokens(templateStr)
      
      let domStr = renderTemplate(tokens,data)
  },
};

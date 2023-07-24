/* 
       让tokens数组转换为字符串
*/
export default function renderTemplate(tokens,data) {
    console.log(tokens,data)
    // 结果字符串
    let resultStr = ''
    // 遍历tokens
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        
        // 看类型
        if (token[0] == 'text') {
            resultStr += token[1]
        }else if (token[0] == 'name') {
            resultStr += data[token[1]]
        }else if (token[0] == '#') {
            
        }
    }
    console.log(resultStr);
    return resultStr
}
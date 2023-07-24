const path = require('path')

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'',
        path:path.resolve(__dirname,'dist')
    }
}

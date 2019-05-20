let fs = require('fs')
let path = require('path')

class Compiler {
    constructor(config) {
        // entry output
        this.config = config;
        // 依赖模块的路径 ‘./a.js’
        this.entryId;
        // 所有依赖的模块
        this.modules = {};

        this.entry = config.entry; // 入口路径 ‘./src/index.js’
        // 工作路径： 运行npx bbt-webpack 的路径 
        this.root = process.cwd()
    }
    /**
    * 读取文件内容
    * @param {*} modulePath 文件 路径
    */
    getSource(modulePath) {
        let content = fs.readFileSync(modulePath, 'utf8')
        return content
    }
    /**
     * 解析模块的依赖关系
     * @param {*} modulePath 模块名
     * @param {*} isEntry 是否是入口文件
     */
    buildModule(modulePath, isEntry) {
        let source = this.getSource(modulePath)

        // 模块名字  也就是相对路径  src/index.js
        // modulePath = /Users/babytree/bbtworkspace/bbt-webpack/demo/src/index.js
        let moduleName = './' + path.relative(this.root, modulePath)

        console.log(moduleName, source);
        
    }

    emitFile() { }
    run() {
        // this.root = /Users/babytree/bbtworkspace/bbt-webpack/demo
        // this.entry = ./src/index.js 
        // 创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true) // 工作路径+相对路径 = 绝对路径

        
        // 发布编译结果
        this.emitFile()
    }
}
module.exports = Compiler
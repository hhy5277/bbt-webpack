let fs = require('fs')
let path = require('path')
let babylon = require('babylon')
let t = require('@babel/types')
let traverse = require('@babel/traverse').default
let generator = require('@babel/generator').default

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
     * AST(抽象语法树)解析并更改源码
     * @param {*} source 文件源码
     * @param {*} parentPath 副路径
     * 
     * 把let str = require('./a.js') 转成 let str = __webpack_require__("./src/a.js");
     * 四步骤：
     * babylon 源码转AST
     * @babel/traverse 遍历到对应的节点
     * @babel/types 替换节点内容
     * @babel/generator AST转成源码
     */
    parse(source, parentPath) {
        console.log('------parse----');
        console.log(source, parentPath);
        let ast = babylon.parse(source)
        let dependencies = []
        traverse(ast, {
            CallExpression(p) {
                let node = p.node; // 拿到节点
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__' // 替换
                    let moduleName = node.arguments[0].value;
                    moduleName = moduleName + (path.extname(moduleName) ? '' : '.js'); // 补全扩展名后缀
                    moduleName = './' + path.join(parentPath, moduleName); // 拼上副路径 ./src/a.js
                    dependencies.push(moduleName)
                    node.arguments = [t.stringLiteral(moduleName)] // 改a.js为./src/a.js
                }
            }
        });
        let sourceCode = generator(ast).code; // 转AST为code
        console.log(sourceCode, dependencies);
        return { sourceCode, dependencies }
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

        console.log('moduleName', moduleName);
        console.log(source);

        if (isEntry) this.entryId = moduleName // 主入口

        // 需要对source源码进行改造，返回一个依赖列表 
        // source：let str = require('./a.js')  把require转成__webpack_require__  把
        let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)) // 副路径 ./src 

        // 把相对路径和模块中的内容对应起来 
        this.modules[moduleName] = sourceCode

        // 递归解析依赖关系
        dependencies.forEach((dep) => {
            this.buildModule(path.join(this.root, dep), false)
        })
    }

    emitFile() { }
    run() {
        // this.root = /Users/babytree/bbtworkspace/bbt-webpack/demo
        // this.entry = ./src/index.js 
        // 创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true) // 工作路径+相对路径 = 绝对路径
        console.log('解析之后：', this.modules, this.entryId);


        // 发布编译结果
        this.emitFile()
    }
}
module.exports = Compiler
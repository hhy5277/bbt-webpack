#! /usr/bin/env node

let path = require('path')

// 获取配置文件： webpack.config.js
let config = require(path.resolve('webpack.config.js')) 

// 手写编译类
let Compiler = require('../lib/Compiler.js')
let compiler = new Compiler(config)
compiler.hooks.entryOption.call() // 订阅发布  在传入配置文件时使用钩子

// 运行
compiler.run()


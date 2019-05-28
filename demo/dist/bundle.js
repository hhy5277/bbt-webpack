(function (modules) {
    var installedModules = {};
  
    // webpack自行实现了一个require的方法,起别名为__webpack_require__
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }
  
    // 以./src/index.js为入口,层层递归所引的依赖模块
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
  })
    /************************************************************************/
    // 以key-value的形式引入的模块代码
    ({
        
            "./src/index.js":
            (function (module, exports, __webpack_require__) {
              eval(`__webpack_require__("./src/index.less");

let str = __webpack_require__("./src/a.js");

console.log(str);`);
            }),
        
            "./src/index.less":
            (function (module, exports, __webpack_require__) {
              eval(`let style = document.createElement('style');
style.innerHTML = "body {\\n  background: red;\\n}\\n";
document.head.appendChild(style);`);
            }),
        
            "./src/a.js":
            (function (module, exports, __webpack_require__) {
              eval(`let b = __webpack_require__("./src/base/b.js");

module.exports = 'a' + b;`);
            }),
        
            "./src/base/b.js":
            (function (module, exports, __webpack_require__) {
              eval(`module.exports = 'b';`);
            }),
        
     
    });
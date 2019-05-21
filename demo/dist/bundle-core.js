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
    "./src/a.js":
      (function (module, exports, __webpack_require__) {
        eval("let b = __webpack_require__(/*! ./base/b.js */ \"./src/base/b.js\")\nmodule.exports = 'a' + b\n\n//# sourceURL=webpack:///./src/a.js?");
      }),
    "./src/base/b.js":
      (function (module, exports) {
        eval("module.exports = 'b'\n\n//# sourceURL=webpack:///./src/base/b.js?");
      }),
    "./src/index.js":
      (function (module, exports, __webpack_require__) {
        eval("let str = __webpack_require__(/*! ./a.js */ \"./src/a.js\")\nconsole.log(str);\n\n\n//# sourceURL=webpack:///./src/index.js?");
      })
  });
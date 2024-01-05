(function() {
var __webpack_modules__ = {
"138": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Foo: function() { return Foo; },
  bar: function() { return bar; },
  foo: function() { return foo; }
});
 const foo = {
    bar () {
        this.ccc = 1;
        this.ccc = 1;
        this.aaa["0"].bbb.ccc = 1;
        this.aaa.foo.bbb.ccc = 1;
    }
};
 class Foo {
    bar() {
        this.aaa[index].bbb.ccc = 1;
        this.aaa[0].bbb.ccc = 1;
    }
}
 function bar() {
    this.aaa[index].bbb.ccc = 1;
    this.aaa[0].bbb.ccc = 1;
}
}),

}
// The module cache
 var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
// Check if module is in cache
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
      return cachedModule.exports;
      }
      // Create a new module (and put it into the cache)
      var module = (__webpack_module_cache__[moduleId] = {
       exports: {}
      });
      // Execute the module function
      __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
// Return the exports of the module
 return module.exports;

}
// webpack/runtime/define_property_getters
!function() {
__webpack_require__.d = function(exports, definition) {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
}();
// webpack/runtime/make_namespace_object
!function() {
// define __esModule on exports
__webpack_require__.r = function(exports) {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

}();
// webpack/runtime/has_own_property
!function() {
__webpack_require__.o = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

}();
var __webpack_exports__ = __webpack_require__("138");
})()

//# sourceMappingURL=main.js.map
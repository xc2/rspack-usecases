/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* unused harmony exports foo, Foo, bar */
const foo = {
  bar() {
    this.aaa[index].bbb.ccc = 1;
    this.aaa[index + 1].bbb.ccc = 1;

    this.aaa[0].bbb.ccc = 1;
    this.aaa.foo.bbb.ccc = 1;
  },
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

/******/ })()
;
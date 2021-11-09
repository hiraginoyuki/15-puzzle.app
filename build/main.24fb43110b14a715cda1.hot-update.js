/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_15_puzzle"]("main",{

/***/ "./src/utils/use-canvas.ts":
/*!*********************************!*\
  !*** ./src/utils/use-canvas.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useCanvas\": function() { return /* binding */ useCanvas; }\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction useCanvas(onFrame, deps, fps = 60) {\n    const [canvasElement, setCanvasElement] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n    const ctxRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n        if (!canvasElement)\n            return;\n        ctxRef.current = canvasElement.getContext(\"2d\");\n    }, [canvasElement]);\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n        if (!canvasElement || !ctxRef.current)\n            return;\n        const id = setInterval(() => {\n            requestAnimationFrame(() => {\n                onFrame(ctxRef.current, +new Date);\n            });\n        }, 1000 / fps);\n        return () => clearInterval(id);\n    }, [canvasElement, fps, ...deps || []]);\n    return setCanvasElement;\n}\n\n\n//# sourceURL=webpack://15-puzzle/./src/utils/use-canvas.ts?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "ad909c4347675ece26f6"; }
/******/ }();
/******/ 
/******/ }
);
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_init_page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/init-page.js */ \"./src/modules/init-page.js\");\n\n\n(0,_modules_init_page_js__WEBPACK_IMPORTED_MODULE_0__.default)();\n\n//# sourceURL=webpack://to-do-list/./src/index.js?");

/***/ }),

/***/ "./src/modules/init-page.js":
/*!**********************************!*\
  !*** ./src/modules/init-page.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _task_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./task.js */ \"./src/modules/task.js\");\n\n\n\n\nfunction initPage () {\n    const element = document.createElement(\"div\");\n    element.textContent = \"Hello world!\";\n    document.body.appendChild(element);\n\n    const task1 = (0,_task_js__WEBPACK_IMPORTED_MODULE_0__.default)(\"Walk Frankie\", Date.now());\n\n    // console.log(task1.getDueDate());\n    // task1.setDueDate(Date.now());\n    // console.log(format(task1.getDueDate(), \"E, MMMM do\"));\n    // task1.setDueDate(false);\n    // console.log(task1.getDueDate());\n    \n    // console.log(task1.isCompleted());\n    // task1.setCompletedAs(true);\n    // console.log(task1.isCompleted());\n\n    // console.log(task1.getName());\n    // task1.setName(\"Feed Frankie\");\n    // console.log(task1.getName());\n\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initPage);\n\n//# sourceURL=webpack://to-do-list/./src/modules/init-page.js?");

/***/ }),

/***/ "./src/modules/task.js":
/*!*****************************!*\
  !*** ./src/modules/task.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst taskFactory = function (_name, _dateAdded) {\n\n    let _completed = false;\n    let _starred = false;\n    let _dueDate = false;\n    let _notes = \"\"\n\n    const getName = function () {\n        return _name;\n    }\n    const setName = function (name) {\n        _name = name;\n    }\n    const getDateAdded = function () {\n        return _dateAdded;\n    }\n    const isCompleted = function () {\n        return _completed;\n    }\n    const setCompletedAs = function (completed) {\n        _completed = completed;\n    }\n    const isStarred = function () {\n        return _starred;\n    }\n    const setStarredAs = function (starred) {\n        _starred = starred;\n    }\n    const getDueDate = function () {\n        return _dueDate;\n    }\n    const setDueDate = function (dueDate) {\n        _dueDate = dueDate;\n    }\n    const getNotes = function () {\n        return _notes;\n    }\n    const setNotes = function (notes) {\n        _notes = notes;\n    }\n\n    return {\n        getName,\n        setName,\n        getDateAdded,\n        isCompleted,\n        setCompletedAs,\n        isStarred,\n        setStarredAs,\n        getDueDate,\n        setDueDate,\n        getNotes,\n        setNotes,\n    };\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (taskFactory);\n\n//# sourceURL=webpack://to-do-list/./src/modules/task.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
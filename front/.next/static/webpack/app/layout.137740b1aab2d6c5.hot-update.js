"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-client)/./component/Navbar.tsx":
/*!******************************!*\
  !*** ./component/Navbar.tsx ***!
  \******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-client)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/style/Navbar.module.css */ \"(app-client)/./style/Navbar.module.css\");\n/* harmony import */ var _style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-client)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _UserContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserContext */ \"(app-client)/./component/UserContext.tsx\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/link */ \"(app-client)/./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/navigation */ \"(app-client)/./node_modules/next/navigation.js\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/image */ \"(app-client)/./node_modules/next/image.js\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _public_user_webp__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/public/user.webp */ \"(app-client)/./public/user.webp\");\n/* harmony import */ var _public_left_arrow_webp__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/public/left-arrow.webp */ \"(app-client)/./public/left-arrow.webp\");\n/* harmony import */ var _util_lib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/util/lib */ \"(app-client)/./util/lib.ts\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\n\nconst Navbar = ()=>{\n    _s();\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    const sideBarRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    const [user, onUserChange] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_UserContext__WEBPACK_IMPORTED_MODULE_2__.userContext);\n    const [notif, setNotif] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    console.log(user);\n    const onCloseSideBar = ()=>{\n        var _sideBarRef_current;\n        (_sideBarRef_current = sideBarRef.current) === null || _sideBarRef_current === void 0 ? void 0 : _sideBarRef_current.close();\n    };\n    const onOpenSideBar = ()=>{\n        var _sideBarRef_current;\n        (_sideBarRef_current = sideBarRef.current) === null || _sideBarRef_current === void 0 ? void 0 : _sideBarRef_current.showModal();\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const dialog = sideBarRef.current;\n        if (dialog) (0,_util_lib__WEBPACK_IMPORTED_MODULE_8__.closeDialogOnBackdropClick)(dialog);\n    }, []);\n    const onLogOff = ()=>{\n        onUserChange({\n            user_id: \"\",\n            user_name: \"\"\n        });\n        document.cookie = \"id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;\";\n        document.cookie = \"lastname=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;\";\n        document.cookie = \"auth-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;\";\n        router.push(\"/\");\n        onCloseSideBar();\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n        className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {\n                href: \"/\",\n                children: \"Home\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                lineNumber: 43,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_navigation),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: ()=>setNotif(true),\n                        children: \"Notifif\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 45,\n                        columnNumber: 17\n                    }, undefined),\n                    user.user_id !== \"\" ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn),\n                        onClick: onOpenSideBar,\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {\n                            src: _public_user_webp__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n                            alt: \"user\",\n                            className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn_icon)\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                            lineNumber: 48,\n                            columnNumber: 25\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 47,\n                        columnNumber: 21\n                    }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {\n                        href: \"/sign\",\n                        children: \"Connexion\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 50,\n                        columnNumber: 21\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                lineNumber: 44,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"dialog\", {\n                ref: sideBarRef,\n                className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn_content),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn_content_user),\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {\n                                src: _public_user_webp__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n                                alt: \"user photo\",\n                                className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn_content_user_photo)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                                lineNumber: 55,\n                                columnNumber: 21\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                                className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn_content_user_name),\n                                children: [\n                                    user.user_name,\n                                    \" \"\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                                lineNumber: 56,\n                                columnNumber: 21\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 54,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        type: \"button\",\n                        onClick: onLogOff,\n                        children: \"Log Off\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 58,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {\n                        href: \"/shift\",\n                        className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn_content_link),\n                        onClick: onCloseSideBar,\n                        children: \"Planning\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 59,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {\n                        href: \"/profile\",\n                        className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_logBtn_content_link),\n                        onClick: onCloseSideBar,\n                        children: \"Profile\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 60,\n                        columnNumber: 17\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                lineNumber: 53,\n                columnNumber: 13\n            }, undefined),\n            notif && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_notifPopup),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        type: \"button\",\n                        onClick: ()=>setNotif(false),\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {\n                            src: _public_left_arrow_webp__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n                            alt: \"close\",\n                            className: (_style_Navbar_module_css__WEBPACK_IMPORTED_MODULE_9___default().navbar_notifPopup_closeBtn)\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                            lineNumber: 63,\n                            columnNumber: 69\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 63,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                        children: \"Notification\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 64,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                children: \"Il y a 3 jours\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                                lineNumber: 66,\n                                columnNumber: 21\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                children: \"Votre planning a chang\\xe9\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                                lineNumber: 67,\n                                columnNumber: 21\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 65,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                children: \"Il y a 3 jours\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                                lineNumber: 70,\n                                columnNumber: 21\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                children: \"Vous avez recu une nouvelle fiche de paie\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                                lineNumber: 71,\n                                columnNumber: 21\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                        lineNumber: 69,\n                        columnNumber: 17\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n                lineNumber: 62,\n                columnNumber: 23\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\moise\\\\Projects\\\\work\\\\front\\\\component\\\\Navbar.tsx\",\n        lineNumber: 42,\n        columnNumber: 9\n    }, undefined);\n};\n_s(Navbar, \"p8SIP9WaC/L1edGqkWF3QGzK+dE=\", false, function() {\n    return [\n        next_navigation__WEBPACK_IMPORTED_MODULE_4__.useRouter\n    ];\n});\n_c = Navbar;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Navbar);\nvar _c;\n$RefreshReg$(_c, \"Navbar\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztrQ0FDSiw4REFBQ2xCOzswQ0FDRyw4REFBQ21COzBDQUFFOzs7Ozs7MENBQ0gsOERBQUNBOzBDQUFFOzs7Ozs7Ozs7Ozs7a0NBRVAsOERBQUNuQjs7MENBQ0csOERBQUNtQjswQ0FBRTs7Ozs7OzBDQUNILDhEQUFDQTswQ0FBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS3ZCO0dBOURNNUM7O1FBQ2FMLHNEQUFTQTs7O0tBRHRCSztBQWdFTiwrREFBZUEsTUFBTUEsRUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnQvTmF2YmFyLnRzeD9hZTZiIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiXHJcbmltcG9ydCBzdHlsZSBmcm9tIFwiQC9zdHlsZS9OYXZiYXIubW9kdWxlLmNzc1wiXHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiXHJcbmltcG9ydCB7IHVzZXJDb250ZXh0IH0gZnJvbSBcIi4vVXNlckNvbnRleHRcIlxyXG5cclxuaW1wb3J0IExpbmsgZnJvbSBcIm5leHQvbGlua1wiXHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIlxyXG5pbXBvcnQgSW1hZ2UgZnJvbSBcIm5leHQvaW1hZ2VcIlxyXG5cclxuaW1wb3J0IFVzZXIgZnJvbSBcIkAvcHVibGljL3VzZXIud2VicFwiXHJcbmltcG9ydCBMZWZ0QXJyb3cgZnJvbSBcIkAvcHVibGljL2xlZnQtYXJyb3cud2VicFwiXHJcbmltcG9ydCB7IGNsb3NlRGlhbG9nT25CYWNrZHJvcENsaWNrIH0gZnJvbSBcIkAvdXRpbC9saWJcIlxyXG5cclxuY29uc3QgTmF2YmFyID0gKCk9PntcclxuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXHJcbiAgICBjb25zdCBzaWRlQmFyUmVmID0gdXNlUmVmPEhUTUxEaWFsb2dFbGVtZW50PihudWxsKVxyXG4gICAgY29uc3QgW3VzZXIsIG9uVXNlckNoYW5nZV0gPSB1c2VDb250ZXh0KHVzZXJDb250ZXh0KVxyXG4gICAgY29uc3QgW25vdGlmLCBzZXROb3RpZl0gPSB1c2VTdGF0ZShmYWxzZSlcclxuICAgIGNvbnNvbGUubG9nKHVzZXIpXHJcbiAgICBjb25zdCBvbkNsb3NlU2lkZUJhciA9ICgpPT57XHJcbiAgICAgICAgc2lkZUJhclJlZi5jdXJyZW50Py5jbG9zZSgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb25PcGVuU2lkZUJhciA9ICgpPT57XHJcbiAgICAgICAgc2lkZUJhclJlZi5jdXJyZW50Py5zaG93TW9kYWwoKVxyXG4gICAgfVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IHNpZGVCYXJSZWYuY3VycmVudFxyXG4gICAgICAgIGlmIChkaWFsb2cpIGNsb3NlRGlhbG9nT25CYWNrZHJvcENsaWNrKGRpYWxvZylcclxuICAgIH0sW10pXHJcblxyXG4gICAgY29uc3Qgb25Mb2dPZmYgPSAoKT0+e1xyXG4gICAgICAgIG9uVXNlckNoYW5nZSh7dXNlcl9pZDogXCJcIiwgdXNlcl9uYW1lOiBcIlwifSlcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBcImlkPTtleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgVVRDOyBwYXRoPS87XCJcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBcImxhc3RuYW1lPTtleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgVVRDOyBwYXRoPS87XCJcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBcImF1dGgtdG9rZW49O2V4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBVVEM7IHBhdGg9LztcIlxyXG4gICAgICAgIHJvdXRlci5wdXNoKFwiL1wiKVxyXG4gICAgICAgIG9uQ2xvc2VTaWRlQmFyKClcclxuICAgIH1cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPG5hdiBjbGFzc05hbWU9e3N0eWxlLm5hdmJhcn0+XHJcbiAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvXCI+SG9tZTwvTGluaz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlLm5hdmJhcl9uYXZpZ2F0aW9ufT5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCk9PnNldE5vdGlmKHRydWUpfT5Ob3RpZmlmPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICB7dXNlci51c2VyX2lkICE9PSBcIlwiID8gXHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e3N0eWxlLm5hdmJhcl9sb2dCdG59IG9uQ2xpY2s9e29uT3BlblNpZGVCYXJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2Ugc3JjPXtVc2VyfSBhbHQ9XCJ1c2VyXCIgY2xhc3NOYW1lPXtzdHlsZS5uYXZiYXJfbG9nQnRuX2ljb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+IDogXHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmsgaHJlZj1cIi9zaWduXCI+Q29ubmV4aW9uPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpYWxvZyByZWY9e3NpZGVCYXJSZWZ9IGNsYXNzTmFtZT17c3R5bGUubmF2YmFyX2xvZ0J0bl9jb250ZW50fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZS5uYXZiYXJfbG9nQnRuX2NvbnRlbnRfdXNlcn0+XHJcbiAgICAgICAgICAgICAgICAgICAgPEltYWdlIHNyYz17VXNlcn0gYWx0PVwidXNlciBwaG90b1wiIGNsYXNzTmFtZT17c3R5bGUubmF2YmFyX2xvZ0J0bl9jb250ZW50X3VzZXJfcGhvdG99IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT17c3R5bGUubmF2YmFyX2xvZ0J0bl9jb250ZW50X3VzZXJfbmFtZX0+e3VzZXIudXNlcl9uYW1lfSA8L2gyPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXtvbkxvZ09mZn0+TG9nIE9mZjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPExpbmsgaHJlZj1cIi9zaGlmdFwiIGNsYXNzTmFtZT17c3R5bGUubmF2YmFyX2xvZ0J0bl9jb250ZW50X2xpbmt9IG9uQ2xpY2s9e29uQ2xvc2VTaWRlQmFyfT5QbGFubmluZzwvTGluaz5cclxuICAgICAgICAgICAgICAgIDxMaW5rIGhyZWY9e2AvcHJvZmlsZWB9IGNsYXNzTmFtZT17c3R5bGUubmF2YmFyX2xvZ0J0bl9jb250ZW50X2xpbmt9IG9uQ2xpY2s9e29uQ2xvc2VTaWRlQmFyfT5Qcm9maWxlPC9MaW5rPlxyXG4gICAgICAgICAgICA8L2RpYWxvZz5cclxuICAgICAgICAgICAge25vdGlmICYmIDxkaXYgY2xhc3NOYW1lPXtzdHlsZS5uYXZiYXJfbm90aWZQb3B1cH0+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKT0+c2V0Tm90aWYoZmFsc2UpfT48SW1hZ2Ugc3JjPXtMZWZ0QXJyb3d9IGFsdD1cImNsb3NlXCIgY2xhc3NOYW1lPXtzdHlsZS5uYXZiYXJfbm90aWZQb3B1cF9jbG9zZUJ0bn0gLz48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxoMT5Ob3RpZmljYXRpb248L2gxPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8cD5JbCB5IGEgMyBqb3VyczwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8cD5Wb3RyZSBwbGFubmluZyBhIGNoYW5nw6k8L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+SWwgeSBhIDMgam91cnM8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+Vm91cyBhdmV6IHJlY3UgdW5lIG5vdXZlbGxlIGZpY2hlIGRlIHBhaWU8L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+fVxyXG4gICAgICAgIDwvbmF2PlxyXG4gICAgKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOYXZiYXIiXSwibmFtZXMiOlsic3R5bGUiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlUmVmIiwidXNlU3RhdGUiLCJ1c2VyQ29udGV4dCIsIkxpbmsiLCJ1c2VSb3V0ZXIiLCJJbWFnZSIsIlVzZXIiLCJMZWZ0QXJyb3ciLCJjbG9zZURpYWxvZ09uQmFja2Ryb3BDbGljayIsIk5hdmJhciIsInJvdXRlciIsInNpZGVCYXJSZWYiLCJ1c2VyIiwib25Vc2VyQ2hhbmdlIiwibm90aWYiLCJzZXROb3RpZiIsImNvbnNvbGUiLCJsb2ciLCJvbkNsb3NlU2lkZUJhciIsImN1cnJlbnQiLCJjbG9zZSIsIm9uT3BlblNpZGVCYXIiLCJzaG93TW9kYWwiLCJkaWFsb2ciLCJvbkxvZ09mZiIsInVzZXJfaWQiLCJ1c2VyX25hbWUiLCJkb2N1bWVudCIsImNvb2tpZSIsInB1c2giLCJuYXYiLCJjbGFzc05hbWUiLCJuYXZiYXIiLCJocmVmIiwiZGl2IiwibmF2YmFyX25hdmlnYXRpb24iLCJidXR0b24iLCJvbkNsaWNrIiwibmF2YmFyX2xvZ0J0biIsInNyYyIsImFsdCIsIm5hdmJhcl9sb2dCdG5faWNvbiIsInJlZiIsIm5hdmJhcl9sb2dCdG5fY29udGVudCIsIm5hdmJhcl9sb2dCdG5fY29udGVudF91c2VyIiwibmF2YmFyX2xvZ0J0bl9jb250ZW50X3VzZXJfcGhvdG8iLCJoMiIsIm5hdmJhcl9sb2dCdG5fY29udGVudF91c2VyX25hbWUiLCJ0eXBlIiwibmF2YmFyX2xvZ0J0bl9jb250ZW50X2xpbmsiLCJuYXZiYXJfbm90aWZQb3B1cCIsIm5hdmJhcl9ub3RpZlBvcHVwX2Nsb3NlQnRuIiwiaDEiLCJwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-client)/./component/Navbar.tsx\n"));

/***/ })

});
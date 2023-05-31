"use strict";
(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 5493:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* reexport */ Home),
  "getStaticProps": () => (/* reexport */ getStaticProps)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./lib/post.ts
var post = __webpack_require__(8438);
;// CONCATENATED MODULE: ./src/pages/index.tsx
/* __next_internal_client_entry_do_not_use__ getStaticProps,default auto */ 

async function getStaticProps() {
    const menuArray = (0,post/* getDirStructure */.O)();
    return {
        props: {
            menuArray
        }
    };
}
function Home({ menuArray  }) {
    return /*#__PURE__*/ jsx_runtime.jsx("div", {
        children: "Hello"
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader.js?page=%2F&absolutePagePath=private-next-pages%2Findex.tsx&preferredRegion=!

        // Next.js Route Loader
        
        
    

/***/ }),

/***/ 1320:
/***/ ((module) => {

module.exports = require("dompurify");

/***/ }),

/***/ 8076:
/***/ ((module) => {

module.exports = require("gray-matter");

/***/ }),

/***/ 2145:
/***/ ((module) => {

module.exports = require("highlight.js/lib/core");

/***/ }),

/***/ 7985:
/***/ ((module) => {

module.exports = require("highlight.js/lib/languages/javascript");

/***/ }),

/***/ 8860:
/***/ ((module) => {

module.exports = require("jsdom");

/***/ }),

/***/ 9653:
/***/ ((module) => {

module.exports = require("markdown-it");

/***/ }),

/***/ 846:
/***/ ((module) => {

module.exports = require("markdown-it-highlightjs");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 4300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [893,438], () => (__webpack_exec__(5493)));
module.exports = __webpack_exports__;

})();
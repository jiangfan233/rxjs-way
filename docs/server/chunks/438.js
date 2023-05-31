"use strict";
exports.id = 438;
exports.ids = [438];
exports.modules = {

/***/ 8438:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ getFileContent),
/* harmony export */   "O": () => (/* binding */ getDirStructure)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8076);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gray_matter__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4300);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(buffer__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var jsdom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8860);
/* harmony import */ var jsdom__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jsdom__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1320);
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_5__);






const hljs = __webpack_require__(2145);
hljs.registerLanguage("javascript", __webpack_require__(7985));
const md = __webpack_require__(9653)({
    html: true,
    xhtmlOut: false,
    // This is only for full CommonMark compatibility.
    breaks: true,
    langPrefix: "language-",
    // useful for external highlighters.
    linkify: false,
    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’"
}).use(__webpack_require__(846), {
    hljs
});
const window = new jsdom__WEBPACK_IMPORTED_MODULE_4__.JSDOM("").window;
const DOMPurify = dompurify__WEBPACK_IMPORTED_MODULE_5___default()(window);
// 递归获取目录解构
function getDirStructure(dirPath = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "posts")) {
    const res = fs__WEBPACK_IMPORTED_MODULE_2___default().readdirSync(dirPath).map((file)=>{
        const filePath = path__WEBPACK_IMPORTED_MODULE_0___default().join(dirPath, file);
        const stat = fs__WEBPACK_IMPORTED_MODULE_2___default().lstatSync(filePath);
        const fileName = file.slice(0, file.lastIndexOf("."));
        const menu = {
            id: buffer__WEBPACK_IMPORTED_MODULE_3__.Buffer.from(filePath, "utf8").toString("base64"),
            label: stat.isDirectory() ? file : fileName,
            subMenus: stat.isDirectory() ? getDirStructure(filePath) : null
        };
        // 把文件夹的 id 修改为 文件夹下 index.md 的 id
        if (stat.isDirectory()) {
            const { subMenus  } = menu;
            const ind = subMenus?.find((item)=>item.label.includes("index"));
            if (ind) menu.id = ind.id;
        }
        return menu;
    });
    return res;
}
// 根据文件路径获取并解析markdown文件内容
const getFileContent = (filePath)=>{
    const fPath = buffer__WEBPACK_IMPORTED_MODULE_3__.Buffer.from(filePath, "base64").toString("utf8");
    if (!fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(fPath)) {
        return null;
    }
    const fileContent = fs__WEBPACK_IMPORTED_MODULE_2___default().readFileSync(fPath, "utf-8");
    const matterResult = gray_matter__WEBPACK_IMPORTED_MODULE_1___default()(fileContent);
    const content = DOMPurify.sanitize(md.render(matterResult.content));
    return {
        ...matterResult.data,
        content
    };
};


/***/ })

};
;
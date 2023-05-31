(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 3407:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* reexport */ _app)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: ./src/app/components/clientOnly.tsx


const ClientOnly = ({ children  })=>{
    return /*#__PURE__*/ jsx_runtime.jsx(jsx_runtime.Fragment, {
        children: children ? children : null
    });
};

;// CONCATENATED MODULE: external "react-icons/ai"
const ai_namespaceObject = require("react-icons/ai");
;// CONCATENATED MODULE: ./src/app/components/layout/header.tsx



const Header = /*#__PURE__*/ external_react_default().memo(()=>{
    return /*#__PURE__*/ jsx_runtime.jsx(jsx_runtime.Fragment, {
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "w-full flex gap-4 items-center justify-center relative h-8",
            children: [
                /*#__PURE__*/ jsx_runtime.jsx("h2", {
                    className: "font-bold text-3xl",
                    children: "The Rxjs Way"
                }),
                /*#__PURE__*/ jsx_runtime.jsx("a", {
                    href: "https://github.com/jiangfan233/learn-rxjs",
                    target: "_blank",
                    children: /*#__PURE__*/ jsx_runtime.jsx(ai_namespaceObject.AiOutlineGithub, {
                        size: "2rem"
                    })
                })
            ]
        })
    });
});
// set display name
Header.displayName = "Header";

// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./src/app/components/layout/sider.tsx




const MenuItem = ({ label , id: path , subMenus  })=>/*#__PURE__*/ jsx_runtime.jsx(jsx_runtime.Fragment, {
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
            className: "mx-4",
            children: [
                /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                    href: path,
                    children: label
                }),
                subMenus ? /*#__PURE__*/ jsx_runtime.jsx("ol", {
                    className: "list-disc",
                    children: subMenus.map(({ label: childLabel , id: childPath , subMenus: childChildren  })=>/*#__PURE__*/ jsx_runtime.jsx(MenuItem, {
                            label: childLabel,
                            id: childPath,
                            subMenus: childChildren
                        }, path + childLabel))
                }) : null
            ]
        })
    });
const Sider = ({ menuArray  })=>{
    const [isShowMenu, toggleMenu] = (0,external_react_.useState)(false);
    return /*#__PURE__*/ jsx_runtime.jsx("div", {
        className: (isShowMenu ? "fixed min-w-4/5 z-10 bg-slate-300 xs:relative xs:min-w-1/4 xs:max-w-xs" : "") + " z-10 flex items-start justify-start",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "relative w-full",
            children: [
                /*#__PURE__*/ jsx_runtime.jsx("ol", {
                    className: (isShowMenu ? "" : "w-0 -z-10 invisible") + " relative list-disc xs:min-w-1/4 py-1 h-[96vh]",
                    children: menuArray && menuArray.map(({ label , id , subMenus  })=>/*#__PURE__*/ jsx_runtime.jsx(MenuItem, {
                            label: label,
                            id: id,
                            subMenus: subMenus
                        }, id + label))
                }),
                /*#__PURE__*/ jsx_runtime.jsx(ai_namespaceObject.AiOutlineBars, {
                    className: "absolute top-0 left-full cursor-pointer z-10 h-8 ml-4",
                    onClick: ()=>toggleMenu(!isShowMenu)
                })
            ]
        })
    });
};

;// CONCATENATED MODULE: ./src/app/components/layout/index.tsx
/* __next_internal_client_entry_do_not_use__ Layout auto */ 


const Layout = ({ children , menuArray  })=>{
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: " flex items-start justify-start p-1 overflow-y-hidden w-full xs:p-2 ",
        children: [
            /*#__PURE__*/ jsx_runtime.jsx(Sider, {
                menuArray: menuArray
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: " w-full flex-col  items-center  justify-start ",
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx(Header, {}),
                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                        className: "p-4 w-full flex flex-col items-center",
                        children: children
                    })
                ]
            })
        ]
    });
};

;// CONCATENATED MODULE: external "next/head"
const head_namespaceObject = require("next/head");
var head_default = /*#__PURE__*/__webpack_require__.n(head_namespaceObject);
// EXTERNAL MODULE: ./src/app/globals.css
var globals = __webpack_require__(4542);
// EXTERNAL MODULE: ./node_modules/github-markdown-css/github-markdown-light.css
var github_markdown_light = __webpack_require__(3374);
// EXTERNAL MODULE: ./node_modules/highlight.js/styles/github.css
var github = __webpack_require__(5062);
;// CONCATENATED MODULE: ./src/pages/_app.tsx
// import App from 'next/app'








function MyApp({ Component , pageProps  }) {
    const { menuArray  } = pageProps;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime.jsx((head_default()), {}),
            /*#__PURE__*/ jsx_runtime.jsx(ClientOnly, {
                children: /*#__PURE__*/ jsx_runtime.jsx(Layout, {
                    menuArray: menuArray,
                    children: /*#__PURE__*/ jsx_runtime.jsx(Component, {
                        ...pageProps
                    })
                })
            })
        ]
    });
}
// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }
/* harmony default export */ const _app = (MyApp);

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader.js?page=%2F_app&absolutePagePath=private-next-pages%2F_app.tsx&preferredRegion=!

        // Next.js Route Loader
        
        
    

/***/ }),

/***/ 4542:
/***/ (() => {



/***/ }),

/***/ 3280:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 1109:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-local-url.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 7782:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/resolve-href.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [893,117], () => (__webpack_exec__(3407)));
module.exports = __webpack_exports__;

})();
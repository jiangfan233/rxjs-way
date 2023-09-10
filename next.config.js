const path = require("path");
var WebpackObfuscator = require("webpack-obfuscator");

// const repo = "https://jiangfan233.github.io/rxjs-way";
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const isProd = process.env.NODE_ENV === "production";

if (isGithubActions) {
  // 去掉 `<owner>/`
  console.log("GITHUB_REPOSITORY: ", process.env.GITHUB_REPOSITORY);
}

/** @type {import('next').NextConfig} */
module.exports = (...rest) => {
  return {
    // experimental: {
    //   serverActions: true,
    // },
    // distDir: "docs",
    reactStrictMode: false,
    output: process.env.NEXT_PUBLIC_OUTPUT || undefined,
    compiler: {
      removeConsole: isProd,
    },
    cleanDistDir: true,
    swcMinify: true,
    env: {},
    webpack: (
      config,
      { buildId, dev: isDev, isServer, defaultLoaders, nextRuntime, webpack },
    ) => {
      if (!isDev) {
        config.plugins.push(
          new WebpackObfuscator(
            {
              compact: true,
              controlFlowFlattening: false,

              // 对打包速度影响较大
              deadCodeInjection: false,
              deadCodeInjectionThreshold: 0.4,

              debugProtection: true,
              debugProtectionInterval: 0,

              disableConsoleOutput: true,
              identifierNamesGenerator: "hexadecimal",
              log: false,
              numbersToExpressions: false,
              renameGlobals: true,
              selfDefending: true,
              simplify: true,
              splitStrings: false,
              stringArray: true,
              stringArrayCallsTransform: false,
              stringArrayCallsTransformThreshold: 0.5,
              stringArrayEncoding: [],
              stringArrayIndexShift: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayWrappersCount: 1,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersParametersMaxCount: 2,
              stringArrayWrappersType: "variable",
              stringArrayThreshold: 0.75,
              unicodeEscapeSequence: false,
            },
            [
              path.join(__dirname, "node_modules"),
              path.join(__dirname, "tests"),
              path.join(__dirname, "public/sw.js"),
              path.join(__dirname, "next.config.js"),
              path.join(__dirname, ".prettierrc.js"),
              path.join(__dirname, "postcss.config.js"),
              path.join(__dirname, "tailwind.config.js"),
              path.join(__dirname, "jest.config.js"),
            ],
          ),
        );
      }

      return config;
    },
  };
};

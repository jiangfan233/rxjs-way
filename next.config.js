const path = require("path");

// const repo = "https://jiangfan233.github.io/rxjs-way";
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const isProd = process.env.NODE_ENV === "production";



if (isGithubActions) {
  // 去掉 `<owner>/`
  console.log("GITHUB_REPOSITORY: ", process.env.GITHUB_REPOSITORY);
}

/** @type {import('next').NextConfig} */
module.exports = (...rest) => {
  // console.log(rest);
  return {
    // experimental: {
    //   serverActions: true,
    // },
    // distDir: "docs",
    reactStrictMode: false,
    // output: "standalone",
    compiler: {
      removeConsole: isProd,
    },
    cleanDistDir: true,
    swcMinify: true,
  };
};

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
      { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
    ) => {
      return config;
    },
  };
};

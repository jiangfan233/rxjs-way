/** @type {import('next').NextConfig} */

// const repo = "https://jiangfan233.github.io/rxjs-way";
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const isProd = process.env.NODE_ENV === "production";

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
  // 去掉 `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

  assetPrefix = `/${repo}/`;
  basePath = `/${repo}/`;
}

const nextConfig = {
  distDir: "docs",
  reactStrictMode: false,
  output: isProd ? "export" : "standalone",
  assetPrefix: assetPrefix,
  basePath: basePath,
};

module.exports = nextConfig;

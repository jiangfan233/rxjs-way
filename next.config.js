/** @type {import('next').NextConfig} */

// const repo = "https://jiangfan233.github.io/rxjs-way";
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const isProd = process.env.NODE_ENV === "production";


if (isGithubActions) {
  // 去掉 `<owner>/`
  console.log("GITHUB_REPOSITORY: ", process.env.GITHUB_REPOSITORY);
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}/`;
}

const nextConfig = {
  distDir: "docs",
  reactStrictMode: false,
  output: isProd ? "export" : "standalone",
};

module.exports = nextConfig;

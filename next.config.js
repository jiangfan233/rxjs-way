/** @type {import('next').NextConfig} */

// const repo = "https://jiangfan233.github.io/rxjs-way";
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const isProd = process.env.NODE_ENV === "production";


if (isGithubActions) {
  // 去掉 `<owner>/`
  console.log("GITHUB_REPOSITORY: ", process.env.GITHUB_REPOSITORY);
}


module.exports = {
  distDir: "docs",
  reactStrictMode: false,
  output: isProd ? "export" : "standalone",
  compiler: {
    removeConsole: isProd
  }
};

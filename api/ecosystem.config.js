module.exports = {
  apps: [
    {
      name: "fpd-api",
      script: "dist/index.js",
      watch: false,
      node_args: ["-r", "dotenv/config"],
    },
  ],
};

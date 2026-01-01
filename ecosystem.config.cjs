module.exports = {
  apps: [
    {
      name: "Master WB2",
      script: "npm",
      args: ["run", "preview", "--", "--port", "8090", "--host"],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

module.exports = {
  apps : [
      {
        name: "hlbank",
        script: "./dist/main.js",
        instances : "max",
        exec_mode : "cluster",
        watch: true,
        env: {
          "REST_USES_6_QUEUES": "true",
        }
      }
  ]
}
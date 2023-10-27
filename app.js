require('dotenv').config();
const {
  userManagementBackendApp,
  httpServer
} = require("./helper/common/init_socket.io")
require('./helper/common/init_mongodb');
require('./helper/common/init_redis');
const bodyParser = require('body-parser');

userManagementBackendApp.use(bodyParser.json());

const { v1 } = require("./helper/common/route_versions/v1");

userManagementBackendApp.use('/v1', v1)

userManagementBackendApp.use(async (req, _res, next) => {
  console.log(req, _res);
  next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
userManagementBackendApp.use((error, req, res, next) => {
  const responseStatus = error.status || 500;
  const responseMessage =
    error.message || `Cannot resolve request [${req.method}] ${req.url}`;
  if (res.headersSent === false) {
    res.status(responseStatus);
    res.send({
      error: {
        status: responseStatus,
        message: responseMessage,
      },
    });
  }
  next();
});

const port = process.env.APP_PORT || 3500

httpServer.listen(port, () => {
  console.log(`Application is running on: ${port}`);
})


process.on("SIGINT", () => {
  setTimeout(() => {
    console.error("Application terminated successfully.");
    process.exit(0);
  }, 500);
});

process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception Occured\n${error}`);
});
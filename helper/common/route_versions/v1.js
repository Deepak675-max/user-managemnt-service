const express = require("express");
const v1 = express.Router();

const { userRouter } = require('../../../routes/user.route');
v1.use('/user', userRouter);

module.exports = {
  v1
};

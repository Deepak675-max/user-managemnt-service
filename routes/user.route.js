const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const jwtModule = require("../middlewares/jwt/jwt.middleware");

userRouter.get('/get-users', jwtModule.verifyAccessToken, userController.getUsers);
userRouter.get('/get-vendors', jwtModule.verifyAccessToken, userController.getVendors);
userRouter.delete('/delete-user', jwtModule.verifyAccessToken, userController.deleteUser);


module.exports = { userRouter };
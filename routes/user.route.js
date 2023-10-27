const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const jwtModule = require("../middlewares/jwt/jwt.middleware");

userRouter.post('/create-user', userController.createUser);
userRouter.post('/login-user', userController.loginUser);
userRouter.get('/get-users', jwtModule.verifyAccessToken, userController.getUsers);
userRouter.delete('/delete-user', jwtModule.verifyAccessToken, userController.deleteUser);


module.exports = { userRouter };
const httpErrors = require("http-errors");
const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwtModule = require("../middlewares/jwt/jwt.middleware")

const createUser = async (req, res, next) => {
    try {
        const userDetails = req.body;
        console.log(req.body);
        const doesUserExist = await userModel.findOne({
            email: userDetails.email,
            isDeleted: false,
        });

        if (doesUserExist) throw httpErrors.Conflict(`User with email: ${userDetails.email} already exist.`);

        userDetails.password = await bcrypt.hash(userDetails.password, 10);

        const newUser = new userModel(userDetails);

        const savedUserDetails = await newUser.save();

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "User created successfully."
                }
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}


const getUsers = async (req, res, next) => {
    try {
        const users = await userModel.find({
            isDeleted: false,
        })

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    users: users,
                    message: "User fetched successfully."
                }
            })
        }
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const queryDetails = req.body;

        console.log(queryDetails);
        const user = await userModel.findOne({
            _id: queryDetails.userId,
            isDeleted: false,
        });

        if (!user) throw httpErrors.NotFound('Invalid user id');

        await userModel.updateOne(
            {
                _id: queryDetails.userId,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true
                }
            },
        );

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "User deleted successfully."
                }
            })
        }


    } catch (error) {
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const userDetails = req.body

        const doesUserExist = await userModel.findOne({
            email: userDetails.email,
            isDeleted: false
        })

        if (!doesUserExist) throw httpErrors[400]("Invalid email or password.");

        const isPasswordMatch = await bcrypt.compare(userDetails.password, doesUserExist.password);

        if (!isPasswordMatch)
            throw httpErrors.NotFound('invalid credentials.');

        const jwtAccessToken = await jwtModule.signAccessToken({
            userId: doesUserExist._id,
            email: doesUserExist.email
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    user: {
                        userId: doesUserExist._id,
                        userName: doesUserExist.name,
                        email: doesUserExist.email
                    },
                    token: jwtAccessToken,
                    message: "User login successfully",
                },
            });
        }

    } catch (error) {

    }
}

const logoutUser = async (req, res, next) => {
    try {
        // Check if Payload contains appAgentId
        if (!req.user._id) {
            throw httpErrors.UnprocessableEntity(
                `JWT Refresh Token error : Missing Payload Data`
            );
        }
        // Delete Refresh Token from Redis DB
        await jwtModule
            .removeToken({
                userId: req.user._id,
            })
            .catch((error) => {
                throw httpErrors.InternalServerError(
                    `JWT Access Token error : ${error.message}`
                );
            });

        res.status(200).send({
            error: false,
            data: {
                message: "User logged out successfully.",
            },
        });
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createUser,
    getUsers,
    deleteUser,
    loginUser,
    logoutUser
}
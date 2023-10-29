const httpErrors = require("http-errors");
const { userModel } = require("../models/user.model");
const { vendorModel } = require("../models/vendor.model");

const joiUser = require("../helper/joi/user.validation_schema");

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

const getVendors = async (req, res, next) => {
    try {
        const vendors = await vendorModel.find({
            isDeleted: false,
        })

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    vendors: vendors,
                    message: "Vendor fetched successfully."
                }
            })
        }
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const queryDetails = await joiUser.deleteUserSchema.validateAsync(req.body);

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

module.exports = {
    getUsers,
    deleteUser,
    getVendors
}
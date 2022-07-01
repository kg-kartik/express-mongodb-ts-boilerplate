import { Request, Response, NextFunction } from "express";
import ApiResponse from "../Types/ApiResponse";
import UsersModel from "../models/Users";
import Users from "../Types/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/ErrorResponse";
import RequestWithUser from "src/Types/RequestWithUser";

export const signup = (req: Request, res: Response, next: NextFunction) => {
    const userDetails = req.body;
    const secret = process.env.JWT_SECRET;

    UsersModel.findOne({
        email: req.body.email
    })
        .then((existingUser) => {
            if (existingUser) {
                return next(new ErrorResponse("User already exists", 400));
            }
            bcrypt.hash(req.body.password, 10).then((hashedPass) => {
                const newUser = new UsersModel({
                    ...userDetails,
                    password: hashedPass
                });

                const token = jwt.sign(
                    {
                        email: userDetails.email
                    },
                    secret
                );

                newUser
                    .save()
                    .then((user) => {
                        const response: ApiResponse = {
                            data: {
                                user,
                                token
                            },
                            status: 200,
                            success: true,
                            message: "User successfully registered"
                        };

                        return res.status(200).json(response);
                    })
                    .catch(next);
            });
        })
        .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    console.log(email);

    const secret = process.env.JWT_SECRET;

    UsersModel.findOne({
        email
    })
        .then((user: Users) => {
            if (user) {
                const token = jwt.sign(
                    {
                        email: user.email
                    },
                    secret
                );

                bcrypt.compare(password, user.password).then((isMatch) => {
                    if (isMatch) {
                        const response: ApiResponse = {
                            success: true,
                            status: 200,
                            message: "User successfully logged in",
                            data: {
                                user,
                                token
                            }
                        };

                        res.status(200).json(response);
                    } else {
                        return next(new ErrorResponse("Sorry Incorrect Password/Email", 400));
                    }
                });
            } else {
                return next(new ErrorResponse("User with email address doesnt exist", 400));
            }
        })
        .catch(next);
};

export const changePassword = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { newPassword, currentPassword } = req.body;

    UsersModel.findOneAndUpdate({
        _id: req.user._id
    }).then((user) => {
        bcrypt.compare(currentPassword, user.password).then((isMatch) => {
            if (!isMatch) {
                return next(new ErrorResponse("Sorry,Incorrect Current Password", 400));
            }
            bcrypt.hash(newPassword, 10).then((hashedPass) => {
                UsersModel.updateOne(
                    {
                        _id: req.user._id
                    },
                    {
                        $set: {
                            password: hashedPass
                        }
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                )
                    .then((updatedUser) => {
                        const response: ApiResponse = {
                            data: updatedUser,
                            success: true,
                            message: "Password updated",
                            status: 200
                        };

                        res.status(200).json(response);
                    })
                    .catch(next);
            });
        });
    });
};

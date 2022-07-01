import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import RequestWithUser from "../Types/RequestWithUser";
import UsersModel from "../models/Users";
import Users from "../Types/Users";

require("dotenv").config();

const secret = process.env.JWT_SECRET;
interface JwtPayload {
    email: String;
}

export const requireLogin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: "no headers provided"
        });
    }
    //Get the token from Bearer "token"
    const token = authorization.replace("Bearer ", "");

    const { email } = jwt.verify(token, secret) as JwtPayload;

    try {
        req.user = (await UsersModel.findOne({
            email
        })) as Users;
    } catch (e) {
        console.log(e, "err");
    }

    next();
};

import jwt from "jsonwebtoken";
import {Response,NextFunction} from "express"
import RequestWithUser from "../Types/RequestWithUser";
import UsersModel from "../models/Users";
import Users from "../Types/Users";
import ErrorResponse from "../utils/ErrorResponse";

require("dotenv").config();

const secret = process.env.JWT_SECRET;
interface JwtPayload{
    email:String
}

export const requireLogin =  async (req:RequestWithUser, res:Response, next:NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            error: "no headers provided"
        });
    }
    //Get the token from Bearer "token"
    const token = authorization.replace("Bearer ", "");

    console.log(token,"token");

    const payload= await jwt.verify(token, secret) as JwtPayload;

    console.log(payload,"email");

    if(payload){

        const {email} = payload;

        req.user = (await UsersModel.findOne({
            email
        })) as Users;
        next();
    }
    else{
        return next(new ErrorResponse("You must be logged in",401));
    }
    
};

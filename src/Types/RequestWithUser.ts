import { Request } from "express";
import User from "./Users";

interface RequestWithUser extends Request {
    user: User;
}

export default RequestWithUser;

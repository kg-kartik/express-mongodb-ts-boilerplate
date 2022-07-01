import { Schema, model, Types } from "mongoose";
import Users from "../Types/Users";

const { ObjectId } = Types;

const usersSchema = new Schema<Users>({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});

const UsersModel = model<Users>("Users", usersSchema);
export default UsersModel;

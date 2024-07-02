//model of user monoose

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    monthlyBilling: {
        type: Boolean,
        required: true,
        default: false
    },
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;

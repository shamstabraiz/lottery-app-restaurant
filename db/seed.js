import mongoose from "mongoose";
import User from "../src/Models/user.js";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.error("Error connecting to the database", err);
    process.exit(1);
});


const addUsers = async () => {
    if(await User.findOne({email: "admin@admin.com"})){
        console.log("User already exists");
        return;
    }
    const hash = await bcrypt.hash("admin123", 10)
    const user = new User({
        fullName: "admin",
        email: "admin@admin.com",
        password: hash,
        role: "admin",
        phone: "1234567890",
    })
    await user.save();
    console.log("User added");
    console.log("Email:" + user.email);
    console.log("Password: admin123")
}

await addUsers();

process.exit(0);



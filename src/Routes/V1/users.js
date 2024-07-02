import express from 'express';
import User from '../../Models/user.js';
import validate from '../../Middlewares/Validate.js';
import { userLoginSchema, userSchema } from '../../Validation/user.js';
import catchAsync from '../../utils/cacheAsync.js';
import bcrypt from 'bcrypt';
import { createJwtToken, createTokenForForgetPassword, verifyToken, verifyTokenForForgetPassword } from '../../utils/jwtToken.js';
import checkAuth from '../../Middlewares/AuthUser.js';
import transfomUser from '../../Transformers/userTransformer.js';
import { sendEmail } from '../../utils/email.js';
const userRouter = express.Router();

userRouter.get('/', checkAuth("admin"), async (req, res) => {
    let users = await User.find({});
    users = users.map(user => {
        return {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
            monthlyBilling: user.monthlyBilling
        }
    })
    res.send({ users });
})

userRouter.post('/register', validate(userSchema), catchAsync(async (req, res) => {
    let { email } = req.body;
    let password = req.body.password;
    password = await bcrypt.hash(password, 10);
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).send({ error: 'User already exists' });
    }
    const user = new User({ ...req.body, email: email.toLowerCase(), password });
    await user.save();
    const token = createJwtToken(user);
    res.send({
        token,
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
            monthlyBilling: user.monthlyBilling
        }
    });
}));

userRouter.get('/me', catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    const user = verifyToken(token);
    if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
    }
    res.send({
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
            monthlyBilling: user.monthlyBilling
        }
    });
}));

userRouter.post('/login', validate(userLoginSchema), catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(atob(password), user.password);
    if (!validPassword) {
        return res.status(400).send({ error: 'Invalid email or password' });
    }
    const token = createJwtToken(user);
    res.status(200).send({
        token,
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role
        }
    });
}));

userRouter.delete('/:id', checkAuth("admin"), catchAsync(async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.status(200).send({ message: 'User deleted successfully' });
}));


userRouter.put('/:id', checkAuth("admin"), catchAsync(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }
    const { email, password, fullName, phone, role, monthlyBilling } = req.body;

    if (!email || !fullName || !phone || !role || monthlyBilling == null || monthlyBilling == undefined) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    await User.updateOne({ _id: id }, { email, password, fullName, phone, role, monthlyBilling });
    const userUpdated = await User.findById(id);
    userUpdated.id = userUpdated._id;

    res.status(200).send({ message: 'User updated successfully', user: transfomUser(userUpdated) });
}));


userRouter.post('/forget-send-email', catchAsync(async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return res.status(404).send({
            error: "The user with this email is not found"
        })
    }
    const token = createTokenForForgetPassword(user);
    const message = `
        Hello ${user.fullName},\n
        You requested a password reset for your account.\n
        Click on the link below to reset your password.\n
        https://upwork.kowope.xyz/reset-password?token=${token}\n
        If you did not request a password reset, please ignore this email.\n
        Thanks,\n
    `
    sendEmail(user.email, "Password Reset", message);

    res.status(200).send({
        message: "Password reset link has been sent to your email"
    })

}))


userRouter.post('/reset-password', catchAsync(async (req, res) => {
    const { token, password } = req.body;
    const user = verifyTokenForForgetPassword(token);
    if (!user) {
        return res.status(400).send({
            error: "Invalid or expired token"
        })
    }
    if(user.type !== 'password-reset'){
        return res.status(400).send({
            error: "Invalid or expired token"
        })
    }

    if (password.trim().length < 6) {
        return res.status(400).send({
            error: "Password Must Be Min 6 Characters Long"
        })
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    await User.updateOne({ _id: user.id }, { password: hashedPassword });

    res.status(200).send({
        message: "Password reset successful"
    });
}))


export default userRouter;
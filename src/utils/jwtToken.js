import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'mysecretkey';

const createJwtToken = (user) => {
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
    }, secret, { expiresIn: '30d' });
    return token;
}

const createTokenForForgetPassword = (user) => {
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        type: "password-reset"
    }, secret, { expiresIn: '1h' });
    return token;
}

const verifyTokenForForgetPassword = (token) => {
    try {
        const tokenVerified = jwt.verify(token, secret);
        return tokenVerified;
    } catch (err) {
        return null;
    }
}

const verifyToken = (token) => {
    let t = token.split('Bearer ')[1];
    try {
        const tokenVerified = jwt.verify(t, secret);
        return tokenVerified;
    } catch (err) {
        return null;
    }
}

export { createJwtToken, verifyToken, createTokenForForgetPassword, verifyTokenForForgetPassword};
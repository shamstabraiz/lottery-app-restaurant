
const transfomUser = (user) => {
    return {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        monthlyBilling: user.monthlyBilling
    }
}

export default transfomUser;
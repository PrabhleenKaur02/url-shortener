
const User = require("../model/user");
const { setUser } = require('../services/auth');

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({
            email
       })

       if (!user) {
        await User.create({
            name,
            email,
            password
        });

        return res.render("home", {
            message: "User created successfully"
        });

    } else {
        return res.render("home", {
            message: "User already exists"
        });
    }

    } catch (error) {
        console.error('Signup error:', error.message);
        return res.status(500).render("home", {
             message: "Internal Server Error" 
            });
    }};


async function handleUserLogin (req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
        email,
        password
    });

    if(!user){
        return res.render("login", {
            error: "Invalid Username or Password"
        });
    }

    
    
    const token = setUser(user);
    res.cookie("token", token);

    return res.redirect("/");
}


module.exports = {
    handleUserSignup,
    handleUserLogin
};
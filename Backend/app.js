const express = require("express")
const connect = require('./config.js')
const userModel = require("./userModel.js")
const svgCaptcha = require("svg-captcha");
const session = require("express-session");
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");

let app = express()

app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(cookieParser())

const verifyJWT = (req, res, next) => {
    const token = req.cookies.token; // Retrieve token from cookies
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Verify the token
    jwt.verify(token, "jwt-secret", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }        

        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware or route
    });
};

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/captcha", (req, res) => {
    const captcha = svgCaptcha.create({
        size: 5, // Number of characters
        noise: 5, // Add noise for complexity
        color: true, // Colorful text
        background: "#f2f2f2", // Light background color
    });

    req.session.captcha = captcha.text; // Store CAPTCHA text in session
    console.log(req.session);

    res.type("svg").send(captcha.data); // Send SVG image as response
});

app.post("/verify-captcha", (req, res) => {
    const { captchaInput } = req.body;


    if (captchaInput === req.session.captcha) {
        res.json({ success: true, message: "CAPTCHA verified successfully!" });
    } else {
        res.status(400).json({ success: false, message: "Invalid CAPTCHA." });
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    let user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: "Email Or Password is incorrect" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    console.log("isMatch" , isMatch);
    

    if (!isMatch) {
        return res.status(400).json({ message: "Email Or Password is incorrect" })
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email,
        fullName: user.fullname
    }, "jwt-secret", { expiresIn: "1h" })

    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Use Secure flag in production
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: "Login successful", token });

})

app.post("/signup", async (req, res) => {
    let { fullname, email, number, city, state, password } = req.body

    let user = await userModel.findOne({ email })
    console.log(user);
    if (user) {
        return res.status(403).json({ message: "User already exists" })
    }

    const saltRounds = 10; // 10 rounds is the default
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.create({ fullname, email, number, city, state, password: hashedPassword })
    res.json({ message: "User signup successfully" })
})

app.get('/users', verifyJWT , async (req, res) => {
    let users = await userModel.find()

    res.send(users)
})

app.listen(7777)

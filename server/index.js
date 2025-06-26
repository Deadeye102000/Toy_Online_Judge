const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { DBConnection } = require("./database/db.js");
const User = require("./models/Users.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const app= express();
const PORT = process.env.PORT|| 8000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to the database

DBConnection();

app.get("/",(req,res)=>{
    res.send("Server is running...");
});

// Register User

app.post("/register", async (req, res) => {
    try{
        console.log('BODY:', req.body);
        // get all user informations
        const { firstname, lastname, email, password } = req.body;

        // check if all data is provided
        if(!firstname ||!lastname ||!email ||!password) {
            return res.status(400).json({ error: "All fields are required" });

        }
        // check if user already exists
        const userExists = await User.findOne({ email });
        if(userExists) return res.status(400).json({ error: "User already exists" });

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //save the user to the database
        const user = await User.create({ 
             firstname,
             lastname, 
             email, 
             password: hashedPassword });

        // generate a token for user 
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: "1d" });

        user.token = token;
        user.password = undefined;
        res
            .status(200)
            .json({ message: "User registered successfully", user });
            }

        catch(error){
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }

    
    });


    app.post("/login", async (req, res) => {
        try{
            // get all user informations
            const { email, password } = req.body;

            // check if all data is provided
            if(!email ||!password) {
                return res.status(400).send("All fields are required");

            }

            // find user in DataBase
            const user = await User.findOne({ email });
            if(!user) return res.status(401).send("User not found");

            // match the password
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(401).send("Incorrect password");

            // generate a token for user 
            const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: "1d" });

            user.token = token;
            user.password = undefined;
            
            // store cookie

            const options = {
                expires: new Date(Date.now() + 1*24*60*60*1000), // 24 hours
                httpOnly: true,
                
            };

            // send token

            res.status(200).cookie("token", token, options)
            .json({ message: "User logged in successfully",
                success: true,
                token,
             });

        } catch(error){
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }

    });



app.listen(PORT, () => 
   { console.log(`Server running on port ${PORT}`)
});
const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send("Welcome");
});

app.post("/register",(req,res)=>{
    console.log(req);
    try{
        // get all the data from the request body
        const{firstName, lastName, email, password} = req.body;

        
        // check all data is present and is valid
        if(!firstName || !lastName || !email || !password){
            return res.status(400).send("All fields are required");
        }

        // check if user already exists
        

        // encrypt the password
        // save the user to the database
        // generate a token for user and send it


    }catch(err){
        console.error("Error in /register:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(8000, ()=>{
    console.log("Server is listening on port 8000");

});
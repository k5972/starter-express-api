require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

// console.log('token', process.env.API_TOKEN);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    console.log("Server running on port 3000");
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us12.api.mailchimp.com/3.0/lists/4a21f6ef11";

    const options = {
        method: "POST",
        auth: "kyanako:" + process.env.API_TOKEN
    }

    const request = https.request(url, options, function(response){
        console.log(response.statusCode);
        if (response.statusCode === 200) {
            response.on("data", function(data){
                console.log(JSON.parse(data));
                res.sendFile(__dirname + "/success.html");
            });
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
       
    });

    request.write(jsonData);
    request.end();

    console.log(firstName, lastName, email);
    // res.send("Request received");
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});

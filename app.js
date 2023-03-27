const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https=require("https");
const { url } = require("inspector");
const { options } = require("request");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    var data =
    {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME:fName,
                    LNAME:lName,
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/693af77346"

    const options=
    {
        method:"POST",
        auth:"Ash_Hua:17cdf8817e11474a71180fa432821059-us21"
    }
    
    const request= https.request(url,options,(response)=>
    {
       
        response.on("data",function(data)
        {
            dataInfo=JSON.parse(data);
           console.log(dataInfo);
           console.log(response.statusCode);

           if(response.statusCode===200&&dataInfo.errors==null)
           {
               res.sendFile(__dirname+"/success.html");
           }
           else
           {
               res.sendFile(__dirname+"/failure.html");
           }
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Sever is running on port 3000");
});

//17cdf8817e11474a71180fa432821059-us21
//693af77346
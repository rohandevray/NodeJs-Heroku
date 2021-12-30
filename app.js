const express = require('express');
const bodyParser =require("body-parser");
const request =require("request");
const https =require("https");

const app =express();

app.use(express.static("public"));
// this above line of code makes the local things to run over our server
// making all the local files like css code and images and logo in one file then using the express line of code makeing
//all these things run over our server with html files...

app.use(bodyParser.urlencoded({extended:true}));
//in order to read HTTP POST data , we have to use "body-parser" node module. body-parser is a piece of express middleware
//that reads a form's input and stores it as a javascript object accessible through req.body
//body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body.

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){

  const firstName =req.body.fName;
const lastName=req.body.lName; //this way we can extract the data from html input by its name
  const mail=req.body.mail;

  // part1
  const data ={
  members:[
        {
            email_address:mail,
            status:"subscribed",
            merge_fields:{
                  FNAME:firstName,
                  LNAME:lastName,

            }
        }
  ]

};

  const jsonData =JSON.stringify(data);
  //this json Data we are going to send mailchimp
  //this is the format maichimp wants us to send data in flatpack json(string json)

  //part2

   const url ="https://us20.api.mailchimp.com/3.0/lists/b3cf54be14";

  const options ={
   method:"POST", //for posting the data to maichimp server
   auth:"rohan1:5c466b5e08a3beac6d4984abacccbe2e-us20"
  }


  const request= https.request(url,options ,function(response){

     if(response.statusCode ===200){
       res.sendFile(__dirname+"/success.html");
     } else{
       res.sendFile(__dirname+"/failure.html");
     }

          response.on("data",function(data){
            console.log(JSON.parse(data));
          });
   });




   request.write(jsonData);//way of sending our data we write in input boxes to mailchimp
   request.end();//way of ending of request

});

app.post("/failure",function(req,res){
  res.redirect("/")
});
//redirect the home route when we click the button with action failre route




app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running at 3000");
})


//api key
//5c466b5e08a3beac6d4984abacccbe2e-us20

//Unique mailchimp ID
// b3cf54be14
//List id

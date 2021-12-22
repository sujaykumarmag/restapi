
// // const express = require("express");
// // const app =express();
// // //routers imports
// // const authRoute = require("./routes/authen.js");

// // app.get("/", function(req,res){
// //     res.send("<h1>fasg</h1>");
// // });

// // //importing middlewares
// // app.use("/api/user", authRoute);

// // app.listen("4050",function(){
// //     console.log("Up and Running");
// // });

// //dependencies
// var http = require("http");
// var url = require("url"); // all the url functions
// var stringDecoder = (require("string_decoder").StringDecoder);

// //the server should respond to all requests with a  string


// function Fool(req, res){
//     //get the url and parse it
//     var parsedUrl = url.parse(req.url,true);
//     //get the path from the url 
//     console.log(req);
//     console.log(parsedUrl);
//     var path = parsedUrl.pathname
//     console.log(path);
//     var trimmedPath = path.replace(/\+|\/+$/g,"");
//     console.log(trimmedPath);
//     //Get the Query string as an object
//     var queryString = parsedUrl.query;
//     console.log(queryString);
//     console.log(url);
//     //Get the http method
//     var method = req.method;
//     console.log(method);
//     //Get the Headers as an object
//     var header = req.headers;
//     console.log(header);
//     //Get the payload if there's any
//     console.log(stringDecoder);
//     var decoder = new stringDecoder("utf-8");
//     console.log(decoder);
//     var buffer = "";
//     //but as new data comes in we append it to the variable buffer
//     req.on("data",function(datum){
//         buffer += decoder.write(datum)
//     })
//     req.on("end",function(){
//         buffer += decoder.end();
//         //Choose the handler this request should go to
//         console.log(router);
//         var choosenHandler =  typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
//         var data ={
//             'trimmedPath':trimmedPath,
//             'queryString':queryString,
//             'method':method,
//             'headers':header,
//             'payload':buffer
//         }
//         // choosenHandler(data,function(statusCode,payload){
//         //     //default status code
//         //     //use the statuscode called back by the handler, or the default to 200
//         //     statusCode = typeof(statusCode) == "number" ? statusCode : 200;
//         //     //use the payload by the handler or default to empty object
//         //     payload = typeof(payload) == "object" ? payload:{};
//         //     //So, every payload is an object so we should convert into string
//         //     var payloadString = JSON.stringify(payload);
//         //     //return the response 
//         //     res.writeHead(statusCode)
//         //     res.end(payloadString);
//         //     console.log(statusCode);
//         //     console.log(payloadString);


//         // })
//         choosenHandler(data,function(statusCode,payload){

//             // Use the status code returned from the handler, or set the default status code to 200
//             statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

//             // Use the payload returned from the handler, or set the default payload to an empty object
//             payload = typeof(payload) == 'object'? payload : {};

//             // Convert the payload to a string
//             var payloadString = JSON.stringify(payload);

//             // Return the response
//             res.writeHead(statusCode);
//             res.end(payloadString);
//             console.log("Returning this response: ",statusCode,payloadString);

//           });
//         // res.end("Bye Bye");
//         // console.log(buffer);
//     })
//     // console.log(buffer);
//     // //Send the response
//     // res.end("Hello \n");
//     // //log the Request path
// }

// var server = http.createServer(Fool);
// server.listen(8080,function(){
//     console.log("Server is listening on Port 8080");
// })

// //define the handlers
// // var handlers ={};


// // //sample handlers
// // handlers.sample =function(data,callback){
// //     // console.log(data);
// //     // console.log(callback);
// //     callback(406,{'name':"sample handler"});

// // };


// // //Not found handlers
// // handlers.notfound =function(data,callback){
// //     console.log(callback);
// //     console.log(data);
// //     callback(404);
// // }

// // //defining a Request  Routers
// // var router={
// //     'sample': handlers.sample()
// // }





//   // Define all the handlers
//   var handlers = {};

//   // Sample handler
//   handlers.sample = function(data,callback){
//       callback(406,{'name':'sample handler'});
//   };

//   // Not found handler
//   handlers.notFound = function(data,callback){
//     callback(404);
//   };

//   // Define the request router
//   var router = {
//     'sample' : handlers.sample
//   };




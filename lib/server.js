/*
* Title: server library
* Description:server related file
*Author: Shifar Emtiuz
* Date: 29/5/24
*
*/

//Dependencies
const http= require('http');
const {handleReqRes}=require('../helpers/handleReqRes');
const environment = require('../helpers/environment')
const data= require('../lib/data')
//econst{sendTwilioSms}=require('./helpers/notification')
    
//server object - module scaffolding
 const server={};
//configuration
server.config={
    port:3000,
};

 //create sserver

 server.createServer=()=>{
    const createServerVeriable=http.createServer(server.handleReqRes);
    createServerVeriable.listen(server.config.port,()=>{
        
        console.log(`listening to port ${server.config.port}`);
    });
};

 //handle request response

 server.handleReqRes=handleReqRes;

 //start the server
server.init=()=>{
    server.createServer();
}

//export
module.exports=server;

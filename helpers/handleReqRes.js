/*
* Title: handle request response
* Description: handle request response
*Author: Shifar Emtiuz
* Date: 19/5/24
*
*/

//dependency
const url = require('url');
const {StringDecoder}=require('string_decoder'); 
const routes= require('../routes');
const {notFoundHandler}= require('../handlers/routeHandlers/notFoundHandler')
const {parseJSON}=require('../helpers/utilities');


//module scaffolding
const handler={};

handler.handleReqRes=(req,res)=>{

    //request handling
    //get the url and parse it

    const parsedUrl  = url.parse(req.url,true);
   const path=parsedUrl.pathname;
   const trimmedPath= path.replace(/^\/+|\/+$/g, '');
   const method = req.method.toLowerCase();
   const queryStringObject=parsedUrl.query;

   const headersObject= req.headers;
    //console.log(headersObject);
    
    const requestProperties={
      parsedUrl,
      path,
      trimmedPath,
      method,
      queryStringObject,
      headersObject,
};


  const decoder= new StringDecoder('utf-8');
  let realData='';

  const chosenHandler= routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler; 
  

  req.on('data',(buffer)=>{
    realData+=decoder.write(buffer);
  });
  req.on('end',()=>{
    realData+=decoder.end();
    requestProperties.body=parseJSON(realData);

    chosenHandler(requestProperties,(statusCode,playload)=>{
      statusCode=typeof statusCode==='number'? statusCode: 500;
      playload=typeof playload ==='object'? playload: {};
      const playloadString= JSON.stringify(playload);
  
      //return the final response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(playloadString);
  
    }) 
    

  })

   
};




module.exports=handler;
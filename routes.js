/*
* Title: routes
* Description: routes
*Author: Shifar Emtiuz
* Date: 19/5/24
*
*/

//dependencies
const {sampleHandler} =require('./handlers/routeHandlers/samplehandler');
const {userHandler}=require('./handlers/routeHandlers/userHandler');
const {tokenHandler}=require('./handlers/routeHandlers/tokenHandler');
const {checkHandler}=require('./handlers/routeHandlers/checkHandler')
  

const routes={
 
    sample:sampleHandler,
    user:userHandler,
    token:tokenHandler,
    check:checkHandler,

     



}

module.exports= routes;
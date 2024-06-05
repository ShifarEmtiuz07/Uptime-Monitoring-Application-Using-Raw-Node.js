/*
* Title: Uptime Monitoring Application
* Description: A RESTFUL API to monitor up or down time 'of user defined links
*Author: Shifar Emtiuz
* Date: 18/5/24
*
*/
/*
* Title: project initial file
* Description: project initial file to start the node server and workers
*Author: Shifar Emtiuz
* Date: 29/5/24
*
*/
 
//Dependencies
const server=require('./lib/server');
const workers=require('./lib/worker');
    
//App object - module scaffolding
 const app={};

 app.init=()=>{
   //start the server
   server.init();
   //start the workers
   workers.init();
 }

 app.init();

 //export the app
 module.exports=app;









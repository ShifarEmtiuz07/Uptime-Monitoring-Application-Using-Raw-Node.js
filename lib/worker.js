/*
* Title: worker library
* Description:worker related file
*Author: Shifar Emtiuz
* Date: 29/5/24
*
*/

//Dependencies
const url=require('url');
const http=require('http');
const https=require('https');
const data=require('./data');
const {parseJSON}=require('../helpers/utilities');
const {sendTwilioSms}=require('../helpers/notification')

    
//server object - module scaffolding
 const worker={};

//lookup all the chkecks  
worker.gatherAllChecks=()=>{
   //get all the checks
   data.list('checks',(err1,checks)=>{
      if(!err1 && checks && checks.length>0){
         checks.forEach((check)=>{
            //read the checkdata
            data.read('checks',check,(err2,orginalCheckData)=>{
               if(!err2 && orginalCheckData){
                  //pass the data to the ckeck validation
                  worker.validateCheckData(parseJSON(orginalCheckData));
               }
            })
         })

      }else{
         console.log('erroe:could not found any checks to process! ');
      }


   })
};
//validate individual check data
worker.validateCheckData=(orginalCheckData)=>{
   let orginalData=orginalCheckData;
   if(orginalData){
       orginalData.state=typeof(orginalData.state)==='string'&& ['up','down'].indexOf(orginalData.state)>-1?orginalData.state:'down';
       orginalData.lastChecked=typeof(orginalData.lastChecked)==='number' && orginalData.lastChecked>0?orginalData.lastChecked:false;

       //console.log(orginalData.state);
       
      //pass to the next process
      worker.performCheck(orginalData);  

   }else{
      console.log('error: check was invalid')
   }
}

//perform check
worker.performCheck=(orginalCheckData)=>{
   //prepare the initial check outcome
   let checkOutCome={
      error:false,
      responseCode:false
   };
   //mark the outcome has not been sent yet
   let outComeSent=false;
   
   //parse the hostName && full url from orginal data
   const parsedUrl=url.parse(`${orginalCheckData.protocol}://${orginalCheckData.url}`,true);
   const hostName=parsedUrl.hostname;
   const path=parsedUrl.path;
 ///NOTE--path queryString soho full path dai//pathName queryString bada /something dai

 //contruct the request
 const requestDetails={
   protocol:`${orginalCheckData.protocol}:`,
   hostname:hostName,
   method:orginalCheckData.method.toUpperCase(),
   path,
   timeout:orginalCheckData.timeOutSecond *1000,

 };
 const protocolToUse=orginalCheckData.protocol==='http'?http:https;
 
 const req =protocolToUse.request(requestDetails,(res)=>{
   //grab the status of the response
   const status=res.statusCode;
   //console.log(status);

   //update the check outcome and pass to the next process
   checkOutCome.responseCode=status;
   if(!outComeSent){
      worker.processCheckOutcome(orginalCheckData,checkOutCome);
      outComeSent=true;

   }

 });
req.on('error',(e)=>{
   let checkOutCome={
      error:true,
      value:e,
   };
   if(!outComeSent){
      worker.processCheckOutcome(orginalCheckData,checkOutCome);
      outComeSent=true;
      
   }

});
req.on('timeout',(e)=>{
   let checkOutCome={
      error:true,
      value:false
   };

   if(!outComeSent){
      worker.processCheckOutcome(orginalCheckData,checkOutCome);
      outComeSent=true;
      
   }
})

 //req send
 req.end()
   
};
//save checkoutcome to database and send to next process
worker.processCheckOutcome=(orginalCheckData,checkOutCome)=>{
   //check if check outcome is up or down
   let state = !checkOutCome.error && checkOutCome.responseCode && orginalCheckData.successCodes.indexOf(checkOutCome.responseCode)>-1 ?'up':'down';

   //decide wetherwe should alert the user or not
   let alertwanted=orginalCheckData.lastChecked && orginalCheckData.state!==state? true: false;

   //update the check data
   let newCheckData=orginalCheckData;
   newCheckData.state=state;
   //console.log( newCheckData.state);
   newCheckData.lastChecked= Date.now();

   //update the check to disk
   data.update('checks',newCheckData.checkId,newCheckData,(err)=>{
      if(!err){
         if(alertwanted){

         
         //send the checkxata to next process
         worker.alertUserToStatusChange(newCheckData);
         }else{
            console.log('Alert is not nedded as there is no state change');
         }
      }else{
         console.log('Error trying to save check data of one of the checks!');
      }
   });





};

//send notification sms to user if state change
worker.alertUserToStatusChange=(newCheckData)=>{
   let msg=`Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}:// ${newCheckData.url} is currently ${newCheckData.state}`;
   console.log(`User was alerted to a status change via SMS: ${msg}`);
  /*sendTwilioSms(newCheckData.userPhone,msg,(err1)=>{
      if(!err1){
         console.log(`User was alerted to a status change via SMS: ${msg}`);

      }else{
         console.log('There was a problem sending sms to one of the user')
      }
   })*/
    

}
 
 




//timer to execute the worker process once per minute
worker.loop=()=>{
   setInterval(()=>{
      worker.gatherAllChecks();
   },10000);
};

 //start worker
 worker.init=()=>{
    //execute all the checks
    worker.gatherAllChecks();

    //call the loop so that checks continue
    worker.loop();

     

    

 }


//export
module.exports=worker;

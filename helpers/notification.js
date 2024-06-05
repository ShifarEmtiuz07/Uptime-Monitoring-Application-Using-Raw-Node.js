/*
* Title: notification
* Description: important notification function
*Author: Shifar Emtiuz
* Date: 26/5/24
*
*/ 

//dependencies

const https=require('https')
const{twilio}=require('./environment')
const queryString=require('querystring');
const { hostname } = require('os');


//module scaffolding

const notifications={};

//send sms to user using twilio api
notifications.sendTwilioSms=(phone,msg,callback)=>{
    //input validation
    const userPhone=typeof(phone)==='string'&& phone.trim().length===11? phone.trim():false;
    const userMsg=typeof(msg)==='string' && msg.trim().length>0 && msg.trim().length<=1600?msg.trim() : false;
    if(userPhone && userMsg)
        {
            //configure the request playload 
            const payload={
                From:twilio.fromPhone,
                To:`+88${userPhone}`,
                Body:userMsg
            };
            //stringify the playlaod 
            const stringifyPayload=queryString.stringify(payload);

            //configure the request details
            const requestDetails={
                hostname:'api.twilio.com',
                method:'POST',
                path:`/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
                auth:`${twilio.accountSid}:${twilio.authToken}`,
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                },

            };

            //instantiate the request
            const req=https.request(requestDetails,(res)=>{
                const status= res.statusCode;
                if(status===200 || status===201){
                    callback(false)

                }else{
                    callback(`Status code returned was ${status}`)
                }

            });

            req.on('error',(e)=>{
                callback(e);
            })

            req.write(stringifyPayload);
            req.end();


        }else{
            callback('Given parameters were missing or invalid!')
        }


};


//export the module
module.exports=notifications;
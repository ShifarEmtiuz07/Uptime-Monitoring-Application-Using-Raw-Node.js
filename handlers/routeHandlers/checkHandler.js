/*
* Title: cheak handler
* Description:handler to handle user defined cheak
*Author: Shifar Emtiuz
* Date: 25/5/24
*
*/

//dependencies

const data=require('../../lib/data');
const{hash,createRandomString}=require('../../helpers/utilities')
const{parseJSON}=require('../../helpers/utilities')
const tokenHandler=require('./tokenHandler');
const{maxChecks}=require('../../helpers/environment');


//module scaffolding

const handler={}

handler.checkHandler=(requestProperties,callback)=>{
    //console.log(requestProperties);
    const acceptedMethods=['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1)
        {
            handler.check[requestProperties.method](requestProperties,callback);

        }
        else{
            callback(405);
        }
};

handler.check={};

handler.check.post=(requestProperties,callback)=>{

    //validate input
    let protocol=typeof(requestProperties.body.protocol)==='string' && ['http','https'].indexOf(requestProperties.body.protocol)>-1?requestProperties.body.protocol:false;

    let url=typeof(requestProperties.body.url)==='string' && requestProperties.body.url.trim().length>0?requestProperties.body.url:false;

    let method=typeof(requestProperties.body.method)==='string' && ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1 ?requestProperties.body.method:false;

    let successCodes=typeof(requestProperties.body.successCodes)==='object' && (requestProperties.body.successCodes) instanceof Array ? requestProperties.body.successCodes:false;

    let timeOutSecond=typeof(requestProperties.body.timeOutSecond)==='number' && (requestProperties.body.timeOutSecond) % 1===0 && requestProperties.body.timeOutSecond>=1 && requestProperties.body.timeOutSecond<=5? requestProperties.body.timeOutSecond:false;

    if(protocol && url && method && successCodes &&timeOutSecond){
        const token=typeof(requestProperties.headersObject.token)==='string'? requestProperties.headersObject.token: false;

        //lookup the user phone number from token dataBase
        data.read('tokens',token,(err1,tokenData)=>{
            if(!err1 && tokenData){
                const userPhone=parseJSON(tokenData).phone;
                //lookup the user data
                data.read('users',userPhone,(err2,userData)=>{
                    if(!err2&& userData){
                        tokenHandler._token.verify(token,userPhone,(tokenIsValid)=>{
                            if(tokenIsValid){
                                let userObject=parseJSON(userData);
                                //console.log(userObject)
                                let userChecks=typeof(userObject.checks)==='object' && userObject.checks instanceof Array? userObject.checks:[];
                                //console.log(userChecks)
                                if(userChecks.length<maxChecks){
                                    let checkId=createRandomString(20); // userObject?.checks.length
                                    let checkObject={
                                    
                                        checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,timeOutSecond



                                    }
                                    data.create('checks',checkId,checkObject,(err3)=>{
                                        if(!err3){
                                            //add cheak id to the userObject
                                            userObject.checks=userChecks;
                                            userObject.checks.push(checkId);

                                            //save the new user data
                                            data.update('users',userPhone,userObject,(err4)=>{

                                                if(!err4){
                                                    callback(200,userObject)

                                                }else{
                                                    callback(500,{
                                                        error:'there was a error in server side'
                                                    })
        

                                                }
                                            })


                                             


                                        }else{
                                            callback(500,{
                                                error:'there was a error in server side'
                                            })

                                        }
                                    })

                                }else{
                                    callback(401,{
                                        error:'User has already reached max check limit!'
                                    })
                                }



                            }else{
                                callback(403,{
                                    error:'Authentication failure'
                                })

                            }

                        })

                    }else{
                        callback(400,{
                            error:'user not found'
                        })
                    }
                })

            }else{
                callback(400,{
                    error:'user not found'
                })
            }
        })




    }else{
        callback(400,{
            error:'you have a problem in your request'
        })
    }



   


}
//@TODO:Authentication
handler.check.get=(requestProperties,callback)=>{
    const checkId=typeof(requestProperties.queryStringObject.checkId)==='string' && requestProperties.queryStringObject.checkId.length===20 ? requestProperties.queryStringObject.checkId:false;
    if(checkId){
        data.read('checks',checkId,(err5,checkData)=>{
            if(!err5){
                const token=typeof(requestProperties.headersObject.token)==='string' && requestProperties.headersObject.token.length===20 ? requestProperties.headersObject.token:false;
                tokenHandler._token.verify(token,parseJSON(checkData).userPhone,(tokenIsValid)=>{
                    if(tokenIsValid){
                        callback(200,parseJSON(checkData));

                    }else{
                        callback(403,{
                            error:'Authentication failure'
                        })
                    }
                });

            }else{
                callback(500,
                    {
                        error:'checkId is invalid'
                    });
            }
        });

    }else{
        callback(500,
            {
                error:'there was a problem in your request'
            });
    }
    
    

      
}
//@TODO:Authentication
handler.check.put=(requestProperties,callback)=>{
    const checkId=typeof(requestProperties.body.checkId)==='string' && requestProperties.body.checkId.length===20 ? requestProperties.body.checkId:false;

    let protocol=typeof(requestProperties.body.protocol)==='string' && ['http','https'].indexOf(requestProperties.body.protocol)>-1?requestProperties.body.protocol:false;

    let url=typeof(requestProperties.body.url)==='string' && requestProperties.body.url.trim().length>0?requestProperties.body.url:false;

    let method=typeof(requestProperties.body.method)==='string' && ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1 ?requestProperties.body.method:false;

    let successCodes=typeof(requestProperties.body.successCodes)==='object' && (requestProperties.body.successCodes) instanceof Array ? requestProperties.body.successCodes:false;

    let timeOutSecond=typeof(requestProperties.body.timeOutSecond)==='number' && (requestProperties.body.timeOutSecond) % 1===0 && requestProperties.body.timeOutSecond>=1 && requestProperties.body.timeOutSecond<=5? requestProperties.body.timeOutSecond:false;
    if(checkId){
        if(protocol || url ||method || successCodes || timeOutSecond)
            {
                const token=typeof(requestProperties.headersObject.token)==='string' && requestProperties.headersObject.token.length===20 ? requestProperties.headersObject.token:false;
                data.read('tokens',token,(err6,tokenData)=>{
                    if(!err6)
                        {
                            const tokenObject=parseJSON(tokenData);
                            tokenHandler._token.verify(token,tokenObject.userPhone,(tokenIsValid)=>{
                                if(tokenIsValid){
                                    if(protocol)
                                        {
                                            tokenObject.protocol=protocol; 
                                        }
                                        if(url)
                                            {
                                                tokenObject.url=url; 
                                            }
                                            if(method)
                                                {
                                                    tokenObject.method=method; 
                                                }
                                                if(successCodes)
                                                    {
                                                        tokenObject.successCodes=successCodes; 
                                                    }
                                                    if(timeOutSecond)
                                                        {
                                                            tokenObject.timeOutSecond=timeOutSecond 
                                                        }

                                                        data.update('checks',checkId,tokenObject,(err6)=>{
                                                            if(!err6){
                                                                callback(200,
                                                                    {
                                                                        message:'updated successfully'
                                                                    });
                                                            }else{
                                                                callback(500,
                                                                    {
                                                                        error:'there was a server side problem!'
                                                                    });
                                                                
                                                            }
                                                        })
                                    
            
                                }else{
                                    callback(403,{
                                        error:'Authentication failure'
                                    })
                                }
                            });


                        }else{
                            callback(403,{
                                error:'token not found!'
                            })

                        }

                })
                

            }

    }else{
        callback(500,
            {
                error:'there was a problem in your request'
            });

    }




   

}
//@TODO:Authentication
handler.check.delete=(requestProperties,callback)=>{

   


const checkId=typeof(requestProperties.queryStringObject.checkId)==='string' && requestProperties.queryStringObject.checkId.length===20 ? requestProperties.queryStringObject.checkId:false;
if(checkId){
    data.read('checks',checkId,(err5,checkData)=>{
        if(!err5){
            const token=typeof(requestProperties.headersObject.token)==='string' && requestProperties.headersObject.token.trim().length===20 ? requestProperties.headersObject.token:false;
            //console.log(tokenObject.expires);
            tokenHandler._token.verify(token,parseJSON(checkData).userPhone,(tokenIsValid)=>{
                if(tokenIsValid){
                   data.delete('checks',checkId,(err7)=>{
                    if(!err7){

                        data.read('users',parseJSON(checkData).userPhone,(err8,userInfo)=>{
                            const userObject=parseJSON(userInfo);
                            if(!err8){

                                const userChecks=typeof userObject.checks==='object' && userObject.checks instanceof Array?userObject.checks:[];
                                
                                const deletePosition=userChecks.indexOf(checkId);
                                if(deletePosition>-1)
                                    {
                                        userChecks.splice(deletePosition, 1);
                                        userObject.checks=userChecks;
                                        data.update('users',userObject.phone,userObject,(err8)=>{
                                            if(!err8){
                                                callback(200,
                                                    {
                                                        message:'deleted successfully'
                                                    });
                                            }else{
                                                callback(500,
                                                    {
                                                        error:'there was a server side problem!'
                                                    });
                                                
                                            }
                                        })

                                    }else{
                                        callback(500,
                                            {
                                                error:'userChecks is already empty'
                                            });
                                    }

                            }else{
                                callback(500,
                                    {
                                        error:'user not found'
                                    });
                            }
                        })

                    }else{
                        callback(500,
                            {
                                error:'there was a problem in server side'
                            });
                    }
                   })

                }else{
                    callback(403,{
                        error:'Authentication failure'
                    })
                }
            });

        }else{
            callback(500,
                {
                    error:'checkId is invalid'
                });
        }
    });

}else{
    callback(500,
        {
            error:'there was a problem in your request'
        });
}
}








 


//module export
module.exports=handler;
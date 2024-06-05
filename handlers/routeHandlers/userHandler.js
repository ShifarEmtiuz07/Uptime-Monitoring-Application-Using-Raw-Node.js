/*
* Title: user handler
* Description:handler to handle user related routes
*Author: Shifar Emtiuz
* Date: 21/5/24
*
*/

//dependencies

const data=require('../../lib/data');
const{hash}=require('../../helpers/utilities')
const{parseJSON}=require('../../helpers/utilities')
const tokenHandler=require('./tokenHandler');


//module scaffolding

const handler={}

handler.userHandler=(requestProperties,callback)=>{
    //console.log(requestProperties);
    const acceptedMethods=['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1)
        {
            handler._user[requestProperties.method](requestProperties,callback);

        }
        else{
            callback(405);
        }
};

handler._user={};

handler._user.post=(requestProperties,callback)=>{

    const firstName=typeof(requestProperties.body.firstName)==='string' && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName : false;

    const lastName=typeof(requestProperties.body.lastName)==='string' && requestProperties.body.lastName.trim().length>0 ? requestProperties.body.lastName : false;

    const phone=typeof(requestProperties.body.phone)==='string' && requestProperties.body.phone.trim().length===11 ? requestProperties.body.phone : false;

    const password=typeof(requestProperties.body.password)==='string' && requestProperties.body.password.trim().length>0 ? requestProperties.body.password : false;
    
    const tosAgrement=typeof(requestProperties.body.tosAgrement)==='boolean'  ? requestProperties.body.tosAgrement : false;

    if(firstName && lastName && phone && password && tosAgrement)
        {
            //make sure that user does not already exist
            data.read('users',phone,(err)=>{
                if(err){
                    let userObject={
                        firstName,
                        lastName, 
                        phone,
                        password:hash(password),
                        tosAgrement,

                    };
                    //store the user to db
                    data.create('users',phone,userObject,(err1)=>{
                    if(!err1){
                        callback(200,
                            {
                                message:'user was created successfully'
                            });
                        

                    }else{
                        callback(500,
                            {
                                error:'could not create user'
                            });
                        
                    }
                })

                }else{
                    callback(500,{
                        message:'user already exists',
                    });
                }
                


            })



        }else{
            callback(400,
                {
                    error:'you have a problem in your request'
                }
            )
        }




}
//@TODO:Authentication
handler._user.get=(requestProperties,callback)=>{
    //cheak the phone is valid
    const phone=typeof(requestProperties.queryStringObject.phone)==='string' && requestProperties.queryStringObject.phone.trim().length===11 ? requestProperties.queryStringObject.phone : false;

  
    if(phone){

        const token=typeof(requestProperties.headersObject.token)==='string'? requestProperties.headersObject.token:false;
        tokenHandler._token.verify(token,phone,(tokenId)=>{
            if(tokenId){

                //lookup the user from dataBase
                data.read('users',phone,(err2,filedata)=>{
                    const user= {...parseJSON(filedata)}
                    if(!err2 && user)
                    {
                        delete user.password;
                        callback(200,user)
            
            
                    }else{
                        callback(404,{
                            message:'user not found',
                        })
                            
                        }
            
                });
                

            }else{
                callback(403,{
                    error:'Authentication failure!'

                })
            }
        })

        
        
        
    }else{
        callback(404,
            {
                message:'user not found',
            }
        )

    }
    
    

      
}
//@TODO:Authentication
handler._user.put=(requestProperties,callback)=>{

    const phone=typeof(requestProperties.body.phone)==='string' && requestProperties.body.phone.trim().length===11 ? requestProperties.body.phone : false;

    const firstName=typeof(requestProperties.body.firstName)==='string' && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName : false;

    const lastName=typeof(requestProperties.body.lastName)==='string' && requestProperties.body.lastName.trim().length>0 ? requestProperties.body.lastName : false;

    const password=typeof(requestProperties.body.password)==='string' && requestProperties.body.password.trim().length>0 ? requestProperties.body.password : false;
    
    if(phone)
        {
            const token=typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
            
            //console.log(token);
            tokenHandler._token.verify(token,phone,(tokenId)=>{
                if(tokenId){

                    if(firstName || lastName || password){
                        //lookup the user
                        data.read('users',phone,(err3,uData)=>{
                            const userData={...parseJSON(uData)}
                            if(!err3 && userData){
                                if(firstName)
                                    {
                                        userData.firstName=firstName;
                                    }
                                    if(lastName)
                                        {
                                            userData.lastName=lastName;
                                        }
                                        if(password)
                                            {
                                                userData.password=hash(password);
                                            }
        
                                //update to database
                                data.update('users',phone,userData,(err4)=>{
                                    if(!err4){
                                        callback(200,{
                                            message:'user update successfully',
                                        })
        
                                    }else{
                                        callback(500,{
                                            error:'there was a problem in server side',
                                        })
                                    }
                                })
        
                            }else{
                                callback(400,{
                                    error:'you have problem in your request'})
                            }
                        })
        
                    }else{
                        callback(400,{
                            error:'you have problem in your request'
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
                error:'invalid phone number'
            })
        }



}
//@TODO:Authentication
handler._user.delete=(requestProperties,callback)=>{

    const phone=typeof(requestProperties.queryStringObject.phone)==='string' && requestProperties.queryStringObject.phone.trim().length===11 ? requestProperties.queryStringObject.phone : false;

    if(phone){

        const token=typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
            
            //console.log(token);
            tokenHandler._token.verify(token,phone,(tokenId)=>{
                if(tokenId){
                    data.read('users',phone,(err5,udata)=>{
                        if(!err5 && udata){
                            data.delete('users',phone,(err6)=>{
                                if(!err6){
                                    callback(200,{
                                        message:'user deleted successfully'
                                    })
            
                                }else{
                                    callback(500,{
                                        error:'there was an server side problem'
                                    })
                                }
                            })
            
                        }else{
                            callback(500,{
                                error:'there was an server side problem'
                            })
                        }
            
                    })

                }else{
                    callback(403,{
                        error:'Authentication failure'
                    })

                }
    });



        //lookup user from dataBase
        

    }else{
        callback(400,{
            error:'there was an problem'
        })
    }
}







 


//module export
module.exports=handler;
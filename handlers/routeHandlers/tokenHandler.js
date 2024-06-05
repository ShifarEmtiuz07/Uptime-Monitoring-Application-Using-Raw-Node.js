/*
* Title: token handler
* Description:handler to handle token related routes
*Author: Shifar Emtiuz
* Date: 22/5/24
*
*/

//dependencies

const data=require('../../lib/data');
const{hash, parseJSON}=require('../../helpers/utilities')
//const{parseJSON}=require('../../helpers/utilities')
const {createRandomString}=require('../../helpers/utilities')


//module scaffolding

const handler={}

handler.tokenHandler=(requestProperties,callback)=>{
    //console.log(requestProperties);
    const acceptedMethods=['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1)
        {
            handler._token[requestProperties.method](requestProperties,callback);

        }
        else{
            callback(405);
        }
};

handler._token={};

handler._token.post=(requestProperties,callback)=>{
     
     const phone=typeof(requestProperties.body.phone)==='string' && requestProperties.body.phone.trim().length===11 ? requestProperties.body.phone:false;

     const password=typeof(requestProperties.body.password)==='string' && requestProperties.body.password.trim().length>0 ? requestProperties.body.password:false;

     if(phone && password)
        {
            //read data and compare user send data to dataBase data
            data.read('users',phone,(err1,userData)=>{

                const hasedpassword=hash(password);
                if(hasedpassword === parseJSON(userData).password){
                    let tokenId=createRandomString(20);
                    let expires= Date.now() + 60 * 60 * 1000;
                    let tokenObject={
                        phone,
                        'id':tokenId,
                        expires


                    };
                    //store token in dataBase
                    data.create('tokens',tokenId,tokenObject,(err2)=>{
                        if(!err2){
                            callback(200,tokenObject);

                        }else{
                            callback(500,
                                {
                                    erroe:'there was a problem in server side'
                                });

                        }
                    })




                }else{
                    callback(500,
                        {
                            error:'password is invalid'
                        });
                }
               
            })

        }
        else{
            callback(500,
                {
                    error:'there was a problem in your request'
                });
        }

}

handler._token.get=(requestProperties,callback)=>{
    const token=typeof(requestProperties.queryStringObject.id)==='string' && requestProperties.queryStringObject.id.length===20 ? requestProperties.queryStringObject.id:false;
    if(token){

        data.read('tokens',token,(err3,tokenData)=>{

            const tokenInfo={...parseJSON(tokenData)}
            if(!err3 && tokenData){
                
                callback(200,tokenInfo);

            }else{
                callback(500,
                    {
                        error:'token is invalid'
                    });
            }
        })

    }else{
        callback(500,
            {
                error:'there was a problem in your request'
            });
    }
      
}

handler._token.put=(requestProperties,callback)=>{

    const token=typeof(requestProperties.body.id)==='string' && requestProperties.body.id.trim().length===20? requestProperties.body.id:false;
    const extend=typeof(requestProperties.body.expires)==='boolean' && requestProperties.body.expires===true?true:false;
    if(token && extend ){
        data.read('tokens',token,(err4,tokenData)=>{
            tokenInfo=parseJSON(tokenData)
            if(tokenInfo.expires>Date.now())
                {
                    tokenInfo.expires=Date.now() + 60*60*1000;
    
                
                data.update('tokens',token,tokenInfo,(err5)=>{
                    if(!err5){
                        callback(200,
                            {
                                message:'updated successfully'
                            }
                        )
    
                    }else{
                        callback(500,
                            {
                                error:'there was a server side problem!'
                            });
                        
                    }
    
                });
            }
            
                else{
                    callback(500,
                        {
                            error:'token validity expired!'
                        });
                }
    
        })
    }else{
        callback(404,
            {
                error:'there was a problem in your request!'
            }
        )
    }
    


}

handler._token.delete=(requestProperties,callback)=>{
    const token=typeof(requestProperties.queryStringObject.id)==='string' && requestProperties.queryStringObject.id.length===20 ? requestProperties.queryStringObject.id:false;
    if(token){
        data.read('tokens',token,(err7,userData)=>{
            if(!err7 && userData){
                data.delete('tokens',token,(err6)=>{
                    if(!err6){
                        callback(200,{
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
                callback(404,{
                    error:'there was a server side problem!'
                })
            }
        })
        

    }else{
        callback(404,{
            error:'there was a problem in your request!'
        })
    }

   
}

//verify tokenId

handler._token.verify=(token,phone,callback)=>{
    data.read('tokens',token,(err1,tokenData)=>{
        if(!err1 && tokenData){
            if(parseJSON(tokenData).id=== token && parseJSON(tokenData).expires>Date.now()){
                callback(true);
            }
            else{
                callback(false);
            }

        }else{
            callback(false);
        }
    })
}






 


//module export
module.exports=handler;
/*
* Title: utilities
* Description: important utility function
*Author: Shifar Emtiuz
* Date: 21/5/24
*
*/ 

//dependencies

const crypto=require('crypto');
const environments=require('./environment');


//module scaffolding

const utilities={};

//  parse json string to object
utilities.parseJSON=(jsonString)=>{

    let output;
    try{
        output=JSON.parse(jsonString)

    }
    catch{
        output={};

    }
    return output;
}

//hash string

utilities.hash=(str)=>{
    if(typeof(str)==='string' && str.length>0 ){
        const hash= crypto
        .createHmac('sha256',environments.secretKey)
        .update(str)
        .digest('hex');
        return hash;
    }else{
        return false;
    }
};

//createRandomString

utilities.createRandomString=(strLength)=>{

    let length=strLength;
    length = typeof(strLength)==='number' && strLength>0 ? strLength: false;
    if(length){
        const possiblecharacter='abcdefghijklmnopqrstuvwxyz1234567890';
        let output='';
        for(let i=1;i<=length;i++)
            {
                let randomCharacter=possiblecharacter.charAt(Math.floor(Math.random()*possiblecharacter.length));
                output+=randomCharacter;

            }
            return output;

    };
   

};






//module exports//

module.exports=utilities;

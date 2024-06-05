/*
* Title: sample handler
* Description: sample handler
*Author: Shifar Emtiuz
* Date: 19/5/24
*
*/

//module scaffolding

const handler={};

handler.sampleHandler=(requestProperties, callback)=>{

    console.log(requestProperties);

callback(200,{
    message: 'this is a sample url',
});
};

module.exports=handler;
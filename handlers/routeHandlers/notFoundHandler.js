/*
* Title: not found handler
* Description: sample handler
*Author: Shifar Emtiuz
* Date: 19/5/24
*
*/

//module scaffolding

const handler={};

handler.notFoundHandler=(requestProperties,callback)=>{

    callback(404,{
        message:'your requested url was not found!',
    });

};

module.exports=handler;
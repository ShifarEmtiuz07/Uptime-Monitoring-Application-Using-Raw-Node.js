/*
* Title: Environment
* Description: handle all environment related things
*Author: Shifar Emtiuz
* Date: 20/5/24
*
*/ 



//module scaffolding

const environments={};

environments.staging = {
   port:3000,
   envName:'staging',
   secretKey:'sdhcbskjcnsjvnb',
   maxChecks:5,
};
environments.production={

   port:5000,
   envName:'production',
   secretKey:'mmnvxbvhsussjhvs',
   maxCheaks:5,

};

const currentEnvironment = typeof process.env.NODE_ENV==='string'? process.env.NODE_ENV : 'staging';
console.log(currentEnvironment) 

const environmentToExport = typeof environments[currentEnvironment] ==='object' ? environments[currentEnvironment]:environments.staging;

console.log(environments[currentEnvironment]); 

//module exports//

module.exports=environmentToExport;

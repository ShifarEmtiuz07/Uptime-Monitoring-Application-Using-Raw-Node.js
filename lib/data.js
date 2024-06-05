//dependencies

const fs = require('fs');
const path= require('path');

//module scaffolding
const lib={}

// base directory of the data folder
lib.basedir=path.join(__dirname,'/../.data/');

//write data to file
lib.create=(dir,file,data,callback)=>{
    //open file for writing
    fs.open(`${lib.basedir+dir}/${file}.json`,'wx',(err1,fileDescriptor)=>{
        if(!err1 && fileDescriptor)
            {
                //convert data to string
                const stringData=JSON.stringify(data);
                //write data to file and then close it
                fs.writeFile(fileDescriptor,stringData,(err2)=>{
                    if(!err2){
                        fs.close(fileDescriptor,(err3)=>{
                            if(!err3){
                                callback(false);
                            }else{
                                callback('error closing the new file');
                            }
                        });
                    }else{
                        callback('error writing to new file!')
                    }

                })
                

            }else{
                callback('could not create new file, it may already exists!')
            }

    })


}

//read data from file

lib.read=(dir,file,callback)=>{
    fs.readFile(`${lib.basedir+dir}/${file}.json`,'utf-8',(err4,data)=>{
        callback(err4,data);
    })
}

//update existing file
lib.update=(dir,file,data,callback)=>{
    //file open for writing
    fs.open(`${lib.basedir+dir}/${file}.json`,'r+',(err5,fileDescriptor)=>{

        if(!err5 && fileDescriptor)
            {
                const stringData=JSON.stringify(data);
                //truncate the file
                fs.ftruncate(fileDescriptor, (err6)=>{
                    if(!err6){
                        //write the file and close it
                        fs.writeFile(fileDescriptor,stringData,(err7)=>{
                            if(!err7)
                                {
                                    //close file
                                    fs.close(fileDescriptor,(err8)=>{
                                        if(!err8){
                                           callback(false) ;
                                        }else{
                                            callback('error closing file!');
                                        }
                                    });
                                    
                                }else{
                                    callback('error writing to file')
                                }
                        });
                    }else{
                        callback('error truncating file!')
                    }

                });

                

            }else{
                callback(`error updating. File may not exist`);
            }
    });
}


//file delete

lib.delete=(dir,file,callback)=>{
  //unlink file
  fs.unlink(`${lib.basedir+dir}/${file}.json`,(err9)=>{
    if(!err9){
        callback(false);
    }else{
        callback('error deleting file');
    }
  });

}

//list all items in a directory
lib.list=(dir,callback)=>{
    fs.readdir(`${lib.basedir+dir}/`,(err,fileNames)=>{
      if(!err && fileNames && fileNames.length>0){
        let trimmedFileNames=[];
        fileNames.forEach((fileName)=>{

            trimmedFileNames.push(fileName.replace('.json',''));
        });
        callback(false,trimmedFileNames);
          

      } else{
        callback('Error reading directory! ')
      }
    });
}












//module export
module.exports=lib;
 



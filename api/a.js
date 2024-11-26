import { stdout } from "process";
import { Readable } from "stream";

const buff = Buffer.from("mydata ".repeat(10000), "utf-8");
const chunkSize = 5;
let index = 0;
const readable = new Readable({
  read(){
    if(index >= buff.length){
      this.push(null);
      return ;
    }else{
      const chunk = buff.slice(index , index + chunkSize)  + "--";
      this.push(chunk);
      index = index + chunkSize;
    }
  }
})

readable.on('error', (err)=>console.log("error in read : ", err));
readable.on('end', ()=>console.log("read completed " ))
readable.pipe(process.stdout);
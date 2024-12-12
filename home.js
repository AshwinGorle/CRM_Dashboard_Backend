const homePage = (req,res)=>{
    try {
        res.send({
            message : "shree ganesh"
        })
        // Your function logic
       
      } catch (error) {
        console.error('Error occurred:', error);
        return res.send({ message: 'Internal Server Error', error });
      }
}
  
export default homePage;
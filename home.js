const homePage = (req,res)=>{
    try {
        res.send({
            message : "shree ganesh"
        })
        // Your function logic
        console.log("home page provided for testing");
        console.log("home page provided for testing");
        console.log("home page provided for testing");
        console.log("home page provided for testing");
        console.log("home page provided for testing");
      } catch (error) {
        console.error('Error occurred:', error);
        return res.send({ message: 'Internal Server Error', error });
      }
}
  
export default homePage;
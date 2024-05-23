module.exports = (fn)=>{
    return (req,res,next) => {
        fn(req,res,next).catch(next);//if any error occured in the catch trnser it to next middleware


    }
}
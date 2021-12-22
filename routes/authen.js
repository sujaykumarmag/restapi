const router = require("express").Router();


//use post yaar
router.get("/Register",function(req,res){
    res.send("Register");
})

module.exports =router;

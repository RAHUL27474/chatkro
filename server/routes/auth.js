const express=require("express");
const { sendotp ,signup, login,forgotpasswordtoken,forgotpassword} = require("../controllers/Auth");
const {
    loginValidator,
    registerValidator,
    validateHandler,
  } =require("../lib/validators.js") ;
  
const { singleAvatar } =require("../middlewares/multer.js") ;
const router=express.Router();


//user routes
router.post("/sendotp",sendotp);
router.post("/signup", registerValidator(), validateHandler,signup);
router.post("/login", loginValidator(), validateHandler, login);
router.post("/forgotpasswordtoken",forgotpasswordtoken);
router.post("/forgotpassword",forgotpassword);





// Export the router for use in the main application
module.exports = router
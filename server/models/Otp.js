const mongoose=require("mongoose");
const {mailsender}=require("../utils/SendMail");
const {otptemplate}=require("../mailtemplates/VerificationOtp");


const otpschema=new mongoose.Schema({
    email:{
        type:String,
    },
    otp:{
        type:String,
    },
    cretedat:{
        type:Date,
        default:Date.now,
        expires:5*60,
    },
})

otpschema.pre("save",async function(next){
    try{
        console.log(this.email,this.otp);
        const mailresponse=await mailsender(this.email,"Verification Email From StudyNotion",otptemplate(this.otp))
        console.log("mail response is =>",mailresponse);
    }
    catch(err){
        console.log("Cannot save OTP");
        console.log(err.message);
    }
    next();
})










module.exports=mongoose.model("Otp",otpschema);
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const User=require("../models/user");
const Otp=require("../models/Otp");
// const Profile=require("../models/Profile");
const otpgenerator=require("otp-generator");
const {signuptemplate}=require("../mailtemplates/Signup")
const {forgotpasswordtemplate}=require("../mailtemplates/ForgotpasswordLink");
const {mailsender}=require("../utils/SendMail");
const {sendToken}=require("../utils/features")
require("dotenv").config();

//send otp logic
exports.sendotp=async (req,res)=>{
    try{
        console.log(req.body);
        const {email,username}=req.body;
        if(!email){
            return res.json({
                success:false,
                message:"Email Not Found"
            })
        }
        const checkuser=await User.findOne({email});
        const checkusername=await User.findOne({username});
        if(checkuser && checkusername){
            return res.json({
                success:false,
                message:"User Already Registered",
            })
        }
        
        const otp=otpgenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        const checkotp=await Otp.findOne({otp});
        if(checkotp){
            otp=otpgenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            checkotp=await Otp.findOne({otp});
        }

        const otpdata=await Otp.create({email,otp});
        res.json({
            success:true,
            messsage:"OTP send Successfully",
            data:otpdata,
        })
    }
    catch(err){
        console.log("Cannot send OTP");
        return res.json({
            success:false,
            message:"could not send OTP",
        })
    }
}


//signup logic
exports.signup=async (req,res,next)=>{
    try{
        const {firstname,lastname,email,username,password,otp}=req.body;
        
        console.log(firstname,lastname,password,email,otp)
        if(!firstname||!lastname|| !email ||!password || !username ||!otp){
            return res.json({
                success:false,
                message:"All fields are required",
            })
        }
        const checkemail=await User.findOne({email});
        const checkusername=await User.findOne({username});
        if(checkemail && checkusername){
            return res.json({
                success:false,
                message:"User Already Registered",
            })
        }
        // const file = req.file;

        // let avatar;
        // if (file) {
        //     // If file is present, upload to Cloudinary
        //     const result = await uploadFilesToCloudinary([file]);
        //     avatar = {
        //         public_id: result[0].public_id,
        //         url: result[0].url,
        //     };
        // } else {
        //     // If no file is present, use the SVG link based on first and last name
        //     const svgLink = `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`;
        //     avatar = {
        //         public_id: null, // No Cloudinary public_id
        //         url: svgLink,
        //     };
        // }
        // if(password!==confirmpassword){
        //     return res.json({
        //         success:false,
        //         message:"Password and ConfirmPassword are not Same",
        //     })
        // }
        // const checkkey=await Secretkey.findOne({email});
        // if(accounttype=="Alumni"){
        //     if(checkkey?.secretkey!=secretkey){
        //         return res.json({
        //             success:false,
        //             message:"Wrong secret key Please Enter correct secret key"
        //         })
        //     }
        // }
        const latestotp=await Otp.findOne({email}).sort({createdate:"desc"});
        console.log("latest otp is ==============================:",latestotp);
        console.log(latestotp.otp)
        console.log(otp)
        console.log(latestotp.otp!==otp)
        if(!latestotp || latestotp.otp!==otp){
            return res.json({
                success:false,
                message:"OTP Not Found"
            })
        }
        console.log("otp is verified");
        const hashedpassword=await bcrypt.hash(password,10);
        console.log(hashedpassword);
        // const profiledetails=await Profile.create({
        //     gender:null,
        //     dateofbirth:null,
        //     about:null,
        //     contactno:null,
        // })

        const userdata=await User.create({
            firstname,
            lastname,
            email,
            username,
            password: hashedpassword,
            // avatar,
        })
        const mailresponse=await mailsender(email,"Signup Successfull",signuptemplate("accounttype"));
        // res.json({
        //     success:true,
        //     message:"User Created Successfully",
        //     data:userdata,
        // })
        console.log("user saved in database");

        sendToken(res, userdata, 201, "User created");




    }
    catch(err){
        return res.json({
            success:false,
            message:err.message,
        })
    }
}


//login logic
exports.login=async (req,res)=>{
    try{
        console.log(req.body);
        const { input, password } = req.body;

        if (!input || !password) {
            return res.json({
                success: true,
                message: "All Fields are Required",
            });
        }
        console.log(input)
        console.log(password)

        // Check if the input is an email or username
        const isEmail = input.includes("@");

        // Find the user by email or username
        const user = await User.findOne(
            isEmail ? { email: input } : { username: input }
        ).exec();
        console.log("1")
        if (!user) {
            return next(
                new ErrorHandler(
                    `Invalid ${isEmail ? "Email" : "Username"} or Password`,
                    404
                )
            );
        }
        console.log(user.password);
        //match the password and make the jwt token and send trouhgn cookie.
        if(await bcrypt.compare(password,user.password)){
            console.log("password matched successfully")
            // const payload = {
            //     id: user._id,
            //     ...(isEmail ? { email: user.email } : { username: user.username }),
            // };
            
            user.password=undefined;
            user.forgotpasswordlink=undefined;
            user.forgotpasswordlinkexpires=undefined;
            sendToken(res, user, 200, `Welcome Back, ${user.name}`);
            
        }
        else{
            return res.json({
                success:false,
                message:"Password is Incorrect",
            })
        }
    }
    catch(err){
        console.log("ertyuio",err)
        return res.json({
            success:false,
            message:err.message,
        })
    }

}


//forgot password logic
exports.forgotpasswordtoken=async (req,res)=>{
    try{
        const {email}=req.body;
    const user=await User.findOne({email});

    if(!user){
        return res.json({
            success:false,
            message:"User not Found with given email",
        })
    }
    const token=crypto.randomUUID();    
    await User.findOneAndUpdate({email},{
        forgotpasswordlink:token,
        forgotpasswordlinkexpires:Date.now()+5*60*1000,
    })
    const link=`https://localhost:3000/updatepassword/${token}`
    const mailresposne=await mailsender(email,"Forgot Password Email",forgotpasswordtemplate(email,link));

    res.json({
        success:true,
        message:"Reset password link is send to your email id",
        data:token,
    })

    }
    catch(err){
        return res.json({
            success:false,
            message:err.message,
            
        })
    }
}


exports.forgotpassword=async (req,res)=>{
    try{

        const {password,confirmpassword,token}=req.body;
        if(!password || !confirmpassword ){
            return res.json({
                success:false,
                message:"All Fields are required",
            })
        }

        if(password!==confirmpassword){
            return res.json({
                success:false,
                message:"Password and ConfirmPassword are not Same",
            })
        }

        const userdetails=await User.findOne({forgotpasswordlink:token});
        if(!userdetails){
            return res.json({
                success:false,
                message:"Invalid Token",
            })
        }

        if(userdetails.forgotpasswordlinkexpires<Date.now()){
            return res.json({
                success:false,
                message:"Token expires generate new token",
            })
        }
        
        const hashedpassword=await bcrypt.hash(password,10);
        
        await User.findOneAndUpdate({forgotpasswordlink:token},{
            hashedpassword,
        })

        res.json({
            success:true,
            message:"Password reset Successful",
        })
    }
    catch(err){
        return res.json({
            success:false,
            message:err.message,
        })
    }

}


//====================finished==================================================================
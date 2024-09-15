import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input'
import Custombutton from '../components/Custombutton';
// import { sendotp, signup } from '../services/Authservices';


const Verifyotp = () => {
    
    const navigate=useNavigate();
    // const dispatch=useDispatch()
    const [otp,setotp]=useState("");
    const {userdata}=useSelector((state)=>state.auth);
    const loading=false;
    const resendotphandler=(e)=>{
        e.preventDefault();
        // dispatch(sendotp(userdata.email,navigate))
    }
    
    const verifyotphandler=(e)=>{
        e.preventDefault();
        const {firstname,lastname,email,username,password}=userdata;
        console.log("fist name in vefiy otp=>",firstname)
        // dispatch(signup(navigate,firstname,lastname,accounttype,email,password,confirmpassword,otp))
    }

    useEffect(()=>{
        if(!userdata){
            // navigate("/signup");
        }
    },[])

  return (
    loading?(<div>Loading...</div>):(<div className='bg-black  w-full min-h-screen flex flex-col justify-center items-center'>
    <div className='w-[30%] '>
    <OtpInput
         value={otp}
         onChange={setotp}
         numInputs={6}
         renderInput={(props) => (
         <input											
            {...props}
             placeholder="-"
             style={{ boxShadow: "inset"}} 
             className="w-[50px] h-[40px] text-center rounded-md bg-gray-500 text-yellow-500 border-2 border-yellow-200 " />)}
        containerStyle={{justifyContent:"space-between",gap: "0 2px"}} 	
    />
    </div>
    <div onClick={resendotphandler} className='text-blue-800 mt-1 ml-[25%] cursor-pointer'>
        Resend OTP
    </div>
    <div className='w-full'><Custombutton 
        text={"Verify OTP"} 
        styles={"text-black bg-yellow-200 w-[30%] ml-[35%]"} 
        fun={verifyotphandler}/>
    </div>
</div>)
  )
}

export default Verifyotp
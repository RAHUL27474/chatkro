import React, { useState } from 'react'
import Custombutton from '../components/Custombutton'
import { FaRegEye } from "react-icons/fa6";
import { IoEyeOffSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
// import { resetpassword } from '../services/Authservices';


const Updatepassword = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();
    const location=useLocation();
    const [showpassword,setshowpassword]=useState(false);
    const [showconfirmpassword,setshowconfirmpassword]=useState(false);
    const [data,setdata]=useState({password:"" , confirmpassword:""});

    const passwordhandler=(e)=>{
        e.preventDefault();
        const {name}=e.target;
        setdata({...data,[name]:e.target.value})
        console.log("form data=>",data);
    }

    const setpasswordhandler=()=>{
        const {password,confirmpassword}=data;
        const token=location.pathname.split("/").at(-1);
        setdata({password:"",confirmpassword:""});
        // dispatch(resetpassword(password,confirmpassword,token,navigate))
    }


  return (
    <div className='bg-black text-white w-full h-screen'>
        <div className='flex flex-col w-[40%] mx-auto'>
            <div>
                Reset Password
            </div>
            <div>
                <div>
                    <label htmlFor='password'>Password <sup>*</sup></label>
                </div>
                <div>
                    <input 
                        className='text-black'
                        name='password'
                        id='password'
                        value={data.password}
                        type={`${showpassword? "text" :"password"}`}
                        onChange={passwordhandler}
                    /><span onClick={()=>setshowpassword(!showpassword)}>{showpassword? <FaRegEye/> : <IoEyeOffSharp/>}</span>
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor='confirmpassword'>Confirm Password <sup>*</sup></label>
                </div>
                <div>
                    <input 
                        className='text-black'
                        name='confirmpassword'
                        id='confirmpassword'
                        value={data.confirmpassword}
                        type={`${showconfirmpassword ? "text" :"password"}`}
                        onChange={passwordhandler}
                    /><span onClick={()=>setshowconfirmpassword(!showconfirmpassword)}>{showconfirmpassword? <FaRegEye/> : <IoEyeOffSharp/>}</span>
                </div>
            </div>
            <div>
                <div className=''><Custombutton text={"Set Password"} styles={"w-full bg-yellow-200 text-black"} fun={setpasswordhandler}/></div>
            </div>
        </div>
    </div>
  )
}

export default Updatepassword
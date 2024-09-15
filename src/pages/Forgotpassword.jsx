import React, { useState } from 'react'
import Custombutton from '../components/Custombutton';
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
// import { sentforgotpasswordlink } from '../services/Authservices';
import { Link } from 'react-router-dom';

const Forgotpassword = () => {

    const dispatch=useDispatch()
    const [email,setemail]=useState("");
    const [emailsent,setemailsent]=useState(false);

    const linksubmithandler=()=>{
        setemailsent(true);
        // dispatch(sentforgotpasswordlink(email));

    }

  return (
    <div className='bg-black text-white w-full h-screen'>
        <div className='w-[40%] flex flex-col mx-auto items-start'>
            <div>
                {!emailsent ? (<div>Reset Your Password</div>):(<div>Check Email</div>)}
            </div>
            <div>
                {!emailsent ? (<div>Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery</div>):(<div>We have sent the reset email to {email}</div>)}
            </div>
            <div>
                {!emailsent ? 
                (<div>
                    <div>
                        <label htmlFor='email'>Emali Address <sup>*</sup></label><br/>
                        <input
                            name='email'
                            id='email'
                            type='email'
                            placeholder='Enter EmailAddress'
                            value={email}
                            
                            onChange={(e)=>{setemail(e.target.value)}}
                        />

                    </div>
                </div>):(<div></div>)}
            </div>


            <div className='w-full'>
            {!emailsent? (<div><Custombutton text={"Sent Email"} styles={"w-full bg-yellow-200 text-black"} fun={linksubmithandler}/></div>):(<div><Custombutton text={"Resent Email"} styles={"w-full text-black bg-yellow-200"} fun={linksubmithandler}/></div>)}
                
            </div>
            <div className='flex flex-row gap-1 p-1 bg-blue-500 text-black mt-1 rounded-md'><div className='mt-1'><FaArrowLeft/></div><Link to="/login"><div>Back to Login</div></Link></div>
            

        </div>
    </div>
  )
}

export default Forgotpassword
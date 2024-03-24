import React from 'react'
import { app } from "../firebase"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { useDispatch } from 'react-redux'
import { signInSuccess,signInFailure } from '../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { AiFillGoogleCircle } from 'react-icons/ai'
const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const res = await signInWithPopup(auth, provider);
      console.log("response from google Auth", res);
      const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/googleAuth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: res.user.displayName,
          email: res.user.email,
          photo: res.user.photoURL
        }),
      });
      console.log(Response);
      if (Response.status == 200) {
        Response.json().then((data) => {
          toast.success(data.message);
          dispatch(signInSuccess(data.user));
          //console.log(res.message);
        }).catch((err) => {
          console.log(err);
        })
        navigate("/");
      }
      else {
        Response.json().then((data) => {
          toast.error(data.message);
          dispatch(signInFailure(data.message));
          //console.log(res.message);
        }).catch((err) => {
          console.log(err);
        })
      }
    } catch (err) {
      toast.error("Server error");
      console.log(err);
    }
  }
  return (
    < div className='flex flex-row border  justify-center items-center border-sky-500  shadow-lg p-[4px] rounded-[10px] ' onClick={()=>{handleGoogleAuth()}}>
      <span className="text-sky-500"> <pre>Continue with </pre>  </span>
      <AiFillGoogleCircle className=' h-4 w-4 text-black'></AiFillGoogleCircle >
    </div>
  )
}


export default OAuth;

import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react';
import {Button, TextInput,Label} from 'flowbite-react'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth'
import { useForm } from "react-hook-form";
import { signInstart, signInFailure, signInSuccess } from '../redux/slice/userSlice';
const LoginPage = () => {
  const { handleSubmit } = useForm();
  const [formData, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function chgHandler(event) {
    const { name, value } = event.target;
    setData((prev) => (
      {
        ...prev, [name]: value
      }
    ));
  }
  async function login(e) {
    e.preventDefault();
    console.log("HEllo");
    try {
      dispatch(signInstart());
      const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      })
      // if(data.status==200)
      // {
      //     toast.success(data.message);
      //     navigate("/login");
      // }
      // else{
      //     toast.error(data.message);
      // }
      // console.log(Response);

      if (Response.status == 200) {
        Response.json().then((res) => {
          toast.success(res.message);
          dispatch(signInSuccess(res.user));
          navigate("/");
          //console.log(res.message);
        }).catch((err) => {
          console.log(err);
        })

      }
      else {
        Response.json().then((res) => {
          toast.error(res.message);
          dispatch(signInFailure(res.message));
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
    <div className='flex justify-center flex-wrap container place-items-center min-h-screen border-box w-[98vw] '>
      <div className='flex text-[1vw] gap-[40px] rounded-[20px] shadow-lg  p-[30px] place-items-center box-border w-[40vw]  flex-col'>
        <h1 className='font-[700] text-[4vw] text-sky-400'>Login</h1>
        <form className='flex  flex-col gap-4 w-[30vw]' onSubmit={login}>
            <div className='text-gray-400'>
              <label id='email' >Enter your email</label>
              <TextInput 
                type='email'
                placeholder='name@company.com'
                id='email'
                name='email'
                value={formData.email}
                onChange={chgHandler}
              />
            </div>
            <div className='text-gray-400'>
            <label id='email' >Enter your password</label>
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                name='password'
                value={formData.password}
                onChange={chgHandler}
              />
            </div>
          <div className='flex place-items-center flex-col gap-2  '>

            <Button type='submit' gradientDuoTone="greenToBlue">Sign in</Button>
            <div className='text-gray-500 text-[10px]'>OR</div>
            <NavLink to="/Register"><button className='border w-full  text-sky-500 border-sky-500 shadow-lg p-[4px] rounded-[10px] ' >Create an account</button></NavLink>
            <OAuth />
          </div>
        </form>

      </div>
    </div>
  )
}

export default LoginPage;

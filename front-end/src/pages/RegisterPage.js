import {React, Component}  from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {useForm} from 'react-hook-form';
import { TextInput,Button } from 'flowbite-react';
const RegisterPage = () =>{
    const navigate=useNavigate();
    const {handleSubmit}=useForm();
    const [formData, setData] = useState({ name: "",email: "", password: "" });
    function chgHandler(event) {
        const { name, value } = event.target;
        //console.log(event);
        setData((prev) => (
            {
                ...prev, [name]: value
            }));
    }
    async function register()
    {
      console.log("HEllo");
        const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/signup`,{
              method: "POST",
              headers:{
                  "Content-Type": "application/json",                
                'Accept': 'application/json',
              },
              body: JSON.stringify({...formData}),
            }).then((res)=>{
            return res.json();
          }).then((data)=>{
            console.log(data.status);
            if(data.status==200)
            {
                toast.success(data.message);
                navigate("/login");
            }
            else{
                toast.error(data.message);
            }
          }).catch((err)=>{
            toast.error("Server error");
            console.log(err);
          })

    }
    return (
      <div className='flex flex-wrap justify-center  place-items-center min-h-screen w-[98vw] mt-2 border-box '>
        <div className='flex md:text-[25px] text-[20px] gap-[40px] rounded-[20px] shadow-lg  p-[30px] place-items-center box-border w-[70vw]  flex-col'>
          <h1 className='font-[700] md:text-[52px] text-[42px] text-[rgb(101,217,182)]'>Register</h1>
          <form className='flex  flex-col gap-4 md:w-[30vw]' onSubmit={handleSubmit(register)}>
          <div className='text-gray-400'>
                <label id='email' >Enter your Name</label>
                <TextInput 
                  type='text'
                  placeholder='Name'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={chgHandler}
                />
              </div>
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
              <label id='email' >Create password</label>
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
  
              <Button type='submit' gradientDuoTone="greenToBlue">Signup</Button>
              <div className='text-gray-500 text-[12px]'>OR</div>
              <NavLink to="/login"><button className='border w-full text-[14px] text-sky-500 border-sky-500 shadow-lg p-[4px] rounded-[10px] ' >Already have an account</button></NavLink>
              <button><OAuth /></button>
            </div>
          </form>
  
        </div>
      </div>
    )
    return (
        <div className='flex justify-center place-items-center h-[90vh] w-[100vw] '>
                <h1 className='font-[1000] text-[3vw] text-[#239052]'>Register</h1>
            <form onSubmit={handleSubmit(register)} className='flex text-[1vw] bg-white gap-[20px] rounded-[20px] shadow-lg border p-[30px] place-items-center box-border h-fit w-fit flex-col'>
                <input className='border-2 w-[18vw] bg-[rgb(251,249,249)] text-[#279c6d] p-1 rounded-[10px]' type="text" placeholder='Enter Name' value={formData.name} name='name' onChange={chgHandler} />
                <input className='border-2 w-[18vw] bg-[rgb(251,249,249)] text-[#279c6d] p-1 rounded-[10px]' type="email" placeholder='Enter Email' value={formData.email} name='email' onChange={chgHandler} required/>
                <input className='border-2 w-[18vw] bg-[rgb(251,249,249)] text-[#8ec0ac] p-1 rounded-[10px]' type="Password" placeholder='Enter Password' value={formData.password} name='password' onChange={chgHandler} required/>
                <div className='flex place-items-center flex-col gap-2 text-white '>
                    <button className='w-full p-1 bg-[#1abb6d] shadow-lg border rounded-[10px] ' >Signup</button>
                    <div className='text-black text-[10px]'>OR</div>
                    <NavLink to="/login"><button className='border w-full  text-sky-500 border-sky-500 shadow-lg p-[4px] rounded-[10px] '>Already have an account</button></NavLink>
                    <OAuth/>
                </div>

            </form>
        </div>
    )
}

export default RegisterPage

import React from 'react'
import HomePost from '../components/HomePost'
import { Link } from 'react-router-dom'
import {Button} from "flowbite-react"
const Home = () => {
  return (
    <div className='w-full'>
      <div className='flex justify-center items-center flex-col m-4 mt-[20vh]'>
      <p className='text-center flex-col text-[30px]'>
        Share your thoughts through the canvas of BlogPost
      </p>
      <p className='text-center mt-8 flex-col  text-[20px]'>
      <Link to="/createBlog">
        <Button 
          gradientDuoTone="greenToBlue"
        >Create</Button>
        </Link>
      </p>
      
      </div>
      <HomePost/>
      
    </div>
  )
}

export default Home

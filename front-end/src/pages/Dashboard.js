import React from 'react'
import DashSidebar from '../components/DashSidebar'
import { useLocation } from 'react-router-dom'
import { useEffect,useState } from 'react'
import DashProfile from '../components/DashProfile'
import DashBlogs from '../components/DashBlogs'
const Dashboard = () => {
  const location=useLocation();
  const [tab,setTab]=useState('profile');
  useEffect(()=>{
   const params=new URLSearchParams(location.search);
   const tabUrl=params.get('tab');
   if(tabUrl)
   {
    setTab(tabUrl);
   } 
  },[location.search]);
  return (
    <div className='min-h-screen flex  flex-col md:flex-row'>
      <div className='md:w-56 '>
      <DashSidebar/>
      </div>
        {
          tab==='profile' && <DashProfile/>
        } 
        {
          tab==='blogs' && <DashBlogs/>
        } 

    </div>
  )
}

export default Dashboard

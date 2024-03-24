import { Sidebar } from 'flowbite-react'
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import {signOut} from "../redux/slice/userSlice"
import { HiUser, HiArrowSmRight, HiDocumentText } from 'react-icons/hi'
import { useDispatch} from 'react-redux';
import { IoIosCreate } from "react-icons/io";
const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const navigate = useNavigate();;
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tabUrl = params.get('tab');
        if (tabUrl) {
            setTab(tabUrl);
        }
    }, [location.search]);
    const dispatch=useDispatch();
    const handleSignOut=async()=>{
        dispatch(signOut());
        navigate('/login');
      }
      
    return (
        <Sidebar className='w-full md:w-56 '  >
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=blogs">
                        <Sidebar.Item active={tab === 'blogs'} icon={HiDocumentText} labelColor='dark' as='div'>
                            Blogs
                        </Sidebar.Item>
                    </Link>
                    <Link to="/createBlog">
                        <Sidebar.Item  icon={IoIosCreate} labelColor='dark' as='div'>
                            Create Blog
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item onClick={handleSignOut}  icon={HiArrowSmRight} className='Cusor-pointer' as='div'>
                    Sign Out
                </Sidebar.Item> 
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar

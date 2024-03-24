import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {Modal,Button} from "flowbite-react";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const DashBlogs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userBlogs, setUserBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMore,setShowMore]=useState(true);
  const [blogId,setBlogId]=useState("");
  useEffect(() => {
    const fetchD=async () => {
      try {
        const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs?userId=${currentUser._id}`);
        //console.log(Response);
        if(Response.status == 200){
          Response.json().then((res) => {
            setUserBlogs(res.blogs);
            if(res.blogs.length<9)
            {
              setShowMore(false);
            }
            //console.log(res.message);
          }).catch((err) =>{
            console.log(err);
          })
        }
        else {
          toast.error("fail to fetch data");
        }
      }
      catch (err) {
        console.log(err);
      }
    };
    fetchD();
  }, []);
  const handleShowMore=async ()=>{
    const startIndex=userBlogs.length;
    try {
      const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs?userId=${currentUser._id}&startIndex=${startIndex}`);
      //console.log(Response);
      if (Response.status == 200){
        Response.json().then((res) => {
          setUserBlogs((prev)=>[...prev,...res.blogs]);
          if(res.blogs.length<9)
          {
            setShowMore(false);
          }
          //console.log(res.message);
        }).catch((err) => {
          //console.log(err);
        })
      }
      else {
        toast.error("fail to fetch data");

      }
    }
    catch (err) {
//consol.log(err);
    }

  }
  const handleDeleteBlog=async()=>{
    setShowModal(false);
    try{
      const res=await fetch(`${process.env.REACT_APP_BASE_URL}/deleteBlog/${currentUser._id}/${blogId}`,{method:'DELETE'});
      if(res.status===200)
      {
        toast.success("Blog delete");
        setUserBlogs((prev)=>
          prev.filter((blog)=>blog._id!==blogId)
        )
      }
    }
    catch(err)
    {
      console.log(err);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        userBlogs.length > 0 ? (<>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userBlogs.map((blog,i) => (
              <Table.Body key={i} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(blog.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/blogs/blog/${blog._id}`}>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/blogs/blog/${blog._id}`}
                    >
                      {blog.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{blog.category[0]}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={()=>{
                        setShowModal(true);
                        setBlogId(blog._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/updateBlog/${blog._id}`}
                    >
                    <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>) : (
          <p className='flex justify-center text-green-500 font-bold text-xl'>No blog yet</p>
        )
      }
      <Modal show={showModal} 
      onClose={()=>setShowModal(false)}
      popup size='md'
      >
        <Modal.Header/>
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400  mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500'>
              Are you sure  you want to delete the blog?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteBlog}>
                Yes
              </Button>
              <Button color='gray' onClick={()=>setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashBlogs

import React, { useState, useEffect } from 'react'
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiEdit } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Spinner } from 'flowbite-react'
import toast from 'react-hot-toast'
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux'
import Comments from '../components/Comments'


const BlogDetails = () => {
    const { currentUser } = useSelector((state) => state.user)
    const { blogId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [blog, setBlog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [like,setLike]=useState(false);
    const [likes,setLikes]=useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(blogId);
        const fetchB = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs?blogId=${blogId}`, { method: 'GET' })
                const data = await res.json();
                if (res.status === 200) {
                    setBlog(data.blogs[0]);
                    setError(false);
                    if(data.blogs[0].likes.indexOf(currentUser._id)===-1)
                    {
                        setLike(false);
                        setLikes(data.blogs[0].likes.length);
                    }
                    else{
                        setLike(true);
                        setLikes(data.blogs[0].likes.length);
                    }
                }
                else {
                    setError(true);
                }
                setLoading(false);
            }
            catch (err) {
                setError(true);
                setLoading(false);
                toast.error("fail to fetch");
                console.log(err);
            }
        }
        fetchB();
    }, [blogId]);
    const handleDeleteBlog = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/deleteBlog/${currentUser._id}/${blogId}`, { method: 'DELETE' });
            if (res.status === 200) {
                toast.success("Blog delete");
                navigate("/createBlog");
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleLike = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs/${blogId}/likeBlog/${currentUser._id}`, {
                method: 'PUT',
            });
            if (res.ok){
                const data = await res.json();
                setLike(data.like);
                setLikes(data.blog.likes.length);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        loading ? (<div className="flex w-[98vw] mt-10 justify-center">
            <Spinner size='xl' />
        </div>) :
            (<div className="flex w-[98vw] mt-10 justify-center ">
                <div className="flex justify-center flex-col">
                    <article className="flex w-[70vw] flex-col ">
                        <div className='flex flex-row justify-between'>
                            <p className="mt-3 text-[25px] font-bold leading-6  group-hover:text-gray-600">
                                {blog.title}
                            </p>
                            <p className='flex flex-row gap-2 justify-center items-center'>
                                {currentUser && (
                                    <span className='flex flex-row justify-center items-center text-[12px]'>
                                      {like? (<AiFillLike style={{fontSize:'18px'}} onClick={handleLike}/>):
                                        (<AiOutlineLike style={{fontSize:'18px'}} onClick={handleLike}/>)
                                        }  
                                        {`${likes}`} 
                                    </span>
                                )}
                                {
                                    currentUser && currentUser._id === blog.userId._id && (<p className='flex flex-row gap-2'>

                                        <Link
                                            className='text-teal-500 hover:underline'
                                            to={`/updateBlog/${blog._id}`}
                                        >
                                            <BiEdit />
                                        </Link>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            <MdDelete />
                                        </span>
                                    </p>)
                                }
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-x-2">
                            <img src={blog.userId.photo} alt="user" className="h-6 w-6 rounded-full bg-gray-50" />
                            <h4 className="text-[10px] leading-6 font-semibold ">
                                {blog.userId.name}
                            </h4>
                        </div>
                        <img src={blog.image} className='h-[60vh] mt-2' alt="Nan" />
                        <div className="mt-4 flex items-center gap-x-4 text-xs">

                            {new Date(blog.updatedAt).toLocaleDateString()}

                        </div>
                        <div className='flex  mt-3'>{
                            blog.category.map((cat, i) => (
                                <div key={i} className='flex justify-center items-center space-x-2 mr-4 text-white bg-gray-400 px-2 py-1 rounded-md'>
                                    {cat}
                                </div>
                            ))
                        }
                        </div>
                        <div className='mt-[28px] mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: blog && blog.content }}>
                        </div>
                    </article>
                    <Comments blogId={blog._id} />
                    <Modal show={showModal}
                        onClose={() => setShowModal(false)}
                        popup size='md'
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className='text-center'>
                                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400  mb-4 mx-auto' />
                                <h3 className='mb-5 text-lg text-gray-500'>
                                    Are you sure  you want to delete your account?
                                </h3>
                                <div className='flex justify-center gap-4'>
                                    <Button color='failure' onClick={handleDeleteBlog}>
                                        Yes
                                    </Button>
                                    <Button color='gray' onClick={() => setShowModal(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>

            </div>
            )
    )
}

export default BlogDetails

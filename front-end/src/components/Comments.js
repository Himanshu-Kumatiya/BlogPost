import React, { useState, useEffect } from 'react'
import { BiEdit } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Spinner } from 'flowbite-react'
import {toast} from 'react-hot-toast'
import {Textarea, Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux'



const Comments = ({blogId}) => {
    const { currentUser } = useSelector((state) => state.user);
    const [loading,setLoading]=useState(true);
    const [deleteC, setDeleteC] = useState(null);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (comment.length > 200) {
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/comment/createComment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: comment,
            blogId,
            userId: currentUser._id,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setComment('');
          setCommentError(null);
          toast.success(data.message);
          setComments(data.comments );
        }
      } catch (error) {
        toast.error(data.message);
        setCommentError(error.message);
      }
    };
    useEffect(() => {
        console.log(blogId);
        
        const fetchB = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/comment/getComments/${blogId}`)
                const data = await res.json();
                if (res.status === 200) {
                    setComments(data.comments);
                    setCommentError(null);
                }
                else {
                    console.log(data.message);
                }
                setLoading(false);
            }
            catch (err) {
                setLoading(false);
                //toast.error("You need to Sign-In ");
                //console.log(err);
                setCommentError(err.message);
            }

        }
        if(currentUser)
        {
            fetchB();
        }
        
    }, [blogId]);
    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/comment/deleteComment/${deleteC}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.status === 200) {
                setComments(data.comments);
                toast.success(data.message);
            }
        }
        catch (err) {
            setLoading(false);
            toast.error("fail to fetch delete Comment");
        }
    }

    return (
        <>
            <div className='max-w-2xl mx-auto w-full p-3'>
                {currentUser ? (
                    <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                        <p>Signed in as:</p>
                        <img
                            className='h-5 w-5 object-cover rounded-full'
                            src={currentUser.photo}
                            alt=''
                        />
                        <Link
                            to={'/dashboard?tab=profile'}
                            className='text-xs text-cyan-600 hover:underline'
                        >
                            @{currentUser.name}
                        </Link>
                    </div>
                ) : (
                    <div className='text-sm text-teal-500 my-5 flex gap-1'>
                        You must be signed in to comment.
                        <Link className='text-blue-500 hover:underline' to={'/login'}>
                            Sign In
                        </Link>
                    </div>
                )}
                {currentUser && (
                    <form
                        onSubmit={handleSubmit}
                        className='border border-teal-500 rounded-md p-3'
                    >
                        <Textarea
                            placeholder='Add a comment...'
                            rows='3'
                            maxLength='200'
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        />
                        <div className='flex justify-between items-center mt-5'>
                            
                            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                                Submit
                            </Button>
                        </div>
                        {commentError && (
                            <Alert color='failure' className='mt-5'>
                                {commentError}
                            </Alert>
                        )}
                    </form>
                )}
                {comments.length === 0 ? (
                    <p className='text-sm my-5'>No comments yet!</p>
                ) : (
                    <>
                        <div className='text-sm my-5 flex items-center gap-1'>
                            <p>Comments</p>
                            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                                <p>{comments.length}</p>
                            </div>
                        </div>
                        {comments.map((c,i) => (
                            <p key={i} className='border rounded bg-gray-500 mt-4 p-[4px]'>
                            <p className='flex flex-row justify-between'>
                                <p className="relative mt-4 flex items-center gap-x-2">
                                    <img src={c.userId.photo} alt="" className="h-6 w-6 rounded-full bg-gray-50" />
                                    <h4 className="text-[10px] leading-6 font-semibold text-gray-900">
                                        {c.userId.name}
                                    </h4>
                                </p>
                                {currentUser && currentUser._id===c.userId._id && (<p className='flex flex-row gap-2'>
                                    <MdDelete onClick={() => {
                                        setShowModal(true);
                                        setDeleteC(c._id);
                                    }}/>
                                </p>)
                                }
                            </p>
                            <p className='px-4 mt-2'>{c.body}</p>
                        </p>
                        ))}
                    </>
                )}
            </div>

                <Modal show={showModal}
                    onClose={() => setShowModal(false)}
                    popup size='md'
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-10 w-10 text-gray-400  mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500'>
                                Are you sure  you want to delete the Comment?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteComment}>
                                    Yes
                                </Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
        </>
    )
}

export default Comments


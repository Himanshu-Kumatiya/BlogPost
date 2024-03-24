import React from 'react'
import { Link } from 'react-router-dom';
import { useState,useEffect ,useRef} from 'react';
import { getStorage, ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage';
import { app } from "../firebase";
import { TextInput, Button ,Alert, Modal, ModalBody} from 'flowbite-react';
import { useDispatch,useSelector } from 'react-redux';
import { signOut,updateFailure, updateStart,updateSuccess } from '../redux/slice/userSlice';
import { toast } from 'react-hot-toast';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
const DashProfile = () => {
  const { currentUser,  loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState('');
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    console.log("file",e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };
  
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime()+imageFile.name;
    const storageRef=ref(storage,"profile/"+fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {        
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              //console.log('Upload is paused');
              break;
            case 'running':
              //console.log('Upload is running');
              break;
          }
        },
        (error) => {
          setImageFileUploadError(
            'Could not upload image (File must be less than 2MB)'
            );
            setImageFileUrl(null);
            setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, photo: downloadURL });
          setImageFileUploading(false);
        });
      }
      
    )
  }
  const handleSubmit=async (e)=> {
    e.preventDefault();
    if(formData.length===0)
    {
      return;
    }
    try{
      dispatch(updateStart());
      const Response=await fetch(`${process.env.REACT_APP_BASE_URL}/user/update/${currentUser._id}`,{
        method:'PUT',
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      })
      //console.log(Response);
      if (Response.status == 200) {

        Response.json().then((res) => {
          toast.success(res.message);
          dispatch(updateSuccess(res.user));
          
          //console.log(res.message);
        }).catch((err) => {
          //console.log(err);
          dispatch(updateFailure(err));
        })
        
      }
      else {
        Response.json().then((res) => {
          toast.error(res.message);
          dispatch(updateFailure(res.message));
          //console.log(res.message);
        }).catch((err) => {
          console.log(err);
          dispatch(updateFailure(err));
        })
      }
    }catch(err){
      dispatch(updateFailure("Server error"));
      toast.error("Server error");
    }
  }
  
  const handleDeleteUser=async()=>{
    setShowModal(false);
    try{
      const Response=await fetch(`${process.env.REACT_APP_BASE_URL}/user/delete/${currentUser._id}`,{
        method:'DELETE'
      })
      //console.log(Response);
      if (Response.status == 200) {
        Response.json().then((res) => {
          toast.success(res.message);
          dispatch(signOut());
        }).catch((err) => {
          console.log(err);
        })
      }
      else {
        Response.json().then((res) => {
          toast.error(res.message);
        }).catch((err) => {
          console.log(err);
        })

      }
    }catch(err)
    {
      toast.error("Unable to delete")
    }
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Edit</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {/* {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )} */}
          <img
            src={imageFileUrl || currentUser.photo}
            alt='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] `}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type='text'
          id='name'
          placeholder='Name'
          defaultValue={currentUser.name}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone="greenToBlue"
          disabled={imageFileUploading}
        >
          {imageFileUploading ? 'Loading...' : 'Update'}
        </Button>
        {/* {(
          <Link to={'/createBlog'}>
            <Button
              type='button'
              gradientMonochrome="success"
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )} */}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span  onClick={()=>{setShowModal(true)}}  className='cursor-pointer'>
          Delete Account
        </span>
        
      </div>
      <Modal show={showModal} 
      onClose={()=>setShowModal(false0)}
      popup size='md'
      >
        <Modal.Header/>
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400  mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500'>
              Are you sure  you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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

export default DashProfile

import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Alert, TextInput, Button, FileInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-hot-toast"
import { RxCrossCircled } from "react-icons/rx";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
const UpdateBlog = () => {

  const { currentUser } = useSelector((state) => state.user);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [file, setFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchB = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs?blogId=${blogId}`);
        const data = await res.json();
        if (res.status === 200) {
          console.log(data.blogs[0]);
          setFormData(data.blogs[0]);
          setCats(data.blogs[0].category);
        }
        else {
          toast.error("fail to fetch blog")
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchB();
  }, [blogId]);

  const deleteCategory = (i) => {
    let updatedCats = [...cats]
    updatedCats.splice(i, 1);
    setCats(updatedCats)

  }

  useEffect(() => {
    setFormData({ ...formData, category: cats })
  }, [cats])
  const addCategory = () => {
    if (cat == '') return;
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
    setCats(updatedCats);
  }




  const uploadImage = async () => {
    if (!file) {
      setImageFileUploadError('Please select an image');
      return;
    }
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "profile/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
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
          'Image upload failed'
        );
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          setFormData({ ...formData, image: downloadURL });
          setImageFileUploading(false);
        });
      }

    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.title || !formData.content) {
      toast.error("fill the content");
      return;
    }
    try {
      const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/updateBlog/${blogId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        body:JSON.stringify({...formData, userId: currentUser._id }),
      })
      //console.log(Response);
      if (Response.status == 200) {
        Response.json().then((res) => {
          toast.success(res.message);
          navigate(`/blogs/blog/${blogId}`);
          //console.log(res.message);
        }).catch((err) => {
          //console.log(err);
        })

      }
      else {
        Response.json().then((res) => {
          toast.error(res.message);
          //console.log(res.message);
        }).catch((err) => {
          console.log(err);
        })
      }
    } catch (err) {
      toast.error("Server error");
    }
  }

  return (
    currentUser ? (
      <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Edit Blog</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
              <TextInput value={cat} onChange={(e) => setCat(e.target.value)} className='flex-1' placeholder='Enter category' type="text" />
              <div onClick={() => { addCategory() }} className='bg-black text-white px-4 py-2 rounded font-semibold cursor-pointer'>Add</div>
            </div>

            {/* categories */}
            <div className='flex px-4 mt-3'>
              {cats?.map((c, i) => (
                <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-800 px-2 py-1 rounded-md'>
                  <p>{c}</p>
                  <p onClick={() => deleteCategory(i)} className='text-whitecursor-pointer p-1 text-sm'><RxCrossCircled /></p>
                </div>
              ))}

            </div>
          </div>

          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput
              type='file'
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              size='sm'
              outline
              onClick={uploadImage}
              disabled={imageFileUploading}
            >
              {imageFileUploading ? (
                'uploading Image'
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>
          {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
          {formData.image && (
            <img
              src={formData.image}
              alt='upload'
              className='w-full h-72 object-cover'
            />
          )}
          <ReactQuill
            theme='snow'
            placeholder='Write something...'
            className='h-72 mb-12'
            required
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
            value={formData.content}
          />
          <Button type='submit' gradientDuoTone='greenToBlue'>
            Update Blog
          </Button>
        </form>
      </div>
    )
      : <Navigate to='/login' />
  )
}

export default UpdateBlog;

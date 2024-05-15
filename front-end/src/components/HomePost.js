import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Homeblog(){
  const { currentUser } = useSelector((state) => state.user);
  const [userBlogs, setUserBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMore,setShowMore]=useState(true);
  const [blogId,setBlogId]=useState("");
  useEffect(() => {
    const fetchD=async () => {
      try {
         const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs`,//{
        //   mode: 'no-cors',
        //   credentials: 'include',
        //   method: 'GET',}
    );
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
      const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs?startIndex=${startIndex}`);
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
        //console.log(err);
    }

  }
  
  return (
    <div className="mx-6 flex flex-wrap justify-center gap-x-16 gap-y-16 sm:mt-16 sm:pt-16  mb-[100px] ">
    {
        userBlogs.length > 0 ? (<>
            {userBlogs.map((blog,i) => (
                          
                              <Link key={i} to={`/blogs/blog/${blog._id}`}>
                              <article  className="flex md:w-[320px] w-[280px] flex-col  justify-between rounded-[10px] p-[10px] hover:bg-[rgb(19,26,47)] ">
                                <div className='flex justify-center'>
                                <img src={blog.image} className=' w-[250px] h-[250px] md:w-[300px] md:h-[300px]   rounded-[10px]' alt="Nan" />
                                </div>
                               
                                  <div className="mt-4 flex flex-row flex-wrap justify-between  gap-x-2">
                                      <div className="flex gap-2 text-[12px] leading-6">
                                      <img src={blog.userId.photo} alt="" className="h-6 w-6 rounded-full " />
                                        <span className=''> {blog.userId.name}</span>   
                                      </div>
                                      <p className=" text-gray-500 text-[10px]">
                                      {new Date(blog.updatedAt).toLocaleDateString()}
                                      </p>
                                  </div>
                                  <div className="flex items-center gap-x-4 text-xs">
                                      
                                      <p className="flex mt-4 justify-center items-center space-x-1 font-medium ">
                                        {
                                          blog.category.map((cat,i)=>(
                                            <span key={i} className=' mr-1 bg-gray-300 text-gray-600 hover:bg-gray-100 px-1 py-1 rounded-md'>
                                                {cat}
                                            </span>
                                            ))
                                        }
                                      </p>
                                  </div>
                                  <div className="group relative">
                                      <h3 className="mt-3 text-lg font-semibold leading-6  text-gray-500">
                                        {blog.title}
                                      </h3>
                                      <div className='mt-2 h-[100px]   text-[12px] overflow-hidden leading-6 text-gray-500' dangerouslySetInnerHTML={{ __html: blog && (blog.content+'...') }}>
                                        </div>

                                  </div>
                              </article>
                              </Link>
                    ))
            }
          
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>) : (
        <div className="flex w-[98vw] mt-10 justify-center">
            <Spinner size='xl' />
        </div>
        )
      }
    </div>
  )
}


// export default function Homeblog() {
    
//     return (
//             <div className="mx-10 flex flex-wrap justify-center max-w-2xl gap-x-8 gap-y-16  sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none ">
//                 {blogs.map((blog) => (
//                     <Link to="/blogs/blog/2343">
//                     <article key={blog.id} className="flex w-[35vw] flex-col items-start justify-between">
//                         <img src={photo} className='' alt="Nan" />
//                         <div className="flex items-center gap-x-4 text-xs">
//                             <time dateTime={blog.datetime} className="text-gray-500">
//                                 {blog.date}
//                             </time>
//                             <p className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
//                                 {blog.category.title}
//                             </p>
//                         </div>
//                         <div className="group relative">
//                             <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
//                                 <a href={blog.href}>
//                                     <span className="absolute inset-0" />
//                                     {blog.title}
//                                 </a>
//                             </h3>
//                             <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{blog.description}</p>
//                         </div>
//                         <div className="relative mt-8 flex items-center gap-x-2">
//                             <img src={blog.author.imageUrl} alt="" className="h-6 w-6 rounded-full bg-gray-50" />
//                             <div className="text-[10px] leading-6">
//                                 <p className="font-semibold text-gray-900">
//                                     <a href={blog.author.href}>
//                                         <span className="absolute inset-0" />
//                                         {blog.author.name}
//                                     </a>
//                                 </p>
//                             </div>
//                         </div>
//                     </article>
//                     </Link>
//                 ))}
//             </div>
//     )
// }

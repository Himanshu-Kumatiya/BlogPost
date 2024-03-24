import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

function Search(){
  const { currentUser } = useSelector((state) => state.user);
  const [userBlogs, setUserBlogs] = useState([]);
  const [showMore,setShowMore]=useState(true);
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fetchD=async () => {

      const searchQuery = urlParams.toString();
      try {
        const Response = await fetch(`${process.env.REACT_APP_BASE_URL}/getBlogs?${searchQuery}`);
        console.log(Response);
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
  }, [location.search]);
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
    <div className="mx-10 flex flex-wrap justify-center max-w-2xl gap-x-8 gap-y-16  sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none mb-[40px] ">
    {
        userBlogs.length > 0 ? (<>
            {userBlogs.map((blog,i) => (
                          
                              <Link to={`/blogs/blog/${blog._id}`}>
                              <article key={i} className="flex w-[28vw] flex-col items-start justify-between rounded-[10px] p-[10px] hover:bg-[rgb(19,26,47)] ">
                                <img src={blog.image} className='w-[28vw] h-[24vh] rounded-[10px]' alt="Nan" />
                                  <div className="mt-4 flex flex-row flex-wrap justify-between w-[26vw] items-center  gap-x-2">
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
                                      <div className='mt-2  text-[12px] leading-6 text-gray-500' dangerouslySetInnerHTML={{ __html: blog && (blog.content.slice(0,400)+'...') }}>
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
            <span>No Blog Found</span>
        </div>
        )
      }
    </div>
  )
}


export default Search

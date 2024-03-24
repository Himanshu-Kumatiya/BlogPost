const exp=require("express");
const router=exp.Router();
const {auth} =require("../middleware/auth");
const {login,signup,googleAuth, signOut}=require("../controllers/auth");
const {updateUser, deleteUser}=require("../controllers/updateUser");
const {createComment,getComments, deleteComment}=require("../controllers/comment");
const {createBlog, getBlogs,deleteBlog, updateBlog}=require("../controllers/post");
const {likeBlog} =require("../controllers/likeBlog");
router.post("/signup",signup);
router.post("/login",login);
router.post("/signOut",signOut);
router.post("/googleAuth",googleAuth);
router.put("/user/update/:userId",auth,updateUser);
router.delete("/user/delete/:userId",auth,deleteUser);
router.post("/createBlog",auth,createBlog);
router.post("/comment/createComment",auth,createComment);
router.delete("/comment/deleteComment/:commentId",auth,deleteComment);
router.get("/comment/getComments/:blogId",auth,getComments);
router.get("/getBlogs",getBlogs);
router.put("/getBlogs/:blogId/likeBlog/:userId",auth,likeBlog);
router.put("/updateBlog/:blogId",auth,updateBlog);

router.delete("/deleteBlog/:userId/:blogId",auth,deleteBlog);

module.exports=router;


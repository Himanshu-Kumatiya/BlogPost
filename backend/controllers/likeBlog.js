const blog=require("../models/post")
exports.likeBlog = async (req, res) => {
    try {
        const post=await blog.findById(req.params.blogId);
      const userIndex = post.likes.indexOf(req.params.userId);
      if (userIndex === -1) {
        post.likes.push(req.params.userId);
        await post.save();
        return res.status(200).json({
            success:true,
            like:true,
            blog:post
        });
      } 
      else {
        post.likes.splice(userIndex, 1);
      }
      await post.save();
      res.status(200).json({
        success:true,
        like:false,
        blog:post
      });
    } catch (error) {
        res.status(403).json({
            message:"fail to connect"
          });
    }
  };
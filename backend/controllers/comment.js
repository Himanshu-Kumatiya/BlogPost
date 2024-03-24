const Comment = require("../models/comments");
const blog = require("../models/post");
exports.createComment = async (req, res) => {
    const { userId, body, blogId } = req.body;
    const newPost = new Comment({
        userId, body, blogId
    });
    try {
        const savedPost = await newPost.save();
        console.log(savedPost);
        await blog.updateOne({ _id: blogId }, { $push: { comments: savedPost._id } }, { upsert: true });
        const bComments = await Comment.find({ blogId }).sort({
            createdAt: -1,
          }).populate("userId").exec();
        res.status(200).json({
            success: true,
            comments:bComments,
            message: "Comment created"
        })
    } catch (err) {
        console.log(err)
        res.status(403).json({
            success: false,
            
            message: "Unable to create comment"
        })
    }
}

exports.getComments = async (req, res) => {
    try {
        const bComments = await Comment.find({ blogId: req.params.blogId }).sort({
            createdAt: -1, 
          }).populate("userId").exec();
        res.status(200).json({
            success: true,
            comments: bComments,
        });
    } catch (err) {
        console.log(err)
        res.status(403).json({
            success: false,
            message: "Fail to fetch"
        })
    };
}
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(403).json({
                success: false,
                message: "Comment not found"
            }) 
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        await blog.updateOne({ _id: comment.blogId },{ $pull: { comments:req.params.commentId } });
        const bComments = await Comment.find({blogId: comment.blogId }).sort({
            createdAt: -1,
          }).populate("userId").exec();
        res.status(200).json({
            success: true,
            comments:bComments,
            message: "Comment has been deleted"
        })
    } catch (error) {
        res.status(403).json({
            success: false,
            message: "Fail to fetch"
        })
    }
};

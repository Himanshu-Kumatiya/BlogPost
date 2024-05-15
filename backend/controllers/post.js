const post = require("../models/post");
const User = require("../models/user");
exports.createBlog = async (req, res) => {
    const { userId, content, title, image, category } = req.body;
    const newPost = new post({
        userId, content, title, image, category
    });
    try {
        const savedPost = await newPost.save();
        console.log("savedPost",savedPost);
        if (category) {
            category.forEach(async (v) => {
                try {
                    // const cat=new Category({name:v});
                    // const newCat=await cat.save();
                    // const p=await Category.find({name:v});
                    // if(!p || !p.post.includes(userId)){
                    await Category.updateOne({ name: v }, { $push: { post: savedPost._id } }, { upsert: true });
                    //}
                }
                catch (err) {
                    console.log(err);
                }
            });
        }
        res.status(200).json({
            success: true,
            data: savedPost,
            message: "Your blog have uploaded"
        })
    } catch (err) {
        console.log(err)
        res.status(403).json({
            success: false,
            message: "Create a unique title"
        })
    }
}
exports.getBlogs = async (req, res) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    try {
        const savedPost =await post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: { $all: [req.query.category] } }),
            ...(req.query.blogId && { _id: req.query.blogId }),
            ...(req.query.searchTerm && {
                $or: [
                  { title: { $regex: req.query.searchTerm, $options: 'i' } },
                  { content: { $regex: req.query.searchTerm, $options: 'i' } },
                  { category: { $all: [req.query.searchTerm] } }
                ],
              }),
        }).sort({ updatedAt: 1 }).skip(startIndex).limit(limit).populate("userId").exec();
        //const user=await User.find({_id: savedPost.userId})
        //console.log("fetched blog",savedPost);
        //res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            success: true,
            blogs: savedPost,
        });
    } catch (err){
        console.log(err)
        res.status(403).json({
            success: false,
            message: "Fail to fetch"
        })
    }
}

exports.deleteBlog = async (req, res) => {
    if (req.user.id != req.params.userId) {
        return res.status(403).json({ message: "Unauthorized user" });
    }
    try {
        await post.findByIdAndDelete(req.params.blogId);
        res.status(200).json({
            success: true,
            message: "Blog deleted"
        });
    } catch (err) {
        console.log(err)
        res.status(403).json({
            success: false,
            message: "Fail to fetch"
        })
    }
}

exports.updateBlog = async (req, res) => {
    if (req.user.id != req.body.userId) {
        return res.status(403).json({ message: "Unauthorized user" });
    }
    try {
        const updatedPost = await post.findByIdAndUpdate(req.params.blogId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image
                }
            }, { new: true }
        );
        console.log(updatedPost);
        res.status(200).json({
            success: true,
            blog: updatedPost,
            message: "Blog updated"
        });
    } catch (err) {
        console.log(err)
        res.status(403).json({
            success: false,
            message: "Fail to fetch"
        })
    }
}

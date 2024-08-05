import Post from "../models/Post.js"
import User from "../models/User.js";

//CREATE POST
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picturePath,
            userPicturePath: user.picturePath,
            likes: {}, //because post starts with 0 likes
            comments: []
        })
        await newPost.save();  //save in mongodb

        const post = await Post.find();   //grab all the saved posts
        res.status(201).json(post);   //return them to frontend so that the new feed is updated with that person's post
    } catch(err) {
        res.status(409).json({ error: err.message});
    }
}

//READ (Grab posts of everyone)
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch(err) {
        res.status(404).json({ error: err.message});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.status(200).json(posts);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}


//UPDATE
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id); //grabbing the post information
        const isLiked = post.likes.get(userId);  //if likes contains the userId, it means that particular post is liked by the user

        if(isLiked) {
            post.likes.delete(userId);  //unlike if already liked
        } else {
            post.likes.set(userId, true);
        }
        
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

//POST COMMENT
export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        const post = await Post.findById(id);

        post.comments.push(value);

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            post,
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}
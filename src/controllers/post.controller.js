const postModel = require('../model/post.model');
const ImageKit = require('@imagekit/nodejs');
const { toFile } = require('@imagekit/nodejs');
// Configure ImageKit SDK with environment variables
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Create a new post
 * - Validates JWT token from cookies
 * - Uploads image to ImageKit
 * - Saves post in MongoDB with caption, image URL, and user ID
 */
async function createPostController(req, res) {

    if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
    }

    try {
        // Upload image to ImageKit
        const file = await imagekit.files.upload({
           file: await toFile(req.file.buffer, req.file.originalname),
            fileName: "Test",
            folder: "Insta-clone"
        });

        // Save post in DB
        const post = await postModel.create({
            caption: req.body.caption,
            imgUrl: file.url,
            user: req.user.id
        });

        return res.status(201).json({
            message: "Post created successfully.",
            post
        });
    } catch (err) {
        return res.status(500).json({ message: "Error creating post", error: err.message });
    }
}

/**
 * Get all posts for the authenticated user
 * - Validates JWT token
 * - Fetches posts from MongoDB by user ID
 */
async function getPostController(req, res) {
    const userId = req.user.id;

    try {
        const posts = await postModel.find({ user: userId });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching posts",
            error: err.message,
        });
    }
}

/**
 * Get details of a specific post
 * - Validates JWT token
 * - Finds post by ID
 * - Ensures the post belongs to the requesting user
 */
async function getPostDetailsController(req, res) {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        const post = await postModel.findOne({
            _id: postId,
            user: userId,
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found or unauthorized",
            });
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            post,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching post details",
            error: err.message,
        });
    }
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController
};
const postModel = require('../model/post.model');
const ImageKit = require('@imagekit/nodejs');
const { toFile } = require('@imagekit/nodejs');
const jwt = require('jsonwebtoken');

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
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Token not provided. Unauthorized access" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "User not authorized" });
    }

    try {
        // Upload image to ImageKit
        const file = await imagekit.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), 'file'),
            fileName: "Test",
            folder: "Insta-clone"
        });

        // Save post in DB
        const post = await postModel.create({
            caption: req.body.caption,
            imgUrl: file.url,
            user: decoded.id
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
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Token invalid" });
    }

    try {
        const posts = await postModel.find({ user: decoded.id });
        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching posts", error: err.message });
    }
}

/**
 * Get details of a specific post
 * - Validates JWT token
 * - Finds post by ID
 * - Ensures the post belongs to the requesting user
 */
async function getPostDetailsController(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.id;
    const postId = req.params.postId;

    try {
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found." 
            });
        }

        // Check ownership
        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden content" });
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            post
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching post details", error: err.message });
    }
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController
};
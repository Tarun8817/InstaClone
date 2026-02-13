const express = require("express");
const postRouter = express.Router()
const postController = require('../controllers/post.controller')
const multer = require('multer')
/**
 * POST /api/posts [protected]
 * --req.body={caption.image-file}
*/



postRouter.post('/',postController.createPostController)



module.exports = postRouter
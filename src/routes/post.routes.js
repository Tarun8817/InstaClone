const express = require("express");
const postRouter = express.Router()
const postController = require('../controllers/post.controller')
const multer = require('multer')
const upload = multer({storage:multer.memoryStorage()})


/**
 * POST /api/posts [protected]
 * --req.body={caption.image-file}
*/

postRouter.post('/',upload.single("image"),postController.createPostController)



/**
 * GET /api/posts/ [protected]
*/


postRouter.get("/",postController.getPostController)

/**
 * Get/posts/details/postid
 * --return an detail about specific post with id. also check whether the post belongs to the user that the request come from
*/

postRouter.get("/details/:postId",postController.getPostDetails)

module.exports = postRouter 
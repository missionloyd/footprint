const express = require("express");
const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

//create post
router.post(
  "", checkAuth, extractFile, PostController.createPost);

//update post
router.put(
  "/:id", checkAuth, extractFile, PostController.updatePost);

//paginator posts
router.get("", PostController.getPostsPerPage);

//map request
router.get("", PostController.getPosts);

//one post
router.get("/:id", PostController.getPost);

//delete one post
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;

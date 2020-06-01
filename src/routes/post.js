import express from "express"
import { postControllers } from "../controllers/post"
import { middleware } from "../utils/middleware"

const router = express.Router({ mergeParams: true })

// index
router.get("/", postControllers.getAllPosts)

// create
router.post("/", middleware.isLoggedIn, postControllers.createPost)

// new
router.get("/new", middleware.isLoggedIn, postControllers.newPostForm)

// show
router.get("/:postId", postControllers.getOnePost)

// edit
router.get(
  "/:postId/edit",
  middleware.checkPostOwnership,
  postControllers.editPost
)

// update
router.put(
  "/:postId",
  middleware.checkPostOwnership,
  postControllers.updatePost
)

// delete
router.delete(
  "/:postId",
  middleware.checkPostOwnership,
  postControllers.deletePost
)

export default router

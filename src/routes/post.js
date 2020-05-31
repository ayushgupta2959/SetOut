import express from "express"
import { postControllers } from "../controllers/post"
import middleware from "../utils/middleware"

const router = express.Router({ mergeParams: true })

// index
router.get("/", postControllers.getAll)

// create
router.post("/", middleware.isLoggedIn, postControllers.createOne)

// new
router.get("/new", middleware.isLoggedIn, postControllers.newPostForm)

// show
router.get("/:postId", postControllers.getOne)

// edit
router.get(
  "/:postId/edit",
  middleware.checkPostOwnership,
  postControllers.editPost
)

// update
router.put("/:id", middleware.checkPostOwnership, postControllers.updatePost)

// delete
router.delete("/:id", middleware.checkPostOwnership, postControllers.deletePost)

export default router

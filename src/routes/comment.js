import express from "express"
import { middleware } from "../utils/middleware"
import { commentControllers } from "../controllers/comment"
const router = express.Router({ mergeParams: true })

// new
router.get("/new", middleware.isLoggedIn, commentControllers.newCommentForm)

// create
router.post("/", middleware.isLoggedIn, commentControllers.createComment)

// edit
router.get(
  "/:commentId/edit",
  middleware.checkCommentOwnership,
  commentControllers.editComment
)

// update
router.put(
  "/:commentId",
  middleware.checkCommentOwnership,
  commentControllers.updateComment
)

// delete
router.delete(
  "/:commentId",
  middleware.checkCommentOwnership,
  commentControllers.deleteComment
)

export default router

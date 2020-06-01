import Post from "../models/post"
import Comment from "../models/comment"

const isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) next()
  else {
    res.redirect("/login")
  }
}

const checkPostOwnership = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const post = await Post.find({
        author: {
          id: req.user._id,
        },
        _id: req.params.postId,
      })

      if (!post) {
        res.redirect("/posts")
      }

      next()
    } else {
      res.redirect("/login")
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

const checkCommentOwnership = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const comment = Comment.find({
        author: {
          id: req.user._id,
        },
        _id: req.params.commentId,
      })
      if (!comment) {
        res.redirect("/posts")
      }
      next()
    } else {
      res.redirect("/login")
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

export const middleware = {
  isLoggedIn,
  checkPostOwnership,
  checkCommentOwnership,
}

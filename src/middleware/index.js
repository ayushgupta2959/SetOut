import Post from "../models/post"
import Comment from "../models/comment"

const middleware = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) return next()
    else {
      res.redirect("/login")
    }
  },

  checkPostOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Post.findById(req.params.id, (err, post) => {
        if (err) {
          console.log(err)
          res.redirect("/")
        } else if (post.author.id.equals(req.user._id)) {
          next()
        } else {
          console.log("you do not have the permission to edit")
          res.redirect("/")
        }
      })
    } else {
      console.log("not logged in")
      res.redirect("/")
    }
  },

  checkCommentOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
          console.log(err)
          res.redirect("/")
        } else {
          if (comment.author.id.equals(req.user._id)) {
            next()
          } else {
            console.log("Not authorized to do that")
            res.redirect("/")
          }
        }
      })
    } else {
      console.log("not logged in")
      res.redirect("/")
    }
  },
}

export default middleware

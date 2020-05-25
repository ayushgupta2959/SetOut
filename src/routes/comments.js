import express from "express"
import Post from "../models/post"
import Comment from "../models/comment"
import _ from "lodash"
import middleware from "../middleware/index"

const router = express.Router({ mergeParams: true })

// new
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err)
      res.redirect("/")
    } else {
      res.render("comments/new", { post: post })
    }
  })
})

// create
router.post("/", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err)
      res.redirect("/")
    } else {
      const text = req.body.text
      const author = {
        id: req.user._id,
        username: req.user.username,
      }
      const comment = {
        text: text,
        author: author,
      }
      Comment.create(comment, (err, comment) => {
        if (err) {
          console.log(err)
          res.redirect("/")
        } else {
          post.comments.push(comment)
          post.save()
          res.redirect("/posts/" + post._id)
        }
      })
    }
  })
})

// edit
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        console.log(err)
        res.redirect("/")
      } else {
        res.render("comments/edit", {
          post_id: req.params.id,
          comment: comment,
        })
      }
    })
  }
)

// update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  const comment = {
    text: req.body.text,
  }
  Comment.findByIdAndUpdate(req.params.comment_id, comment, (err, comment) => {
    if (err) {
      console.log(err)
      res.redirect("/")
    } else {
      res.redirect("/posts/" + req.params.id)
    }
  })
})

// delete
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err, comment) => {
    if (err) {
      console.log(err)
      res.redirect("/")
    } else {
      Post.findById(req.params.id, (err, post) => {
        if (err) {
          console.log(err)
          res.redirect("/")
        } else {
          post.comments = post.comments.filter(
            (postComment) => !_.isEqual(postComment, comment._id)
          )
          post.save()
        }
      })
      res.redirect("/posts/" + req.params.id)
    }
  })
})

export default router

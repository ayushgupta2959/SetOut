import Post from "../models/post"
import Comment from "../models/comment"
import _ from "lodash"

const newCommentForm = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).lean().exec()
    if (!post) {
      console.log("No post found")
      res.redirect("/posts")
    } else {
      res.render("comments/new", { post: post })
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      console.log("No post found")
      res.redirect("/posts")
    } else {
      const author = {
        id: req.user._id,
        username: req.user.username,
      }
      const newComment = {
        text: req.body.text,
        author: author,
      }
      const comment = await Comment.create(newComment)
      post.comments.push(comment)
      post.save()
      res.redirect("/posts/" + post._id)
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

const editComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      "author.id": req.user._id,
      _id: req.params.commentId,
    })
      .lean()
      .exec()

    if (!comment) {
      console.log("No comment found")
      res.redirect("/posts")
    } else {
      res.render("comments/edit", {
        post_id: req.params.postId,
        comment: comment,
      })
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

const updateComment = async (req, res) => {
  try {
    const oldComment = {
      text: req.body.text,
    }
    const comment = await Comment.findOneAndUpdate(
      {
        "author.id": req.user._id,
        _id: req.params.commentId,
      },
      oldComment,
      { new: true }
    )
      .lean()
      .exec()
    if (!comment) {
      console.log("No comment found")
      res.redirect("/posts")
    } else {
      res.redirect("/posts/" + req.params.postId)
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndRemove({
      "author.id": req.user._id,
      _id: req.params.commentId,
    })
      .lean()
      .exec()
    if (!comment) {
      console.log("No comment found")
      res.redirect("/posts/" + req.params.postId)
    } else {
      const post = await Post.findById(req.params.postId)
      if (!post) {
        console.log("No post found")
        res.redirect("/posts")
      } else {
        post.comments = await post.comments.filter(
          (postComment) => !_.isEqual(postComment, comment._id)
        )
        post.save()
        res.redirect("/posts/" + req.params.postId)
      }
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

export const commentControllers = {
  newCommentForm,
  createComment,
  editComment,
  updateComment,
  deleteComment,
}

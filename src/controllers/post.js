import Post from "../models/post"
import Comment from "../models/comment"
import { model } from "mongoose"

export const getAllPosts = () => async (req, res) => {
  try {
    const posts = await Post.find({}).lean().exec()
    res.render("posts/index", { message: "success", posts: posts })
  } catch (e) {
    console.log(e)
    res.render("posts/index", { message: "error", error: e, posts: [] })
  }
}

export const createOnePost = () => async (req, res) => {
  try {
    const author = {
      id: req.user._id,
      username: req.user.username,
    }
    const post = await Post.create({ ...req.body, author })
    res.redirect("/posts/" + post._id, { message: "success" })
  } catch (e) {
    console.log(e)
    res.redirect("/", { message: "error", error: e })
  }
}

export const newPostForm = () => async (req, res) => {
  res.render("posts/new")
}

export const getOnePost = () => async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("comments")
      .lean()
      .exec()
    if (!post) {
      res.redirect("/posts", { message: "error", error: "No Post Found" })
    }
    res.render("posts/show", { message: "success", post: post })
  } catch (e) {
    console.log(e)
    res.redirect("/", { message: "error", error: e })
  }
}

export const editPost = () => async (req, res) => {
  try {
    const post = await Post.find({
      author: {
        id: req.user._id,
      },
      _id: req.params.postId,
    })
      .lean()
      .exec()
    if (!post) {
      res.redirect("/posts", {
        message: "error",
        error: "Unable to edit the post",
      })
    }
    res.render("posts/edit", { message: "success", post: post })
  } catch (e) {
    console.log(e)
    res.redirect("/posts", { message: "error", error: e })
  }
}

export const updatePost = () => async (req, res) => {
  try {
    const post = await model
      .findOneAndUpdate(
        {
          author: {
            id: req.user._id,
          },
          _id: req.params.postId,
        },
        req.body.post,
        { new: true }
      )
      .lean()
      .exec()

    if (!post) {
      res.redirect("/posts", { message: "error", error: "No post found" })
    }
    res.redirect("/posts/" + post._id, { message: "success" })
  } catch (e) {
    console.log(e)
    res.redirect("/posts", { message: "error", error: e })
  }
}

export const deletePost = () => async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      author: {
        id: req.user._id,
      },
      id: req.params.postId,
    })
    if (!post) {
      res.redirect("/posts", { message: "error", error: "No post found" })
    }
    await Comment.deleteMany().where("_id").in(post.comments).exec()
    res.redirect("/posts", { message: "success" })
  } catch (e) {
    console.log(e)
    res.redirect("/posts", { message: "error", error: e })
  }
}

export const postControllers = () => ({
  getAll: getAllPosts(),
  createOne: createOnePost(),
  newPostForm: newPostForm(),
  getOne: getOnePost(),
  editPost: editPost(),
  updatePost: updatePost(),
  deletePost: deletePost(),
})

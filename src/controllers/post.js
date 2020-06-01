import Post from "../models/post"
import Comment from "../models/comment"

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).lean().exec()
    res.render("posts/index", { posts: posts })
  } catch (e) {
    console.log(e)
    res.render("posts/index", { posts: [] })
  }
}

const createPost = async (req, res) => {
  try {
    const author = {
      id: req.user._id,
      username: req.user.username,
    }
    const post = await Post.create({ ...req.body, author })
    if (!post) {
      console.log("No post found")
      res.redirect("/posts")
    } else {
      res.redirect("/posts/" + post._id)
    }
  } catch (e) {
    console.log(e)
    res.redirect("/")
  }
}

const newPostForm = async (req, res) => {
  res.render("posts/new")
}

const getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("comments")
      .lean()
      .exec()
    if (!post) {
      console.log("No post found")
      res.redirect("/posts")
    } else {
      res.render("posts/show", { post: post })
    }
  } catch (e) {
    console.log(e)
    res.redirect("/")
  }
}

const editPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      "author.id": req.user._id,
      _id: req.params.postId,
    })
      .lean()
      .exec()
    if (!post) {
      console.log("No post found")
      res.redirect("/posts")
    } else {
      res.render("posts/edit", { post: post })
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      {
        "author.id": req.user._id,
        _id: req.params.postId,
      },
      req.body.post,
      { new: true }
    )
      .lean()
      .exec()

    if (!post) {
      console.log("No post found")
      res.redirect("/posts")
    } else {
      res.redirect("/posts/" + post._id)
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndRemove({
      "author.id": req.user._id,
      _id: req.params.postId,
    })
      .lean()
      .exec()
    if (!post) {
      console.log("No post found")
      res.redirect("/posts")
    } else {
      await Comment.deleteMany().where("_id").in(post.comments).exec()
      res.redirect("/posts")
    }
  } catch (e) {
    console.log(e)
    res.redirect("/posts")
  }
}

export const postControllers = {
  getAllPosts,
  createPost,
  newPostForm,
  getOnePost,
  editPost,
  updatePost,
  deletePost,
}

const 
express     = require('express'),
router      = express.Router({mergeParams: true}),
Post        = require('../models/post'),
Comment     = require('../models/comment'),
middleware  = require('../middleware/index');

//index
router.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    if(err){
      console.log(err);
      res.render('posts/index', {posts: []});
    }
    else{
      res.render('posts/index', {posts: posts}); 
    }
  });
});

//create
router.post('/', middleware.isLoggedIn, (req, res) => {
  const title = req.body.title;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newPost = {
    title: title,
    image:image, 
    description: description,
    author: author
  };
  Post.create(newPost, (err, post) => {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      res.redirect('/');
    }
  });
});

//new
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('posts/new');
});

//show
router.get('/:id', (req, res) => {
  Post.findById(req.params.id).populate('comments').exec((err, post) => {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      res.render('posts/show', {post: post});
    }
  });
});

//edit
router.get('/:id/edit', middleware.checkPostOwnership, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      res.render('posts/edit', {post: post});
    }
  })
})

//update
router.put('/:id', middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) =>{
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      res.redirect('/posts/'+post._id);
    }
  })
})

//delete
router.delete('/:id', middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndDelete(req.params.id, (err, post) => {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      Comment.deleteMany().where("_id").in(post.comments).exec((err, comments) =>{
        if(err){
          console.log(err);
          res.redirect('/');
        }
        else{
          res.redirect('/');
        }
      })
    }
  })
})

module.exports = router;
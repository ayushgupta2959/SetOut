const 
express   = require('express'),
router    = express.Router({mergeParams: true}),
Post      = require('../models/post');

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
router.post('/', isLoggedIn, (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next()
  else{
    res.redirect('/login')
  }
}

module.exports = router
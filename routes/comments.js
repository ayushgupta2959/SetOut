const 
express   = require('express'),
router    = express.Router({mergeParams: true}),
Post      = require('../models/post'),
Comment   = require('../models/comment');

//new
router.get('/new', isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      res.render('comments/new', {post: post});
    }
  });
});

//create
router.post('/', isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if(err) {
      console.log(err);
      res.redirect('/');
    }
    else{
      const text = req.body.text;
      const author = {
        id: req.user._id,
        username: req.user.username
      }
      const comment = {
        text: text,
        author: author
      }
      Comment.create(comment, (err, comment) => {
        if(err){
          console.log(err);
          res.redirect('/');
        }
        else{
          post.comments.push(comment);
          post.save();
          res.redirect('/posts/'+  post._id);
        }
      });
    }
  });
});

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next()
  else{
    res.redirect('/login')
  }
}

module.exports = router;
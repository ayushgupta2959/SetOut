const 
express     = require('express'),
router      = express.Router({mergeParams: true}),
Post        = require('../models/post'),
Comment     = require('../models/comment');
_           = require('lodash'),
middleware  =  require('../middleware/index');

//new
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
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

//edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      res.render('comments/edit', {post_id: req.params.id, comment: comment});
    }
  })
})

//update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  const comment = {
    text: req.body.text
  }
  Comment.findByIdAndUpdate(req.params.comment_id, comment, (err, comment) => {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    else{
      res.redirect('/posts/'+req.params.id);
    }
  })
})

//delete
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err, comment) => {
    if(err){
      console.log(err)
      res.redirect('/');
    }
    else{
      Post.findById(req.params.id, (err, post) => {
        if(err){
          console.log(err);
          res.redirect('/');
        }
        else{
          post.comments = post.comments.filter(
            post_comment => !_.isEqual(post_comment, comment._id)
          )
          post.save();
        }
      })
      res.redirect('/posts/'+req.params.id);
    }
  })
})

module.exports = router;
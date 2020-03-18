const 
express           = require('express'),
app               = express(),
mongoose          = require('mongoose'),
path              = require('path'),
passport          = require('passport'),
LocalStrategy     = require('passport-local'),
User              = require('./models/user'),
expressSession    = require('express-session'),
methodOverride    = require('method-override'),
seedDB            = require('./seeds');

//some constants
const uri = process.env.DATABASE_URI;
const PORT = process.env.PORT || 2959;

// database setup
mongoose.connect(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false,
  useCreateIndex: true
}).then(
  () => {
    console.log('mongoose connected');
    // seedDB();
  },
  err => {
    console.log('mongoose connection failed => ' + err);
  }
);

// app setup
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));

//passport and express-session setup
app.use(expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//common middleware for all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

//routes
const
commentRoutes     = require('./routes/comments'),
postsRoutes       = require('./routes/posts'),
indexRoutes       = require('./routes/index')

app.use('/', indexRoutes);
app.use('/posts', postsRoutes);
app.use('/posts/:id/comments', commentRoutes);

app.listen(PORT, () => {
  console.log('Server started');
});
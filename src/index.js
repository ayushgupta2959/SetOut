import express from "express"
import mongoose from "mongoose"
import path from "path"
import passport from "passport"
import passportLocal from "passport-local"
import User from "./models/user"
import expressSession from "express-session"
import methodOverride from "method-override"
import commentRoutes from "./routes/comment"
import postsRoutes from "./routes/post"
import indexRoutes from "./routes/index"
// const seedDB = require("./seeds")

// some constants
const uri = process.env.DATABASE_URI
const PORT = process.env.PORT || 2959
const app = express()
const LocalStrategy = passportLocal.Strategy

// database setup
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("mongoose connected")
    // seedDB();
  })
  .catch((err) => {
    console.log("mongoose connection failed => " + err)
  })

// app setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride("_method"))

// passport and express-session setup
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// common middleware for all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

// routes
app.use("/", indexRoutes)
app.use("/posts", postsRoutes)
app.use("/posts/:id/comments", commentRoutes)

app.listen(PORT, () => {
  console.log("Server started")
})

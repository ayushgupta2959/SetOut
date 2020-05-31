import express from "express"
import passport from "passport"
import User from "../models/user"

const router = express.Router({ mergeParams: true })

// index
router.get("/", (req, res) => {
  res.redirect("/posts")
})

// register
router.get("/register", (req, res) => {
  res.render("register")
})

router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
  })
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      res.redirect("/register")
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/posts")
      })
    }
  })
})

// login
router.get("/login", (req, res) => {
  res.render("login")
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  }),
  (req, res) => {}
)

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

export default router

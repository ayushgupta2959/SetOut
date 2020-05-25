// eslint-disable-next-line no-unused-vars
const mongoose = require("mongoose")
const Post = require("./models/post")
const Comment = require("./models/comment")

var data = [
  {
    name: "A",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsdtaMTNSJ-L14q9yGpAROt9oa9on7opPv0ZKjWKpMrRuxJc1s1Q&s",
    description: "desc",
  },
  {
    name: "B",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsdtaMTNSJ-L14q9yGpAROt9oa9on7opPv0ZKjWKpMrRuxJc1s1Q&s",
    description: "desc",
  },
  {
    name: "C",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsdtaMTNSJ-L14q9yGpAROt9oa9on7opPv0ZKjWKpMrRuxJc1s1Q&s",
    description: "desc",
  },
  {
    name: "D",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsdtaMTNSJ-L14q9yGpAROt9oa9on7opPv0ZKjWKpMrRuxJc1s1Q&s",
    description: "desc",
  },
]

function seedDB() {
  Post.deleteMany({}, (err) => {
    if (err) console.log(err)
    else {
      Comment.deleteMany({}, (err) => {
        if (err) console.log(err)
        else {
          data.forEach((post) => {
            Post.create(post, (err, post) => {
              if (err) console.log(err)
              else {
                Comment.create(
                  {
                    text: "dummy comment",
                    author: "dummy author",
                  },
                  (err, comment) => {
                    if (err) console.log(err)
                    else {
                      post.comments.push(comment)
                      post.save()
                    }
                  }
                )
              }
            })
          })
        }
      })
    }
  })
}

export default seedDB

import User from '../models/user'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise

export default {

  addUser: (req, res) => {

    let user = new User()

    user.username = req.body.username
    user.password = req.body.password

    user
      .save()
      .then( (user) => {
        res.status(200)
        .set('Content-Type', 'application/json')
        .json({ user: user })
      })
      .catch((err) => {
        res
          .status(500)
          .set('Content-Type', 'application/json')
          .json({ error: err.message })
      })

  },

  getUsers: (req, res) => {
    User
      .find()
      .exec()
      .then((users) => {
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .json({ users: users })
      })
      .catch((err) => {
        res
          .status(500)
          .set('Content-Type', 'application/json')
          .json({ error: err.message })
      })
  }
}

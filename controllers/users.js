import User from '../models/user'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

mongoose.Promise = global.Promise

export default {

  addUser: (req, res) => {

    let user = new User()

    user.username = req.body.username
    user.nombre = req.body.nombre
    user.apellidos = req.body.apellidos
    user.edad = req.body.edad

    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)

    const hash = bcrypt.hashSync(req.body.password, salt)

    user.password = hash

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

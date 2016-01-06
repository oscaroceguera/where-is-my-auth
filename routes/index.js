import express from 'express'
import passport from 'passport'
import UserCtrl from '../controllers/users'

const router = express.Router()

function ensureAuth (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

router
  .post('/login', passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/login'
  }))
  .get('/login', (req, res) => {
    res.redirect('/login.html')
  })
  .get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })
  .get('/welcome', ensureAuth, (req, res) => {
    res.send(`You are wellcome Usuario : ${req.user.username}, Nombre: ${req.user.nombre}, Apellidos: ${req.user.apellidos} `)
    //console.log("cookies ", req.cookies);
  })
  .get('/users', ensureAuth, UserCtrl.getUsers)
  .post('/signup', UserCtrl.addUser)

export default router

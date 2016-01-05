import express from 'express'
import passport from 'passport'

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
    res.send(`You are wellcome ${req.user.username}`)
    //console.log("cookies ", req.cookies);
  })

export default router

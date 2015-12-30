import http from 'http'
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(expressSession({
  secret: 'my secretz are mine',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

passport.use(new LocalStrategy((username, password, done) => {
  // Aqui va la logica de la base de datos
  if(username === 'soy' && password === 'platzi') {
    return done(null, { name: 'Super', lastname: 'User', username: 'superuser'})
  }

  done(null, false, {message: 'unknow user'})
}))

// Serializacion
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => {
  // obtener el usuario por id
  done(null, user)
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/welcome',
  failureRedirect: '/login'
}))

app.get('/login', (req, res) => {
  res.redirect('/login.html')
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

app.get('/welcome', ensureAuth, (req, res) => {
  res.send(`You are wellcome ${req.user.username}`)
})

function ensureAuth (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

server.listen(port, () => console.log(`listen on port ${port}`))

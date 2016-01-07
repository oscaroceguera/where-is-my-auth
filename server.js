import http from 'http'
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import passport from 'passport'
import routes from './routes'
import mongoose from 'mongoose'
import User from './models/user'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

const SALT_WORK_FACTOR = 10

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(expressSession({
  secret: 'z4f9182d-d884-5558-9aa3',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

passport.use(new LocalStrategy((username, password, done) => {

  User.findOne({ username: username.trim()}, (err, user) => {

    if (!user) return done(null, false, { message: 'unknow user'})

    let pass = user.password

    let isCompare = bcrypt.compareSync(password, pass)

    if (isCompare){

      return done(null, {
        username: user.username,
        nombre: user.nombre,
        apellidos: user.apellidos
      })

    }

    done(null, false, { message: 'unknow user'})
  })
}))

// Serializacion
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => {
  // obtener el usuario por id
  done(null, user)
})

app.use('/', routes)

mongoose.connect('mongodb://localhost/userauth', (err, res) => {
  if (err) throw err

  server.listen(port, () => console.log(`listen on port ${port}`))
})

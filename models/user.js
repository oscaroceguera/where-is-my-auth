import mongoose from 'mongoose'

let Schema = mongoose.Schema

let UserSchema = new Schema({
  username: String,
  password: String,
  nombre: String,
  apellidos: String,
  edad: Number
})

export default mongoose.model('User', UserSchema)

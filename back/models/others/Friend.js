import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    email: { type: String, required: true },
    friends: { type: Array, required: true, unique: true }
})

const Friend = mongoose.model('Friend', Schema);
export default Friend
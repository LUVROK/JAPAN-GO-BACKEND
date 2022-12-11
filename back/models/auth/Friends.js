import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    email: { type: String, required: true },
    friends: { type: Array, required: false }
})

const Friends = mongoose.model('Friends', Schema);
export default Friends;
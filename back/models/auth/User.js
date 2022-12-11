import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    token: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, required: false },
    DateRegister: { type: String, required: false }
})

const User = mongoose.model('Users', Schema);
export default User;
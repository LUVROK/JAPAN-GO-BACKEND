import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    email_From: { type: String, required: true },
    email_To: { type: String, required: true },
    messages: { type: Array, required: true }
})

const Messages = mongoose.model('Messages', Schema);
export default Messages;
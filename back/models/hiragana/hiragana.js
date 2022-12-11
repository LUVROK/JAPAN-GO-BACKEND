import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    id: { type: Number, required: true },
    row: { type: Number, required: true },
    writing: { type: String, required: true },
    romaji: { type: String, required: true },
    polivanov: { type: String, required: true },
    audio: { type: String, required: true },
})

const Hiragana = mongoose.model('Hiragana', Schema);
export default Hiragana
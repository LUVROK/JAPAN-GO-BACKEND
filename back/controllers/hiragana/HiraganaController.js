import asyncHandler from 'express-async-handler'
import Hiragana from '../../models/hiragana/hiragana.js'

const getAllHiragana = asyncHandler(async (req, res) => {
    const hiragana = await Hiragana.find({}).sort({ createdAt: 'desc' }).exec()
    // console.log(req.body)
    res.json(hiragana || [])
})

const updateUser = asyncHandler(async (req, res) => {
    const { isChecked } = req.body

    const user = await User.findById(req.params.id)

    if (user) {
        await todo.save()
        res.json(true)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export default { getAllHiragana, updateUser }
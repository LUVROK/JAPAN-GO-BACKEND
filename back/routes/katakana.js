import express from 'express'
import Katakana from '../models/katakana/katakana.js'
const router = express.Router()

router.post('/alldata', async (req, res) => {
    try {
        // const row = req.body.data.row
        // console.log(row)

        const xt = await Katakana.find({}).sort({ createdAt: 'desc' }).exec()

        // console.log("xt тут" + JSON.stringify(xt))

        res.status(200).json({ xt })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
})

router.post('/KatakanaDataRow', async (req, res) => {
    try {
        const rowNumber = req.body.data.rowNumber
        console.log(rowNumber)

        const xt = await Katakana.find({ "row": rowNumber }).sort({ createdAt: 'desc' }).exec()

        // console.log("xt " + JSON.stringify(xt))
        // console.log(xt.length)

        res.status(200).json({ xt })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
})

export default router;
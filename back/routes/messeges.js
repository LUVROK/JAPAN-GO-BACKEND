import express from 'express';
import Messages from '../models/others/messages.js';

const router = express.Router()

router.post('/getMessgesFirst50', async (req, res) => {
    try {
        console.log('getMessgesFirst50');

        res.status(200).json({ message: 'Успешно' })
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({ message: 'Провал' })
    }
})

router.post('/CreateMessges', async (req, res) => {
    try {
        const text = req.body.data.text;
        const emailFrom = req.body.data.emailFrom;
        const emailTo = req.body.data.emailTo;

        const arr = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Ноября', 'Декабря'];
        const now = new Date();

        const hours_minutes = (now.getHours() + ':' + now.getMinutes()).toString();
        const date_month = (now.getDate() + ' ' + arr[now.getMonth()]).toString();

        console.log(text + '   ' + emailFrom + '   ' + emailTo);

        const filter = { email_From: `${emailFrom}`, email_To: `${emailTo}` };
        const options = { upsert: true };
        const updateDoc = {
            $push: {
                messages: {
                    message: text,
                    email_From: emailFrom,
                    email_To: emailTo,
                    hours_minutes: hours_minutes,
                    date_month: date_month,
                    data: now
                }
            },
        };

        const result = await Messages.updateOne(filter, updateDoc, options);

        // console.log(now);
        // console.log(date_month);

        res.status(200).json({ message: 'Успешно' });
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({ message: 'Провал' })
    }
})

router.post('/createMessenger', async (req, res) => {
    try {
        const email_From = req.body.data.emailFrom;
        const email_To = req.body.data.emailTo;

        console.log('email_From - ' + email_From);
        console.log('email_To - ' + email_To);

        const Messenger1 = await Messages.findOne({ email_From: email_From, email_To: email_To }); // -
        const Messenger2 = await Messages.findOne({ email_From: email_To, email_To: email_From }); // -

        console.log(JSON.stringify(Messenger1) + '   ' + JSON.stringify(Messenger2))

        if ((Messenger1) || (Messenger2)) {
            console.log('Уже есть в базе')
            return res.status(205).json({ message: 'Уже есть в базе' });
        }
        else {
            const newMessenger = await Messages.create({ email_From, email_To, messages: [{}] });
            console.log(newMessenger);
            res.status(200).json({ newMessenger });
            console.log('Был создан чатик');
        }
        // res.status(200).json({ message: 'Нормали' });
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({ message: 'Провал' })
    }
})

export default router;
import express from 'express';
import Friend from '../models/others/Friend.js';
import User from '../models/auth/User.js';

const router = express.Router();

router.post('/getFriends', async (req, res) => {
    try {
        // console.log(req.body.data);
        const email = req.body.data;
        // console.log(email)
        // const email = req.body.data;
        let friendsCollection = [];
        const data = await Friend.findOne({ email });
        // console.log(data.friends[0])
        if (data) {
            // console.log(data.friends);
            friendsCollection = data.friends;
            res.status(200).json({ friendsCollection: friendsCollection });
        }
        else {
            res.status(205).json({ message: '205' })
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: 'Провал' });
    }
});

router.post('/poiskFriends', async (req, res) => {
    try {
        // console.log(req.body.data);
        const email = req.body.data;

        const user = await User.find({ email: { $regex: `${email}` } }, { email: 1, _id: 0 }).limit(15)

        // console.log(user);

        let collectionUsers = [];

        for (let us in user) {
            console.log(user[us].email);
            collectionUsers.push({ email: user[us].email })
        }

        console.log(collectionUsers);

        // console.log(collectionUsers)

        // if (user === undefined) {
        //     res.status(406).json({ message: 'Я не могу найти этот email' })
        // }

        res.status(200).json({ collectionUsers: collectionUsers })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
});

router.post('/addFriend', async (req, res) => {
    try {
        // console.log(req.body.data);
        const emailFrom = req.body.data.emailFrom;
        const emailTo = req.body.data.emailTo;

        const user = await Friend.findOne({ email: emailFrom })
        // console.log(user)

        let HaveFriend = false;

        for (let friend in user.friends) {
            // console.log(user.friends[friend]);
            if (user.friends[friend].email === emailTo) {
                // console.log(true)
                HaveFriend = true;
            }
        }
        // console.log(HaveFriend)

        if (HaveFriend === false) {
            const updateCollection1 = await Friend.updateOne(
                { email: emailFrom },
                { $push: { "friends": { email: emailTo } } }, // Update
                { upsert: true }
            )

            const updateCollection2 = await Friend.updateOne(
                { email: emailTo },
                { $push: { "friends": { email: emailFrom } } }, // Update
                { upsert: true }
            )

            // console.log(updateCollection1)
            // console.log(updateCollection2)
        }
        else {
            return res.status(205).json({ message: 'Уже есть такой друг' })
        }
        // console.log(updateCollection1 + '\n' + updateCollection2)

        res.status(200).json({ message: 'Добавлен' })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
})

router.post('/deleteFriends', async (req, res) => {
    try {
        const emailFrom = req.body.data.emailFrom;
        const emailTo = req.body.data.emailTo;

        // console.log(emailFrom);
        // console.log(emailTo);

        const deleteFriend1 = await Friend.updateOne(
            { email: emailFrom },
            { $pull: { "friends": { email: emailTo } } }, // Update
            { upsert: true }
        )

        const deleteFriend2 = await Friend.updateOne(
            { email: emailTo },
            { $pull: { "friends": { email: emailFrom } } }, // Update
            { upsert: true }
        )

        // console.log(deleteFriend1)
        // console.log(deleteFriend2)

        const data = await Friend.findOne({ email: emailFrom });
        // console.log(data)

        let friendsCollection = data.friends;

        res.status(200).json({ friendsCollection: friendsCollection });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
})

export default router;
import express from 'express';
import * as user from '../controllers/auth/AuthController.js';
import User from '../models/auth/User.js';
import Friend from '../models/others/Friend.js';
const router = express.Router()

router.route('/').post(user.getUser)
// router.route('/create').post(user.createUser)
// router.route('/:id').delete(user.deleteUser).put(user.updateUser)
// router.route('/getAllUser').get(user.getAllUser)

router.post('/create', async (req, res) => {
    try {
        console.log('КРЕАТЕ ЮЗА')
        const email = req.body.data.email;
        const password = req.body.data.password;
        const name = req.body.data.name;
        const token = req.body.data.token;
        const photo = req.body.data.photo;

        var arr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Ноябрь', 'Декабрь'];
        let now = new Date();
        const DateRegister = (arr[now.getMonth()] + '  ' + now.getFullYear()).toString();

        console.log(email, ' ', password);

        const user = await User.findOne({ email });

        if (user) {
            return res.status(205).json({ message: 'Такой Email уже есть в базе' });
        }

        const newUser = await User.create({ token, name, email, password, photo, DateRegister });
        const newFriends = await Friend.create({ email: email, friends: [{ email: 'index0' }] });

        // const allFriends = await Friend.find({email: email})
        // console.log(allFriends)

        res.status(200).json({ newUser });
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({ message: 'Провал' });
    }
})

router.post('/createarchive', async (req, res) => {
    try {
        const email = req.body.data.email;
        const password = req.body.data.password;
        const name = req.body.data.name;
        const token = req.body.data.token;
        const photo = req.body.data.photo;

        console.log(email, ' ', password);

        const newUser = await User.create({
            token,
            name,
            email,
            password,
            photo,
            date
        })

        // const user = new User({
        //     token,
        //     name,
        //     email,
        //     password,
        //     photo
        // })

        // const createdUser = await user.save()
        res.status(201).json(newUser)

        // await user.save()
        // res.redirect('/')
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({ message: 'Провал' });
    }
})

router.post('/UserData', async (req, res) => {
    try {
        // console.log(req.body.data);
        const email = req.body.data;

        const user = await User.findOne({ email })

        const UserData = 'работает'
        // console.log(user)

        res.status(201).json(UserData)
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({ message: 'Провал' })
    }
})

router.post('/UpdateImage', async (req, res) => {
    try {
        // console.log('скорость');
        const photo = req.body.data.photo;
        const email = req.body.data.email;

        // var arr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Ноябрь', 'Декабрь'];
        // let now = new Date();
        // console.log(arr[now.getMonth()] + '  ' + now.getDay() + '  ' + now.getFullYear());

        const filter = { email: `${email}` };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                photo: `${photo}`
            },
        };
        const result = await User.updateOne(filter, updateDoc, options);

        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );

        res.status(201).json({ message: 'Успешное обновление картинки' })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
})

router.post('/loginwithfacebook', async (req, res) => {
    try {
        const email = req.body.data.email;
        const name = req.body.data.name;
        const token = req.body.data.token;
        const photo = req.body.data.photo;

        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let string_length = 23;
        let password = '';
        for (let i = 0; i < string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            password += chars.substring(rnum, rnum + 1);
        }
        // console.log(password)

        // console.log('email - ' + email)

        const user = await User.findOne({ email });

        // console.log(user)

        if (user) {
            const newUser = user;
            return res.status(205).json({ newUser });
        }

        var arr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Ноябрь', 'Декабрь'];
        let now = new Date();
        const DateRegister = (arr[now.getMonth()] + '  ' + now.getFullYear()).toString();

        // console.log(token)
        // console.log(name)
        // console.log(email)
        // console.log(password)
        // console.log(photo)
        // console.log(DateRegister)

        const newUser = await User.create({ token, name, email, password, photo, DateRegister });
        const newFriends = await Friend.create({ email: email, friends: [{ email: 'index0' }] });

        res.status(200).json({ newUser });
    }
    catch (e) {

    }
})

export default router;
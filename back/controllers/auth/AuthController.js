import asyncHandler from 'express-async-handler'
import User from '../../models/auth/User.js'
import { check, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'

const getUser = asyncHandler(
    // [
    //     check('email', 'Неккоректный email').isEmail(),
    //     check('password', 'Некоректный пароль').exists()
    // ],
    async (req, res) => {
        try {
            const errors = validationResult(req.body)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректные данные при авторизации'
                })
            }

            const email = req.body.data.email
            const password = req.body.data.password
            console.log(email, ' ', password)

            const user = await User.findOne({ email })
            // console.log(user)
            if (!user) {
                return res.status(400).json({ message: 'Такого Email нет в базе' })
            }


            let isMatch = true;

            user.password === password ? isMatch = true : isMatch = false
            // const isMatch = await bcrypt.compare(password, user.password);

            // console.log(await bcrypt.compare(password, user.password))
            console.log(password, '   ', user.password)
            console.log('isMatch - ' + isMatch)

            if (!isMatch) {
                return res.status(400).json({ message: 'Пароли не совпадают' })
            }

            res.json({ user, isMatch })
        }
        catch (e) {
            console.log(e);
        }
    }
)

const createUser = asyncHandler(async (req, res) => {
    try {
        console.log('КРЕАТЕ ЮЗА')
        const email = req.body.data.email
        const password = req.body.data.password
        const name = req.body.data.name
        const token = req.body.data.token
        const photo = req.body.data.photo

        console.log(email, ' ', password)

        // const user = await User.findOne({ email })

        // if (user) {
        //     return res.status(400).json({ message: 'Такого Email уже есть в базе' })
        // }

        const newUser = await User.create({ token, name, email, password, photo })

        // res.json({ newUser })

        res.status(201).json(newUser)
    }
    catch (e) {
        console.log(e.message)
    }
})

const getUser2 = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: 'desc' }).exec()
    console.log(req.body)
    res.json(users || [])
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await user.remove()
        res.json({ message: 'User deleted' })
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
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

const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: 'desc' }).exec()
    console.log(users + 'ffffffffffffffff')
    res.json(users || [])
})

export { getUser, deleteUser, createUser, updateUser, getUser2, getAllUser }

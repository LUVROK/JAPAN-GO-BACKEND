import dotenv from 'dotenv'
import morgan from 'morgan'
import express from 'express'
import connectDB from './config/db.js'
import { DEVELOPMENT } from './config/constants.js'
// import { notFound, errorHandler } from './middleware/errorMIddleware.js'
import colors from 'colors'
import User_routes from './routes/User_routes.js'
import cors from 'cors'
import Hiragana from './routes/hiragana.js'
import Katakana from './routes/katakana.js'
import kanji from './routes/kanji.js'
import friends from './routes/friends.js'
import messages from './routes/messeges.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors());

if (process.env.NODE_ENV === DEVELOPMENT) app.use(morgan('dev'))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/user', User_routes)
app.use('/api/hiraganas', Hiragana)
app.use('/api/katakanas', Katakana)
app.use('/api/kanji', kanji)
app.use('/api/friends', friends)
app.use('/api/messages', messages)

// app.use(notFound)
// app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
)

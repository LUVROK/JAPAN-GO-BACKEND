import mongoose from 'mongoose'
import User from '../models/auth/User.js'


const connectDB = async () => {
	try {
		const conn = await mongoose.connect('mongodb+srv://client:client@cluster0.qr9dx.mongodb.net/JapanProject?retryWrites=true&w=majority', {
			useNewUrlParser: true,

		})
		// const user = await User.find({}).sort({ createdAt: 'desc' }).exec()
		console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
	}
	catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold)
		process.exit(1)
	}
}

export default connectDB
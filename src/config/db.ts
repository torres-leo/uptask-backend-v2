import mongoose from 'mongoose';
import { exit } from 'node:process';

export const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.DATABASE_URL);
		const url = `${connection.connection.host}:${connection.connection.port}`;

		console.log(`MongoDB connect on: ${url}`);
	} catch (error) {
		console.log('Failed to connect a MongoDB');
		exit(1);
	}
};

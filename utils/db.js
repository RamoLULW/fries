import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (!process.env.URI) {
            throw new Error("URI is not defined in the .env file");
        }

        await mongoose.connect(process.env.URI);
        console.log("DB Connected");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

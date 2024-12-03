import { mongoose } from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`
        );
        console.log("Connected to MongoDB Successfully");

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export { dbConnection };
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionData: {
        type: String,
        required: true
    }, 
    allOptions: [
        {
            type: String,
            required: true
        }
    ], 
    correctAnswer: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true
})

const Question = mongoose.model('Question', questionSchema);

export default Question
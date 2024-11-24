import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true
    },
    selectedCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }, 
    selectedParagraphId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paragraph'
    }, 
    currentQuestionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }, 
    currentQuesionIndex: {
        type: Number,
        default: 0
    }, 
    correctAnswerCount: {
        type: Number,
        default: 0
    }, 
    wrongAnswerCount: {
        type: Number,
        default: 0
    }

}, 
{
    timestamps: true
})

const User = mongoose.model('User', userSchema);

export { User}
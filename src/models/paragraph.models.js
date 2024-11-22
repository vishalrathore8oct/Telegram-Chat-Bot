import mongoose from "mongoose";

const paragraphSchema = new mongoose.Schema({
    paragraphData: {
        type: String,
        required: true
    }, 
    questionIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ] 
}, 
{
    timestamps: true
})

const Paragraph = mongoose.model('Paragraph', paragraphSchema);

export default Paragraph
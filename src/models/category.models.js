import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    }, 
    paragraphIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Paragraph'
        }
    ]
}, 
{
    timestamps: true
})

const Category = mongoose.model('Category', categorySchema);

export { Category }
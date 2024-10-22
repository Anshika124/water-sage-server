const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: { type: String },  
    type: { type: String, enum: ['issue', 'success'], required: true },  
    status: { type: String, enum: ['pending', 'solved'], default: 'pending' },  
    likes: { type: Number, default: 0 },
    location: { type: String },  
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

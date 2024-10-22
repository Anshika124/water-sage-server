const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  
    phoneNo: { type: String, required: true },
    bio: { type: String, default: '' },  
    socialMediaLinks: { type: [String] },
    profilePicture: { type: String, default: '' },  
    score: { type: Number, default: 0 }  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

const express = require('express');
const router = express.Router();
const Post = require('../models/PostModel');
const User = require('../models/UserModel');

// Create a post (issue or success story)
router.post('/', async (req, res) => {
    const { postedBy, title, description, media, type, location } = req.body;

    const newPost = new Post({
        postedBy,
        title,
        description,
        media,
        type,
        location,
        status: type === 'issue' ? 'pending' : undefined  // Only 'issue' has status
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Like a post and update user score
router.post('/:postId/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likes += 1;
        await post.save();

        // Increment the user's score
        const user = await User.findById(post.postedBy);
        user.score += 1;
        await user.save();

        res.json({ message: 'Post liked', post });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all posts (issues or success stories)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('postedBy', 'fullName');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

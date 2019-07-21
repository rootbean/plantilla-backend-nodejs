const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String, unique: true, trim: true },
    password: { type: String, select: false },
    rol: {
        type: String,
        default: 'guest',
        lowercase: true,
        enum: ['guest', 'admin'],
    },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('User', UserSchema);
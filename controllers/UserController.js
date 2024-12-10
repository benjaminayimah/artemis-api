const User = require('../models/User');
const Agent = require('../models/Agent');
const { deleteFile } = require('../utils/DeleteFileTrait');
const { validationResult } = require('express-validator');

const { isUsernameUnique } = require('../middlewares/validationMiddleware')


const getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        });
        if (!user) return res.status(404).json({ message: 'User not founds' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


// Controller to get a single user by username
const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({ error: 'Username parameter is required' });
        }
        const userId = await User.findOne({ 
            where: { username },
            attributes: ['id']
        });

        const user = await User.findByPk(userId.id, {
            attributes: { exclude: ['password', 'googleId', 'createdAt', 'updatedAt'] },
            include: {
                model: Agent,
                as: 'agents',
                // separate: true, // Separate query for included Agents
                // limit: 50,
                order: [['createdAt', 'DESC']],
            },
        });

        if (user) {
            res.status(200).json(user); // Respond with the user data
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error); // Log the error for debugging
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};


// Controller to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'googleId', 'updatedAt'] },
            limit: 50,
            order: [['createdAt', 'DESC']],
            include: {
                model: Agent,
                as: 'agents',
                separate: true,
                order: [['createdAt', 'DESC']],
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get a single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to update a user by ID
const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const { id, username, displayName, bio, image } = req.body;
        const user = await User.findByPk(id);

        if (user) {
            const newImage = image?.split('/').pop();
            const oldImage = user.image?.split('/').pop();

            user.username = username;
            user.displayName = displayName;
            user.image = image;
            user.bio = bio;
            await user.save();

            if (oldImage && (oldImage != newImage)) {
                await deleteFile(oldImage);
            }

            res.status(200).json({ user: user, message: 'Profile has been updated'});
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller to validate username
const validateUsername = async (req, res) => {

    const username = req.params.username
    const userId = req.userId

    const isUnique = await isUsernameUnique(username, userId);
    if (!isUnique) {
        return res.status(200).json({ status: 'error', message: 'Username already exists.' });
    }
    return res.status(200).json({ status: 'success', message: `<strong>${username}</strong> is available` });
};

// Controller to delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser,
    validateUsername
};

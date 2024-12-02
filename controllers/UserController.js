const User = require('../models/User');
const Agent = require('../models/Agent');


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
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
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
        const users = await User.findAll();
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
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await User.findByPk(id);
        if (user) {
            user.username = username;
            user.email = email;
            user.password = password;
            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    deleteUser
};

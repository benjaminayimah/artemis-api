const Agent = require('../models/Agent');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { generateUniqueId } = require('../utils/UserTrait');
const { deleteFile } = require('../utils/DeleteFileTrait');



// Controller to create a new Agent
const createAgent = async (req, res) => {
    const userId = req.userId
    const { agentName, instructions, color, description, greeting, headline, image, visibility } = req.body;
    let chatId;
    while (true) {
        try {
            // Attempt to create the user
            chatId = generateUniqueId(40)

            await Agent.create({
                userId,
                chatId,
                agentName,
                instructions,
                color,
                description,
                greeting,
                headline,
                image,
                visibility
            });

            break; // Exit loop if successful
        } catch (error) {
            // Check if the error is due to a unique constraint violation
            if (error.name === 'SequelizeUniqueConstraintError') {
                continue; // Retry with a new unique string
            }

            res.status(400).json({ error: error.message });
            break; // Exit loop if successful
        }
    }
    res.status(201).json({ message: 'Agent is created successfully!'});
};


// Controller to update a user by ID
const updateAgent = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const { agentName, instructions, description, greeting, headline, image, visibility } = req.body;
        const agent = await Agent.findOne({
            where: { id: id, userId: userId },
        });

        if (agent) {
            const newImage = image?.split('/').pop();
            const oldImage = agent.image?.split('/').pop();

            agent.agentName = agentName;
            agent.instructions = instructions;
            agent.description = description;
            agent.greeting = greeting;
            agent.headline = headline;
            agent.image = image;
            agent.visibility = visibility;
            await agent.save();

            if (oldImage && (oldImage != newImage)) {
                await deleteFile(oldImage);
            }

            res.status(200).json({ message: 'Agent has been updated'});
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller to get Agents by userId
const getMoreAgentsByUserId = async (req, res) => {

    try {
        const { page, limit, userId } = req.body;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Agent.findAndCountAll({
            where: { userId: userId },
            offset,
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ total: count, agents: rows });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller to get a single Agent by ID
const getAgentById = async (req, res) => {
    try {
        const { chatId } = req.params;

        let user

        const agent = await Agent.findOne({ 
            where: { chatId }
        });

        if (agent) {
            user = await User.findByPk(agent.userId, {
                // attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
                attributes: ['username']
            });

            const userWithAgents = { ...user.toJSON(), agent };

            res.status(200).json(userWithAgents);
        } else {
            res.status(404).json({ error: 'Agent not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller to delete a user by ID
const deleteAgent = async (req, res) => {


    try {
        const { id } = req.params;
        const agent = await Agent.findByPk(id);

    // return res.status(200).json({ message: agent });


        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        const image = agent.image?.split('/').pop();
        image ? await deleteFile(image) : ''

        await agent.destroy();

        res.status(200).json({ message: 'Agent has been deleted' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Controller to get all agents
const getAllAgents = async (req, res) => {
    try {
        const agents = await Agent.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['username', 'image', 'color']
            },
            order: [['createdAt', 'DESC']],
            where: { visibility: 'public' },
            limit: 50
        });
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





module.exports = {
    createAgent,
    getMoreAgentsByUserId,
    getAllAgents,
    getAgentById,
    updateAgent,
    deleteAgent
};

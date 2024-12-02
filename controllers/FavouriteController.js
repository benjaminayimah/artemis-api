const User = require('../models/User');
const Agent = require('../models/Agent');
const Favourite = require('../models/Favourite')


const addToFavourite = async (req, res) => {
    const userId = req.userId
    const { agentId } = req.params;

    try {
        await Favourite.create({
            userId,
            agentId
        });

        const agent =  await Agent.findOne({ 
            where: { id: agentId }
        });

        res.status(201).json({ message: 'Added to favourites', agent: agent });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
};


const getFavourites = async (req, res) => {

    try {
        const userId = req.userId;

        // Fetch user's favourite products
        const favourites = await Favourite.findAll({
            where: { userId }, // Filter by userId
            include: [
                {
                model: Agent, // Join with Product table
                as: 'agent', 
                // attributes: ['id', 'name', 'price', 'description'], // Select specific fields
                },
            ],
            attributes: [], // Do not select any fields from Favourite table
        });
        
        res.status(200).json({ favourites });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


// Controller to delete a user by ID
const removeFavourite = async (req, res) => {
    const userId = req.userId
    const { agentId } = req.params;
    try {
        const favourite = await Favourite.findOne({ 
            where: { userId, agentId },
        });

        if (!favourite) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        await favourite.destroy();

        res.status(200).json({ message: 'Removed from favourites' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addToFavourite,
    getFavourites,
    removeFavourite
};

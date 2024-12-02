const express = require('express');
const FavouriteController = require('../controllers/FavouriteController')
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/:agentId', authenticateToken, FavouriteController.addToFavourite);
router.get('/', authenticateToken, FavouriteController.getFavourites);
router.delete('/:agentId', authenticateToken, FavouriteController.removeFavourite); 

module.exports = router;

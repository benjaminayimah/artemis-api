const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const { getRandomColor } = require('../utils/ColorTrait');
const passport = require('passport');
// require('../middlewares/oauthMiddleware')

// JWT secret and expiration
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

// Sign up
const signUp = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    const {  email, password } = req.body;
    const color = getRandomColor()
    const picture = null
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username: email,
            email,
            password: hashedPassword,
            color,
            picture
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Sign in
const signIn = async (req, res) => {
    // return res.status(200).json({ message: req.body});

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Create JWT token
        const token = createToken({ id: user.id, email: user.email })
        res.status(200).json({ message: 'Sign in successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create JWT token
const createToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};



// Google OAuth callback route
const googleCallback = (req, res, next) => {
    passport.authenticate('google', async (err, user) => {

        const nonce = crypto.randomBytes(16).toString('base64'); // Use Node's crypto library to generate a secure nonce
        res.setHeader('Content-Security-Policy',`script-src 'self' 'nonce-${nonce}'`);
        if (err || !user) {
            return res.send(`
            <script nonce="${nonce}">
                window.close();
            </script>
            `);
        }
        if(user) {
            const newUser = await createOauthUser(user);
            const token = createToken({ id: newUser.id, email: newUser.email })

            res.send(`
                <script nonce="${nonce}">
                    window.close();
                </script>
            `);

            // res.status(200).json({ message: 'Sign in successful', token });
        }
        
    })(req, res, next);

};


// Controller function to handle user creation

async function createOauthUser(profile) {
    const [user, created] = await User.findOrCreate({
        where: { googleId: profile.id },
        defaults: {
            username: profile.displayName,
            email: profile.email,
            picture: profile.picture,
            color: getRandomColor(),
            googleId: profile.id,
            verified: true
        }
    });
    return user
}

//     if (window.name === 'oauth_popup') {
                //         window.opener.postMessage(
                //             { success: true, token: '${token}' },
                //             'http://localhost:3000'
                //         );
                //         window.close();
                //     } else {
                //     console.warn('No opener window found');
                // }



// const googleAuth = async () => {
//     passport.authenticate('google', { scope: ['email', 'profile'] })
// }

module.exports = {
    signUp,
    signIn,
    googleCallback,
    createOauthUser
};

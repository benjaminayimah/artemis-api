const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const { getRandomColor, getRandomName, generateNum } = require('../utils/UserTrait');
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
    const newUser = await createUniqueUser(req.body);
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
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
        // Create Auth JWT token
        const token = createToken({ id: user.id, email: user.email })
        res.status(200).json({ message: 'Sign in successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create Auth JWT token
const createToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

//create unique user

// Utility function to generate a unique username and create the user
async function createUniqueUser(user) {
    let displayName;
    let randNum;
    let newUser;

    const hashedPassword = user?.password ? await bcrypt.hash(user.password, 10) : null

    while (true) {
        try {
            displayName = getRandomName()
            randNum = generateNum(5)
            const username = displayName + randNum

            const image = user.image || user.picture

            newUser = await User.create({
                username: username,
                displayName: username,
                password: hashedPassword,
                email: user.email,
                image: image || null,
                color: getRandomColor(),
                googleId: user.id || null,
                verified: user.email_verified || false
            });

            break; // Exit loop if successful
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                continue; 
            }

            console.error(error);
            break;
        }
    }
    return newUser; // Return the created user
}




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
            console.log(user)
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
    const user = await User.findOne({
        where: { googleId: profile.id }
    });

    if (user) {
        return user;
    } else {
        return await createUniqueUser(profile);
    }
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

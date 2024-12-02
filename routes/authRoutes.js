const express = require('express');
const { validateSignIn, validateRegister } = require('../middlewares/authValidation');
const authenticateToken = require('../middlewares/authMiddleware');


const passport = require('passport')

const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/signup', validateRegister, AuthController.signUp);
router.post('/signin', validateSignIn, AuthController.signIn);

router.post('/logout', authenticateToken, (req, res) => {
    res.json({ message: 'User is logged out' });
});

router.get('/google', 
    passport.authenticate('google', {
        scope: ['email', 'profile'],
        prompt: 'select_account'
    })
)

router.get('/google/callback', AuthController.googleCallback);

// Google OAuth callback route
// router.get('/google/callback', (req, res, next) => {
//     passport.authenticate('google', (err, user) => {
//         const nonce = crypto.randomBytes(16).toString('base64'); // Use Node's crypto library to generate a secure nonce
//         res.setHeader('Content-Security-Policy',`script-src 'self' 'nonce-${nonce}'`);
//         if (err || !user) {
//             return res.send(`
//             <script nonce="${nonce}">
//                 window.close();
//             </script>
//             `);
//         }
  
//       // Generate a JWT token upon successful login
//       const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     //   console.log(req)
//     // if (req.user && req.user.isTemporary) {
//     //     temporaryUsers.delete(req.user.id); // Remove temporary user if applicable
//     //   }
//     //   req.logout(() => {
//     //     req.session.destroy(err => {
//     //     //   res.clearCookie('connect.sid');
//     //     //   res.send({ message: 'Logged out' });
//     //     });
//     //   });
//       console.log(user)
  
//       // Send the token to the main window and close the popup

//       res.send(`
//         <script nonce="${nonce}">
//             // if (window.opener) {
//                 // window.opener.postMessage({ success: true, message: 'Authentication successful' }, '*');
//                 window.close();
//             // } else {
//                 // console.warn('No opener window found');
//             // }
//         </script>
//       `);
//     })(req, res, next);

// });
  


// router.get('/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/api/auth/auth-succesful',
//     failureRedirect: '/api/auth/auth-failed'
//   })
// )
// router.get('/auth-succesful', (req, res) => {
//     res.send('<script>window.close();</script>'); 
// });
// router.get('/auth-failed', (req, res) => {
//     res.send('<script>window.close();</script>');
// });

// router.get('/google/callback', (req, res, next) => {
//     passport.authenticate('google', (err, user, info) => {
//         // console.log(user)
//         // console.log(req)
//         // res.send('<script>window.close();</script>');
//       if (err || !user) {
//         // Handle failure case and close the popup
//         return res.send('<script>window.close();</script>');

        
//       }
//       // On success, proceed to login and close the popup
//       req.login(user, (loginErr) => {
//         if (loginErr) {
//           return next(loginErr);
//         }
//         res.send('<script>window.close();</script>');
//       });
//     })(req, res, next);
//   });

// Logout route
// router.get('/me-logout', (req, res) => {
//     // If Passport is being used, log the user out of Passport
//     req.logout((err) => {
//       if (err) {
//         console.error('Error during logout:', err);
//         return res.status(500).send('Logout failed');
//       }
  
//       // Destroy session data
//       req.session.destroy((sessionErr) => {
//         if (sessionErr) {
//           console.error('Error destroying session:', sessionErr);
//           return res.status(500).send('Session destruction failed');
//         }
  
//         // Optionally clear any cookies related to authentication (like JWT)
//         res.clearCookie('connect.sid'); // Name depends on your setup
  
//         // Redirect to the frontend login page or show a message
//         res.redirect('/login'); // Adjust the redirect as needed
//       });
//     });
//   });
  

router.get('/me-logout', (req, res) => {
    console.log(req.isAuthenticated())
    // res.status(200).json({ message: 'Sign in successful', req: req });


    // if (req.user && req.user.isTemporary) {
    //     temporaryUsers.delete(req.user.id); // Remove temporary user if applicable
    //   }
    // req.logout(err => {
    //     if (err) return next(err);
    
    //     // Destroy the session after logging out
    //     req.session.destroy(err => {
    //       if (err) return next(err);
    //       // Optional: Redirect to the homepage or login page after session destruction
    //       res.send('Logged out');
    //     });
    //   });
    // console.log(req.isAuthenticated())

    // req.logout(err => {
    //     if (err) {
    //       return res.status(500).json({ message: 'Error logging out' });
    //     }
        
    //     // Destroy the session data if using express-session
    //     req.session.destroy(err => {
    //       if (err) {
    //         return res.status(500).json({ message: 'Error destroying session' });
    //       }
    
    //       // Optionally clear the cookie if used
    //       res.clearCookie('connect.sid');
    //       res.json({ message: 'Logged out successfully' });
    //     });
    //   });
    // req.logout()
    // res.send('Logged out')
    // console.log(req)
})

module.exports = router;

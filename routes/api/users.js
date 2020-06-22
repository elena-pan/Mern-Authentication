const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

const host = "http://localhost:3000"; // Change in deployment

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const receiverEmail = process.env.RECEIVER_EMAIL;

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load models
const User = require("../../models/User");
const Token = require("../../models/Token");
const PasswordResetToken = require("../../models/PasswordResetToken");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            // Create verification token - expires in 12 hours
                            const token = new Token({
                                _userId: user._id,
                                token: crypto.randomBytes(16).toString("hex")
                            });
                    
                            token.save()
                                .then(token => {
                                    // Send verification email
                                    const message = {
                                        to: user.email,
                                        from: receiverEmail,
                                        subject: "Account Verification",
                                        text: `Please verify your account here: ${host}/verify/${token.token}
                                        This link will expire in 72 hours. If you did not create an account with us, please ignore this email.`,
                                        html: `<p>Please verify your account here: 
                                        <a href="${host}/verify/${token.token}">${host}/verify/${token.token}</a> This link will expire in 72 hours.</p>
                                        <p>If you did not create an account with us, please ignore this email.</p>`
                                    };
                                    sgMail.send(message)
                                        .then(() => res.status(200).json({ success: true }))
                                        .catch(err => res.status(500).json(err));
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json(err);
                                })
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {

    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {// User matched

            if (!user.isVerified) {
                res.status(401).json({ notverified: "Your account has not been verified. Please check your email for verification instructions." })
            }
            else {
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
                // Sign token
                jwt.sign(
                    payload,
                    process.env.SECRET_OR_KEY,
                    {expiresIn: 31556926}, // 1 year in seconds
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            }
        } else {
            return res.status(400).json({ passwordincorrect: "Password incorrect" });
        }
    });
    });
});

// @route POST api/users/resend-token
// @desc Resend verification token to user email
// @access Public
router.post("/resend-token", (req, res) => {

    // Validate email
    const { errors } = validateRegisterInput(req.body);

    // Check validation
    if (errors.email || errors.emailnotfound) {
        return res.status(400).json({ email: errors.email, emailnotfound: errors.emailnotfound });
    }
  
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        if (user.isVerified) {
            res.status(400).json({
                alreadyverified: "This account has already been verified."
            });
        }
        // Create new verification token
        var token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString("hex")
        });

        token.save()
            .then(token => {
                // Send new verification email
                const message = {
                    to: user.email,
                    from: receiverEmail,
                    subject: "Account Verification",
                    text: `Please verify your account here: ${host}/verify/${token.token}
                    This link will expire in 72 hours. If you did not create an account with us, please ignore this email.`,
                    html: `<p>Please verify your account here: 
                    <a href="${host}/verify/${token.token}">${host}/verify/${token.token}</a> This link will expire in 72 hours.</p>
                    <p>If you did not create an account with us, please ignore this email.</p>`
                };
                sgMail.send(message)
                    .then(() => res.status(200).json({ success: true }))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    })
    .catch(err => res.status(500).json(err))
});

// @route GET api/users/verify/:token
// @desc Verify token
// @access Public
router.get("/verify/:token", (req, res) => {
    Token.findOne({ token: req.params.token }).then(token => {
        if (!token) {
            res.status(400).json({ tokennotfound: "This verification link is invalid or expired."});
        }
        // Find matching user
        User.findById(token._userId).then(user => {
            if (!user) {
                res.status(400).json({ usernotfound: 'No account was found.' });
            }
            else if (user.isVerified) {
                res.status(400).json({ alreadyverified: "This account has already been verified." });
            }

            // Verify and save the user
            user.isVerified = true;
            user.expires = null;
            user.save()
                .then(() => {
                    const USER = {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    };
                    res.json({ success: true })

                })
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
    });
});

// @route POST api/users/password-reset-token
// @desc Send token to reset password
// @access Public
router.post("/password-reset-token", (req, res) => {
    // Validate email
    const { errors } = validateRegisterInput(req.body);

    // Check validation
    if (errors.email || errors.emailnotfound) {
        return res.status(400).json({ email: errors.email, emailnotfound: errors.emailnotfound });
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Create new token
        var token = new PasswordResetToken({
            _userId: user._id,
            token: crypto.randomBytes(16).toString("hex")
        });

        token.save()
            .then(token => {
                // Send password reset email
                const message = {
                    to: user.email,
                    from: receiverEmail,
                    subject: "Password Reset",
                    text: `Please follow this link to reset your password: ${host}/password-reset/${token.token}
                    This link will expire in 1 hour. If you did not request a password reset, please ignore this email.`,
                    html: `<p>Please follow this link to reset your password: 
                    <a href="${host}/password-reset/${token.token}">${host}/password-reset/${token.token}</a> This link will expire in 1 hour.</p>
                    <p>If you did not request a password reset, please ignore this email.</p>`
                };
                sgMail.send(message)
                    .then(() => res.status(200).json({ success: true }))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    })
    .catch(err => res.status(500).json(err))
});

// @route GET api/users/reset-password/:token
// @desc Reset password
// @access Public
router.get("/reset-password/:token", (req, res) => {
    PasswordResetToken.findOne({ token: req.params.token }).then(token => {
        if (!token) {
            res.status(400).json({ tokennotfound: "This link is invalid or expired."});
        }
        // Find matching user
        User.findById(token._userId).then(user => {
            if (!user) {
                res.status(400).json({ usernotfound: 'No account was found.' });
            }
            else {
                res.json({ success: true });
            }
        })
        .catch(err => res.status(500).json(err))
    });
});

// @route POST api/users/reset-password/:token
// @desc Reset password
// @access Public
router.post("/reset-password/:token", (req, res) => {
    // Form validation
    const { errors } = validateRegisterInput(req.body);

    // Check validation
    if (errors.password || errors.password2) {
        return res.status(400).json({ password: errors.password, password2: errors.password2 });
    }

    PasswordResetToken.findOne({ token: req.params.token }).then(token => {
        if (!token) {
            res.status(400).json({ tokennotfound: "This link is invalid or expired."});
        }
        // Find matching user
        User.findById(token._userId).then(user => {
            if (!user) {
                res.status(400).json({ usernotfound: 'No account was found.' });
            }

            // Change password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
            token.remove();
        })
        .catch(err => res.status(500).json(err))
    });
});

// @route POST api/users/update-info
// @desc Login user and return JWT token
// @access Private
router.post("/update-info",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        await User.findById(req.user.id)
            .then(user => {
                if (req.body.name) {
                    user.name = req.body.name;
                    user.save()
                        .then(() => {
                            // Create JWT Payload
                            const payload = {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            };
                            // Sign token
                            jwt.sign(
                                payload,
                                process.env.SECRET_OR_KEY,
                                {expiresIn: 31556926}, // 1 year in seconds
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token
                                    });
                                }
                            );
                        })
                        .catch(err => res.status(400).json(err))
                }
                else if (req.body.password) {
                    // Hash password before saving in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) throw err;
                            user.password = hash;
                            user.save()
                                .then(user => {
                                    // Create JWT Payload
                                    const payload = {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email
                                    };
                                    // Sign token
                                    jwt.sign(
                                        payload,
                                        process.env.SECRET_OR_KEY,
                                        {expiresIn: 31556926}, // 1 year in seconds
                                        (err, token) => {
                                            res.json({
                                                success: true,
                                                token: "Bearer " + token
                                            });
                                        }
                                    );
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            })
            .catch(err => res.status(400).json(err))
})

router.delete("/user",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findByIdAndDelete(req.user.id)
            .then(() => res.json({ success: true }))
            .catch(err => res.status(400).json(err));
})

module.exports = router;

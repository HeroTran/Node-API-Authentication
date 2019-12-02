const express = require('express');
const app = express();
const dotenv = require('dotenv');
const passport = require("passport");
const strategy = require("passport-facebook");
const User = require("../model/User");
const jwt = require('jsonwebtoken');
const helper = require('../utils/helpers');
dotenv.config();
//Change evn depend on EVN has set
const evn = app.get('env');
require('custom-env').env(evn);
const FacebookStrategy = strategy.Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name', 'displayName', 'gender']
        },
        function (req, accessToken, refreshToken, profile, done) {
            const findOrCreateFBUser = async () => {
                if (profile) {
                    let user = await User.findOne({ profileId: profile.id });
                    // Create a new user in the user table if not found
                    if (!user) {
                        var newUser = {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            profileId: profile.id,
                            codeLogin: helper.generateRandomCode(8).toUpperCase()
                        };
                        user = await User.create(newUser);
                        // Return the user
                        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
                        user.tokenFB = token;
                        user.tokens = user.tokens.concat({ token })
                        await user.save();
                        done(null, user);
                    } else {
                        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
                        user.tokenFB = token;
                        user.tokens = user.tokens.concat({ token })
                        user.codeLogin = helper.generateRandomCode(8).toUpperCase();
                        await user.save();
                        done(null, user);
                    }

                }
            };

            findOrCreateFBUser().catch(done);
        }
    )
);
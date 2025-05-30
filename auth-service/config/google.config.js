import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/api/auth/google/callback',
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Handle user data from Google
                const userData = {
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    role: "student"
                };
                return done(null, userData);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
import { ExtractJwt } from "passport-jwt";
import { Strategy as JwtStrategy } from 'passport-jwt'
import Account from "../models/Account.js";
import dotenv from 'dotenv'
import passport from "passport";
dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await Account.findOne({ _id: jwt_payload.id });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch(err) {
        return done(err, false);
      }
    })
  );

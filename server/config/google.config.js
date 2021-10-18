import googleOAuth from "passport-google-oauth20";

import {UserModel} from "../database/allModels";

const GoogleStrategy = googleOAuth.Strategy;

export default (passport) => {
  passport.use(
    new GoogleStrategy({
      clientID: "220538080039-ob56jbvp4dna6ue48ri92gq2smmqdia6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/auth/google/callback"
    },
  async(accessToken, refreshToken, profile, done) => {
    //Creating a new user
    const newUser = {
      fullname: profile.displayName,
      email: profile.emails[0].value,
      profilePic: profile.photos[0].value
    };
    try{
      //Check whether user exists
      const user = await UserModel.findOne({email: newUser.email});
      if(user) {
        //Generating JWT Token
        const token = user.generateJwtToken();
        //Return user
        done(null, {user, token});
      } else {
        //Creating a new user
        const user = await UserModel.create(newUser);

        //return user
        done(null, {user,token});
      }
    } catch (error) {
      done(error, null);
    }
  }
  )
);

passport.serializeUser((userData,done) => done(null, {...userData}));
passport.deserializeUser((id, done) => done(null, id));

};

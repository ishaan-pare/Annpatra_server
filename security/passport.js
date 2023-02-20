const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt");
const Clients = require("../models/Clients");

const cookieExtracter = (req)=>{
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
}

passport.use(new JwtStrategy.Strategy({
    jwtFromRequest: cookieExtracter,
    secretOrKey: "EpicsTeamAnnpatra",
}, (payload, done)=>{

    Clients.findById({_id: payload.sub}, (err, client)=>{
        if (err) 
            return done(err, false);
        if (client)
            return done(null, client);
        else
            return done(null, false);
    });
}));

passport.use(new LocalStrategy((username, password, done)=>{
    Clients.findOne({username}, (err, client)=>{
        if (err)
            return done(err);
        if (!client)
            return done(null, false);
        client.comparePassword(password, done);
    });
}));


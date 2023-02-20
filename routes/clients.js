const clientRouter = require("express").Router();
const Clients = require("../models/Clients");
const passport = require("passport");
const JWT = require("jsonwebtoken");
const config = require("../security/passport");

//@token creation
const signToken = (c) => {
    //issuer - EpicsTeamAnnpatra
    //expriry - 1h
    return JWT.sign({
        iss: "EpicsTeamAnnpatra",
        sub: c
    }, "EpicsTeamAnnpatra", { expiresIn: "1h" });
}

//@router clientRouter CRUD

//1
//@route register - all clients
clientRouter.post("/register", (req, res) => {
    const { cemail, cpass, ctype } = req.body;

    Clients.findOne({ cemail }, (err, client) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: err
                },
                msgError: true
            });
        if (client)
            res.status(400).json({
                message: {
                    msgBody: "Already have an account"
                },
                msgError: true
            });
        else {
            const newClient = new Clients({ cemail, cpass, ctype });

            newClient.save(err => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error has occured server side"
                        },
                        msgError: true
                    });
                else
                    res.status(201).json({
                        message: {
                            msgBody: "Account created successfully"
                        },
                        msgError: false
                    });
            })
        }
    })
});

//2
//@route - login - all types
clientRouter.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    if (req.isAuthenticated()) {

        const { _id, cemail, ctype } = req.user;
        const token = signToken(_id);
        res.cookie("access_token", token, { httpOnly: false, sameSite: true });
        res.status(200).json({ isAuthenticated: true, client: { cemail, ctype } });
    }
});

//3
//@route - is Authenticated user
clientRouter.get("/authenticated", passport.authenticate("jwt", {session: false}), (req,res)=>{
    const {_id, cemail, ctype} = req.user;
    res.status(200).json({isAuthenticated: true, client: {cemail, ctype}});
});

//4
//@route - logout - all types
clientRouter.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.clearCookie("access_token");
    res.json({ client: { cemail: "", ctype: "" }, success: true });
});


module.exports = clientRouter;
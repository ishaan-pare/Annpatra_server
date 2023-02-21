//customer related necessary imports
const customerRouter = require("express").Router();
const Customer = require("../models/Clients/Customer");
const passport = require("passport");
const config = require("../security/passport");


//@router customer CRUD

//1
//@route form - detail filling 
customerRouter.post("/form", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cname, isorg, ccon } = req.body;
    const { cemail, ctype } = req.user;

    if (ctype != "customer")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });

    else
        Customer.findOne({ cemail }, (err, client) => {
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
                        msgBody: "Not Required to refill"
                    },
                    msgError: true
                });
            else {
                const newCustomer = new Customer({ cemail, cname, isorg, ccon });
                newCustomer.save(err => {
                    if (err)
                        res.status(500).json({
                            message: {
                                msgBody: "Error occuered at server side"
                            },
                            msgError: true
                        });
                    else {
                        res.status(201).json({
                            message: {
                                msgBody: "Successfully added the details"
                            },
                            msgError: false
                        });
                    }
                })
            }
        })
});

//2
//@route check form filled or not
customerRouter.get("/checkfilled", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;

    if (ctype != "customer")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });
    else
        if (cemail) {
            Customer.findOne({ cemail }, (err, client) => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error occured at server side"
                        },
                        msgError: true
                    });
                if (!client)
                    res.status(200).json({
                        response: {
                            found: false
                        },
                        message: {
                            msgBody: "Not filled details"
                        },
                        msgError: false
                    });
                else {
                    res.status(200).json({
                        response: {
                            found: true
                        },
                        message: {
                            msgBody: "Already filled details"
                        },
                        msgError: false
                    });
                }
            })
        }
        else {
            res.status(401).json({
                message: {
                    msgBody: "Unauthorized user"
                },
                msgError: true
            })
        }
});


module.exports = customerRouter;
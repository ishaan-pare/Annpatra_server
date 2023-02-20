const customerRouter = require("express").Router();
const Customer = require("../models/Clients/Customer");
const passport = require("passport");
const config = require("../security/passport");


//@router customer CRUD

//1
//@route form - detail filling 
customerRouter.post("/form", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cname, isorg, ccon } = req.body;
    const { cemail } = req.user;
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
            const newCustomer = new Customer({cemail, cname, isorg, ccon});
            newCustomer.save(err=>{
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



module.exports = customerRouter;
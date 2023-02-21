const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ClientSchema = new mongoose.Schema(
    {   
        //AKA username - while login
        cemail: {
            type: String,
            required: true,
            unique: true
        },
        //AKA password - while login
        cpass: {
            type: String,
            required: true,
            min: 8
        },
        ctype: {
            type: String,//customer or restaurant
            required: true
        }
    }
);

ClientSchema.pre("save", function(nxt){
    if (!this.isModified("cpass"))
        return nxt();

    bcrypt.hash(this.cpass, 10, (err, cpassHash)=>{
        if (err) 
            return nxt(err);
        this.cpass = cpassHash;
        nxt();
    });
});

ClientSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.cpass, (err, isMatch)=>{
        if (err)
            return cb(err);
        else
            if (!isMatch)
                return cb(null, isMatch);
            return cb(null, this);
    });
}

module.exports = mongoose.model("Clients", ClientSchema);
var { Userdb, validateUser, userSchema } = require("../model/user");
const { match } = require("../util/path");

exports.getAllUser = async(req, res) => {
    const allUsers = await Userdb.find({});
    res.send(allUsers);
};

exports.createUser = async(req, res) => {

    //console.log(req.body)
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newUser = new Userdb({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        DOB: req.body.DOB,
        address: req.body.address,
        phone: req.body.phone,
    });
    await newUser.save();
    res.send(newUser);
    //    res.send(req.body)
};

exports.getAUser = async(req, res) => {
    try {
        const aUser = await Userdb.findById(req.params.id);
        if (!aUser) return res.status(400).send("Invalid User.");
        res.send(aUser);
    } catch (error) {
        res.status(500).send(error.message);
    }

};

exports.updateUser = async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    const updatedUser = await Userdb.findByIdAndUpdate(
        req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            DOB: req.body.DOB,
            address: req.body.address,
            phone: req.body.phone,
            rating: req.body.rating,
        }, { new: true }
    );

    if (!updatedUser)
        return res.status(404).send("User with given ID was not found.");
    res.send(updatedUser);
};

exports.deleteUser = async(req, res) => {
    try {
        const deletedUser = await Userdb.findByIdAndDelete(req.params.id); //findByIdAndRemove
        if (!deletedUser)
            return res.status(404).send("User with given ID was not found for deletion.");
        res.send(deletedUser);

    } catch (error) {
        res.status(500).send(error.message);
    }

};

exports.deleteAllNonAdminUser = async(req, res) => {
    const deletedAllUser = await Userdb.deleteMany({ isAdmin: false });
    if (!deletedAllUser)
        return res.status(404).send("No user was found to be deleted");
    res.send("Successfully Deleted All non admin Users");
};
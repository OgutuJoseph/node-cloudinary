const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const User = require('../models/User');

// create
router.post('/create', upload.single('avatar'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
        // to get result from cloudinary
        // res.json(result);

        /** create instance of user */
        let user = new User({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id
        });

        // Save user
        await user.save(); 
        res.json(user);


    } catch (error) {
        console.log(error)
    }
});

// get single
router.get('/:id', async (req, res) => {
    try {
        let user = await User.find({ _id: req.params.id })
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

// update
router.put('/:id', upload.single('avatar'), async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        await cloudinary.uploader.destroy(user.cloudinary_id);
        const result = await cloudinary.uploader.upload(req.file.path);

        const data = {
            name: req.body.name || user.name,
            avatar: result.secure_url || user.avatar,
            cloudinary_id: result.public_id || user.cloudinary_id
        };

        user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
})

// delete
router.delete('/:id', async (req, res) => {
    let user = await User.findById(req.params.id);

    //delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);

    //delete user from db
    await user.remove();
    res.send('Úser deleted successfullly.')
})

module.exports = router;
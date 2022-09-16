const express = require('express')
const dotenv = require('dotenv');
// to upload image to server
const cloudinary = require('cloudinary');
// to extract data from incoming request
const bodyParser = require('body-parser');
// to get file paths
const fs = require('fs');
const multer = require('multer')

const app = express();
dotenv.config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage })

/** body parser configuration */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

/** cloudinary configuration */
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDSECRET
});


/** function to accept local image file's path and upload to cloudinary */
async function uploadToCloudinary(localFilePath) {
    // local filePath :
    // path of image which was just uploaded to 'uploads' folder
    var mainFolderName = 'main';
    var filePathOnCloudinary = mainFolderName + '/' + localFilePath;
    // ^^ Lets say locaFilePath = “uploads/sample.jpg” then filePathOnCloudinary = “main/uploads/sample.jpg”

    //filePathOnCloudinary :
    // path of image we want when it is uploaded to cloudinary
    return cloudinary.uploader.upload(localFilePath, {'public_id': filePathOnCloudinary})
        .then((result) => {
            // image has been successfully uploaded on cloudinary
            // so we dont need local file anymore
            // remove file from local uploads folder
            fs.unlink(localFilePath)

            return {
                message: 'Success',
                url: result.url
            };
        })
        .catch((error) => {
            // remove file from local uploads folder
            fs.unlink(localFilePath);
            return { message: 'Fail' }
        });
};

/** function to generate simple html to which to pass image url */
function buildSuccessMsg(urlList) {
    // building success message
    var response = `<h1><a href='/'>Click to go to home page</a></h1>`;

    for(var i = 0; i < urlList.length; i++){
        response += `File uploaded successfully. <br><br>`;
        response += `FILE URL: <a href='${urlList[i]}'>${urlList[i]}</a>. <br><br>`;
        response += `<img src=${urlList[i]} /><br><br>`
    }
    response += `<br><p>Now you can store this url in database.</p>`
    return response;
}

/** app urls */
app.post('/profile-upload-single', upload.single('profile-file'), async (req, res, next) => {
    // req.file is the 'profile-file' file
    // req.body will hold the text fields, if there were any
    var locaFilePath = req.file.path;
    var result = await uploadToCloudinary(locaFilePath);
    var response = buildSuccessMsg([result.url])
    return res.send(response);
});

app.post('/profile-upload-multiple', upload.array('profile-files', 12), async (req, res, next) => {
    // req.files is the array of 'profile-files' files
    // req.body will contain the text fields, if there were any
    var imageUrlList = [];

    for(var i = 0; i < req.files.length; i++) {
        var localFilePath = req.files[i].path;
        var result = await uploadToCloudinary(localFilePath);
        imageUrlList.push(result.url);
    }

    var response = buildSuccessMsg(imageUrlList);

    return res.send(response);
})

/** connet app */
const port = process.env.PORT;
app.listen(`${port}`, () => {
    console.log(`Server running on port ${port}`);
});
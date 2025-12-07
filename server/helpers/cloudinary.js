const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
    cloud_name: "xxxxx",
    api_key: "xxxxxx",
    api_secret: "xxxxxxx",
});

const storage = new multer.memoryStorage();

async function ImageUploadUtils(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    });

    return result;
}

const upload = multer({ storage });

module.exports = { upload, ImageUploadUtils }

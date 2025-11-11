const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
    cloud_name: "dki2cfynq",
    api_key: "872754459647672",
    api_secret: "de4b6IvqwnzRWR7kOtSNjmix9EY",
});

const storage = new multer.memoryStorage();

async function ImageUploadUtils(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto'
    });

    return result;
}

const upload = multer({storage});

module.exports = {upload, ImageUploadUtils}

const Feature = require("../../models/Feature");
const { ImageUploadUtils } = require("../../helpers/cloudinary");

const addFeatureImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const uploadedImage = await ImageUploadUtils(image);

        const featureImages = new Feature({
            image: uploadedImage.secure_url,
        });

        await featureImages.save();

        res.status(201).json({
            success: true,
            data: featureImages,
        });
    } catch (e) {
        console.log("Error in addFeatureImage:", e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

const getFeatureImages = async (req, res) => {
    try {
        const images = await Feature.find({});
        res.status(200).json({
            success: true,
            data: images,
        });
    } catch (e) {
        console.log("Error in getFeatureImages:", e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

module.exports = { addFeatureImage, getFeatureImages };

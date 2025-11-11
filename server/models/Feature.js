const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Feature", featureSchema);

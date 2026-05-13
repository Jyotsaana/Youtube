import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// configuration

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// upload function

const uploadOnCloudinary = async (localFilePath) => {

    try {

        // check if file exists

        if (!localFilePath) return null;

        // upload file

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto"
            }
        );

        // file uploaded successfully

        console.log("File uploaded on Cloudinary:", response.url);

        // remove local file after upload

        fs.unlinkSync(localFilePath);

        return response;

    }
    catch (error) {

        // remove locally saved temp file
         console.log("Cloudinary Error:", error);
        fs.unlinkSync(localFilePath);

        return null;
    }

};

export { uploadOnCloudinary };
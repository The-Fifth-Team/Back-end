const cloudinary = require('cloudinary').v2;
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const path = require("path");
// cloudinary.config({
//     cloud_name: "dwtaamxgn",
//     api_key: "431917237583798",
//     api_secret: "LC0J_kCL5lesk7PVP1KviAgHSKY"
// });

// const photos = [];

const resolvers = {
    Mutation: {
        async uploadPhoto(parent, { photo }) {
            const { filename, createReadStream } = await photo;
            const current = path.join(__dirname, "../images", filename);
            try {
                const result = await new Promise((resolve, reject) => {
                    createReadStream().pipe(createWriteStream(current))
                    console.log("Upload Complite")
                });
                // const newPhoto = { filename, path: result.secure_url };
                // photos.push(newPhoto);
                // return newPhoto;
            } catch (err) {
                console.log(err)
            }
        }
    }
};

module.exports = resolvers;
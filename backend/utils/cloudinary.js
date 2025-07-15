const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const opts = {
  folder: "proofs", // default base folder
  use_filename: true,
  unique_filename: false,
  overwrite: false,
};

const uploadProof = async (filePath, user) => {
  const folderPath = `proofs/${user._id}_${user.firstName}`;
  return await cloudinary.uploader.upload(filePath, {
    ...opts,
    folder: folderPath,
    context: `user=${user.firstName}|email=${user.email}`
  });
};

module.exports = {
  cloudinary,
  uploadProof
};

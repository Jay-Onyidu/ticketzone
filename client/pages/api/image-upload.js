import singleUploadCtrl from '../../utils/uploadHelper';
const dev = process.env.NODE_ENV !== 'production';
const path = require('path');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

const formatBufferTo64 = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

const handler = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Image not present');
    }

    const file64 = formatBufferTo64(req.file);

    const uploadResult = await cloudinaryUpload(file64.content);

    return res.json({
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.secure_url,
    });
  } catch (e) {
    return res.status(422).send({ message: e.message });
  }
};
export default singleUploadCtrl(handler);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

// //Good formidable
// export default async (req, res) => {
//   const promise = new Promise((resolve, reject) => {
//     const form = new formidable.IncomingForm();

//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });

//   return promise.then(({ fields, files }) => {
//     res.status(200).json({ fields, files });
//   });

// return promise.then(({ fields, files }) => {
// const uploadResult = await cloudinaryUpload(files.image.path);
// return res.json({
//   cloudinaryId: uploadResult.public_id,
//   url: uploadResult.secure_url,
// });
// });
// };
//   //End Good formidable

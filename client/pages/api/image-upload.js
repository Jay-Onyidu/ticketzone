const formidable = require('formidable');
const fs = require('fs');
//import Cors from 'cors';

// Initializing the cors middleware
// const cors = Cors({
//   methods: ['GET', 'POST'],
// });

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Good formidable

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }

//       return resolve(result);
//     });
//   });
// }
export default async (req, res) => {
  //await runMiddleware(req, res, cors);
  const promise = new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  return promise.then(({ fields, files }) => {
    const file = files.image;
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: 'tickets' },
      async (err, result) => {
        if (err) throw err;

        //removeTmp(file.tempFilePath)

        return res.json({
          cloudinaryId: result.public_id,
          url: result.secure_url,
        });
      }
    );
  });
};
//End Good formidable
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

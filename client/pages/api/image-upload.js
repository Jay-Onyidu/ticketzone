// import singleUploadCtrl from '../../utils/uploadHelper';
// const dev = process.env.NODE_ENV !== 'production';
// const path = require('path');
// const DatauriParser = require('datauri/parser');
// const parser = new DatauriParser();
const formidable = require('formidable');
const fs = require('fs');

// const formatBufferTo64 = (file) =>
//   parser.format(path.extname(file.originalname).toString(), file.buffer);
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
const cloudinary = require('cloudinary');
//const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//const cloudinaryUpload = (path,folder) => cloudinary.uploader.upload(path,folder);

// const handler = async (req, res) => {
//   try {
//     if (!req.file) {
//       throw new Error('Image not present');
//     }

//     const file64 = formatBufferTo64(req.file);

//     const uploadResult = await cloudinaryUpload(file64.content);

//     return res.json({
//       cloudinaryId: uploadResult.public_id,
//       url: uploadResult.secure_url,
//     });
//   } catch (e) {
//     return res.status(422).send({ message: e.message });
//   }
// };
// export default singleUploadCtrl(handler);

//Good formidable
export default async (req, res) => {
  const promise = new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  // return promise.then(({ fields, files }) => {
  //   res.status(200).json({ fields, files });
  // });

  //   cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err, result)=>{
  //     if(err) throw err;

  //     removeTmp(file.tempFilePath)

  //     res.json({public_id: result.public_id, url: result.secure_url})
  // })

  return promise.then(({ fields, files }) => {
    const file = files.image;
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: 'tickets' },
      async (err, result) => {
        if (err) throw err;

        //removeTmp(file.tempFilePath)

        res.json({ cloudinaryId: result.public_id, url: result.secure_url });
      }
    );
    // const uploadResult = await cloudinaryUpload(file.tempFilePath ,{folder:'tickets'});
    //  return res.json({
    //   cloudinaryId: uploadResult.public_id,
    //   url: uploadResult.secure_url,
    // });
  });
};
//End Good formidable
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

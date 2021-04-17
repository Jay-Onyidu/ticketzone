import singleUploadCtrl from '../../utils/uploadHelper';
const dev = process.env.NODE_ENV !== 'production';
const path = require('path');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

const formatBufferTo64 = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
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

const next = require('next');
const multer = require('multer');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
//const handleNextRequest = app.getRequestHandler();
const cors = require('cors');

const corsOptions = {
  origin: 'http://www.ticketzone-app-prod.club',
  //origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported .'), false);
  }
};

const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const singleUpload = upload.single('image');

const singleUploadCtrl = (req, res, next) => {
  singleUpload(req, res, (error) => {
    if (error) {
      return res.status(422).send({ message: 'Image upload failed.' });
    }
    next();
  });
};

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

const cors = Cors({
  methods: ['GET', 'HEAD'],
  corsOptions,
});
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req, res) => {
  // Run the middleware
  await runMiddleware(req, res, cors, singleUploadCtrl);
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

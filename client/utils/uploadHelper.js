const multer = require('multer');

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

const singleUploadCtrl = (handler) => async (req, res) => {
  singleUpload(req, res, (error) => {
    if (error) {
      return res.status(422).send({ message: 'Image upload failed.' });
    }
    return handler(req, res);
  });
};

export default singleUploadCtrl;

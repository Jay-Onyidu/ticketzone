const express = require('express');
const next = require('next');
const multer = require('multer');
const sharp = require('sharp');

const { v4: guidGenerator } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
//const handleNextRequest = app.getRequestHandler();
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.prepare().then(() => {
  const server = express();

  //add middleware
  server.use(express.json());
  server.use(
    express.urlencoded({
      extended: true,
    })
  );

  server.use(cors(corsOptions));

  //add custom path here

  //multer implementation
  //const ALLOWED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'public/img/tickets');
  //   },
  //   filename: (req, file, cb) => {
  //     // const ext = file.mimetype.split('/')[1];
  //     // cb(null, `tickets-${Date.now()}.${ext}`);
  //     const guid = guidGenerator();
  //     cb(null, guid + '_' + file.originalname);
  //   },
  // });

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
  // const resizeTicketImage = (req, res) =>
  //   sharp(req.file.buffer)
  //     .resize(350, 225)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 90 })
  //     .toBuffer();

  const singleUploadCtrl = (req, res, next) => {
    singleUpload(req, res, (error) => {
      if (error) {
        return res.status(422).send({ message: 'Image upload failed.' });
      }
      next();
    });
  };

  // const resizeTicketImageCtrl = async (req, res, next) => {
  //   resizeTicketImage(req, res, (error) => {
  //     if (error) {
  //       return res.status(422).send({ message: 'Image resize failed.' });
  //     }
  //   });

  //   next();
  // };

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

  server.post(
    '/api/image-upload',
    singleUploadCtrl,
    //resizeTicketImageCtrl,
    async (req, res) => {
      try {
        if (!req.file) {
          throw new Error('Image not present');
        }
        // const { data, info } = await sharp(req.file.buffer)
        //   .withMetadata()
        //   .resize({
        //     width: 350,
        //     height: 225,
        //   })
        //   .toFormat('png')
        //   .png()
        //   .toBuffer();
        // console.log(buffer);
        const file64 = formatBufferTo64(req.file);

        const uploadResult = await cloudinaryUpload(file64.content);

        return res.json({
          cloudinaryId: uploadResult.public_id,
          url: uploadResult.secure_url,
        });
      } catch (e) {
        return res.status(422).send({ message: e.message });
      }
    }
  );

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  // Let Next.js handle the rest, as we assume these are frontend routes
  // server.get('*', handleNextRequest);
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('Now ready on http://localhost:3000');
  });
});

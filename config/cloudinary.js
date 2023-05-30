import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET
//   });

  cloudinary.config({ 
    cloud_name: 'ddlsrqvw9', 
    api_key: '733788681563341', 
    api_secret: '7OFz4ruiBl_swXZoQfb9tqKQpi8' 
  });
  
  const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
      cb(null, file.originalname); 
    }
  });

  const uploadCloud = multer({ storage });
  
  export default uploadCloud;

import { diskStorage } from 'multer';
import * as path from 'path';

export const fixNullPrototype = async (data: any) => {
    return JSON.parse(JSON.stringify(data));
  };

  export const storageOptions = diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/uploads/');
    },
    // destination: "./uploads",
    filename: (req, file, callback) => {
      callback(null, generateFilename(file));
    },
  });

  export const ImageFilter = (req, file, cb) => {
    let isValid = false;
    if (
      isMimeTypeImage(file.mimetype) === true
    ) {
      isValid = true;
    }
    if (!isValid) {
      req.fileValidationError = 'Goes wrong on the Image FileType';
      cb(null, false, new Error('Goes wrong on the Image FileType'));
    }
    cb(null, true);
  };

  const isMimeTypeImage = (mimetype: string): boolean => {
    return (mimetype === 'image/jpeg' ||
      mimetype === 'image/png' ||
      mimetype === 'image/webp' ||
      mimetype === 'image/bmp' ||
      mimetype === 'image/x-ms-bmp') ? true : false
  }

  //? Storage Image Options
export const storageImageOptions = diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      callback(null, generateFilename(file));
    },
  });

  export function generateFilename(file) {
    return `${Date.now()}${path.extname(file.originalname)}`;
  }

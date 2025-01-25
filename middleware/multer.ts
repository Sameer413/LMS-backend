import multer from 'multer';
import path from 'path';

// File filter to validate MIME types
// const fileFilter = (req: any, file: any, cb: any) => {
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (allowedMimeTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type! Only JPEG and PNG are allowed.'), false);
//     }
// };

const imageStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './public/temp');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    },
});


// const videoStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/temp');  // Store videos in a separate folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));  // Unique file name
//     }
// });

export const uploadImageMulter = multer({
    storage: imageStorage,
    // fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
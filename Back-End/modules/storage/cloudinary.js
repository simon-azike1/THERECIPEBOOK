import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to determine resource type and format
const getUploadConfig = (mimetype, originalname) => {
    const extension = originalname.split('.').pop().toLowerCase();
    if (mimetype.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(originalname)) {
        return {
            resource_type: 'image',
            format: 'webp',
            access_mode: 'public',
            use_filename: true,
            unique_filename: true
        };
    }
    return {
        resource_type: 'raw',
        format: extension,
        access_mode: 'public',
        use_filename: true,
        unique_filename: true
    };
};

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const config = getUploadConfig(file.mimetype, file.originalname);
        const timestamp = Date.now();
        const uniqueId = Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop().toLowerCase();
        const fieldname = file.fieldname.replace(/\.[^/.]+$/, "");

        return {
            folder: 'Nagidafoods',
            ...config,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
            public_id: config.resource_type === 'image'
                ? `${fieldname}-${timestamp}-${uniqueId}`
                : `${fieldname}-${timestamp}-${uniqueId}.${extension}`,
            transformation: config.resource_type === 'image' ? [
                { quality: 'auto:best' },
                { fetch_format: 'auto' }
            ] : [],
            resource_type: config.resource_type,
            type: 'upload',
            access_mode: 'public'
        };
    }
});

// Configure Multer
const uploadManager = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        // Check for authorization
        if (!req.get('Authorization')) {
            return cb(new Error('No authorization header'), false);
        }

        // Validate by mimetype AND extension as fallback
        const allowedImageTypes = [
            'image/jpeg', 'image/jpg', 'image/png',
            'image/gif', 'image/webp', 'image/avif',
            'application/octet-stream',
            '',
        ];
        const allowedDocTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        const allowedImageExtensions = /\.(jpg|jpeg|png|gif|webp|avif)$/i;
        const isImageByExt  = allowedImageExtensions.test(file.originalname);
        const isImageByMime = allowedImageTypes.includes(file.mimetype);
        const isDoc         = allowedDocTypes.includes(file.mimetype);

        if (isImageByMime || isImageByExt || isDoc) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Got: ${file.mimetype}`), false);
        }
    }   // ← closes fileFilter
});     // ← closes multer()

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            result: {
                success: false,
                message: `Upload error: ${err.message}`,
                statusCode: 400
            }
        });
    }
    if (err) {
        return res.status(400).json({
            result: {
                success: false,
                message: err.message,
                statusCode: 400
            }
        });
    }
    next();
};

const uploadToCloudinary = async (file, folder) => {
    try {
        const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
        const result = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: resourceType,
            access_mode: 'public',
        });
        fs.unlinkSync(file.path);
        return result;
    } catch (error) {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw error;
    }
};

export { uploadManager, handleUploadErrors, uploadToCloudinary };
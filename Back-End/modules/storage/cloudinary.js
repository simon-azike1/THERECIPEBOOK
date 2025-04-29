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
    
    // For images
    if (mimetype.startsWith('image/')) {
        return {
            resource_type: 'image',
            format: 'webp',
            access_mode: 'public',
            use_filename: true,
            unique_filename: true
        };
    }
    
    // For PDFs and other documents
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
        
        // Remove extension from fieldname if it exists
        const fieldname = file.fieldname.replace(/\.[^/.]+$/, "");
        
        return {
            folder: 'Nagidafoods',
            ...config,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
            // Add extension only for documents
            public_id: file.mimetype.startsWith('image/') 
                ? `${fieldname}-${timestamp}-${uniqueId}`
                : `${fieldname}-${timestamp}-${uniqueId}.${extension}`,
            transformation: file.mimetype.startsWith('image/') ? [
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

        // Validate file types
        const allowedImageTypes = ['image/jpeg','image/jpg', 'image/png', 'image/gif'];
        const allowedDocTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        if (allowedImageTypes.includes(file.mimetype) || allowedDocTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Add error handling middleware
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
        // Determine resource type based on file mimetype
        const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';

        const result = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: resourceType, 
            access_mode: 'public', 
        });

        // Delete file from local storage after upload
        fs.unlinkSync(file.path);
        
        return result;
    } catch (error) {
        // Delete file from local storage if upload fails
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw error;
    }
};

export { uploadManager, handleUploadErrors, uploadToCloudinary };
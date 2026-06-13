// No-op middleware — image is now handled as base64 in request body
// This file kept for backward compatibility with route imports
const multer = require('multer');
module.exports = multer({ storage: multer.memoryStorage() });

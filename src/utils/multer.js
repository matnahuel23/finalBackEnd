const multer = require('multer');
const fs = require('fs');

const storage = (type) => multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (type === 'profile') {
      folder = 'src/public/img/profiles';
    } else if (type === 'product') {
      folder = 'src/public/img/products';
    } else {
      folder = 'src/public/img/documents';
    }

    // Verificar si la carpeta existe, si no, la crea
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const multerConfig = (type) => multer({ storage: storage(type) }).single('file');

module.exports = multerConfig;

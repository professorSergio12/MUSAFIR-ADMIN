import multer from "multer";
const storage = multer.memoryStorage();

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export default multerUpload;

import multer from "multer";
import fs from 'fs'
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const tempUploadDir = path.join(process.cwd(), "tmp")
        // if (!fs.existsSync(tempUploadDir)) {
        //     fs.mkdirSync(tempUploadDir);
        // }
        cb(null, './uploads')
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});
export default upload;
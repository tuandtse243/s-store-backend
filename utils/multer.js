import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// console.log(__filename)
const __dirname = path.resolve(path.dirname(__filename), "../");
// console.log(__dirname)

const storage = multer.diskStorage({
    
    destination: function (req,res,cb){
        cb(null, path.join(__dirname, '/uploads'));
    },
    filename: function (req,file,cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.originalname.split(".")[0];
        cb(null,filename + "-" + uniqueSuffix + ".png");
    },
});

export default multer({storage: storage});
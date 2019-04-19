const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req,file, cb)=>{
        cb(null, '/public/images');
    },
    filename: (req,file, cb)=>{
        cb(null, Date.now() + '-' +file.filename);
    }
})
function fileFilter(req,file, cb){
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg')
        return cb(null,true);
    return cb(new Error('File not allow!'))
}
const upload = multer({
    storage, fileFilter, limits:{ fileSize:102400}
})
module.exports = upload;
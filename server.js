const express = require('express')
const mongoose = require('mongoose');
const { SingerModel } = require('./models/Singer')
const bodyParser = require('body-parser')
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
const app = express();

mongoose.connect('mongodb://localhost/singer1503',{
    useNewUrlParser:true,
    useCreateIndex:true
})
app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    SingerModel.find()
    .then(singers=>{
        res.render('index',{singers})
    })
    .catch(err=>console.log(err))
})

app.get('/add-singer',(req,res)=>{
    res.render('add')
})
app.post('/add-singer',(req,res)=>{
    
})
app.get('/update/:id',(req,res)=>{
    const {id} = req.params
    //check id exixts in arrSinger
    
})
app.post('/update',(req,res)=>{
    const { id_singer, name, avatar, link } = req.body
    
})
app.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    
})
const port = process.env.PORT || 3000
app.listen(port)

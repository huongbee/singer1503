const express = require('express')
const mongoose = require('mongoose');
const { SingerModel } = require('./models/Singer')
const bodyParser = require('body-parser')
const upload = require('./lib/uploadfile.config');
const flash = require('connect-flash');
const session = require('express-session')
const app = express();

// yarn add fs

mongoose.connect('mongodb://localhost/singer1503',{
    useNewUrlParser:true,
    useCreateIndex:true
})
app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine','ejs');
app.use(express.static('./public/'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.error_message = req.flash('error_message');
    res.locals.success_message = req.flash('success_message')
    next();
})

app.get('/',(req,res)=>{
    SingerModel.find()
    .then(singers=>{
        res.render('index',{singers})
    })
    .catch(err=>{
        req.flash('error_message',err.message)
        return res.redirect('/')
    })
})

app.get('/add-singer',(req,res)=>{
    res.render('add')
})
app.post('/add-singer',(req,res)=>{
    upload.single('avatar')(req,res,err=>{
        if(err){
            req.flash('error_message',err.message)
            return res.redirect('/add-singer')
        }
        const { name, link } = req.body;
        const avatar = req.file;
        SingerModel.create({
            name,
            link,
            avatar: avatar.filename
        })
        .then(()=>{
            res.redirect('/');
        })
        .catch(err=>{
            req.flash('error_message',err.message)
            return res.redirect('/add-singer')
        })
    })
})
app.get('/update/:id',(req,res)=>{
    const { id } = req.params
    SingerModel.findById(id)
    .then(singer=>{
        if(singer){
            res.render('update',{singer})
        }
        else{
            req.flash('error_message', 'Singer not found!')
            return res.redirect('/')
        }
    })
    .catch(err=>{
        // req.flash('error_message',err.message)
        req.flash('error_message', 'SingerID not found!')
        return res.redirect('/')
    })
})
app.post('/update',(req,res)=>{
    upload.single('avatar')(req,res,err=>{
        const { id_singer, name, link } = req.body
        const avatar = req.file;
        if(err){
            req.flash('error_message', err.message)
            return res.redirect(`/update/${id_singer}`)
        }
        SingerModel.findById(id_singer)
        .then(singer=>{
            if(singer!=null){
                //check isset avatar to change filename in db
                const avatarName = avatar ? avatar.filename : singer.avatar
                return SingerModel.update({_id:singer._id},{
                    name, link, 
                    avatar: avatarName
                })
            }
            else{
                req.flash('error_message', 'Singer not found!')
                return res.redirect('/')
            }
        })
        .then(()=>{
            req.flash('success_message', 'Update success!')
            return res.redirect('/')
        })
        .catch(err=>{
            req.flash('error_message', err.message)
            return res.redirect('/')
        })
    })
    
})
app.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    SingerModel.findByIdAndDelete(id)
    .then(()=>{
        req.flash('success_message', 'Delete success!')
        return res.redirect('/')
    })
    .catch(err=>{
        req.flash('error_message', err.message)
        return res.redirect('/')
    })
})
const port = process.env.PORT || 3000
app.listen(port)

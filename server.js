const express = require('express')
const {arraySinger, prefixImg, prefixLink, Singer} = require('./models/Singer')
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('index',{arraySinger, prefixImg, prefixLink})
})

app.get('/add-singer',(req,res)=>{
    res.render('add')
})
app.post('/add-singer',(req,res)=>{
    const { name, avatar, link } = req.body
    const id = Math.round(Math.random()*1000)
    const singer = new Singer(id,name,avatar,link)
    arraySinger.push(singer)
    return res.redirect('/')
})
app.get('/update/:id',(req,res)=>{
    const {id} = req.params
    //check id exixts in arrSinger
    const singer = arraySinger.find(singer=>singer.id == id)
    if(!singer) return res.send({error: 'Singer not found!'})
    res.render('update',{singer})
})
app.post('/update',(req,res)=>{
    const { id_singer, name, avatar, link } = req.body
    const singer = arraySinger.find(singer => singer.id == id_singer)
    if(!singer) return res.send({error: 'Singer not found!'})
    singer.name = name
    singer.avatar = avatar
    singer.link = link
    return res.redirect('/')
})
app.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    const index = arraySinger.findIndex(singer=>singer.id == id)
    if(index<0) return res.send({error: 'Singer not found!'})
    arraySinger.splice(index,1)
    return res.redirect('/')
})
const port = process.env.PORT || 3000
app.listen(port)

/**
 * - install heroku
 * - instal git
 * - add scripts
 * - change port
 * 
 */
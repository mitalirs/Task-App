const express = require('express')
const multer = require('multer') 
const sharp = require('sharp')
const User = require("../models/user") 
const auth = require('../middleware/auth') 
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')//destructuring 
const router = new express.Router()

//signup
router.post('/users', async (req, res)=>{
    const user = new User(req.body) 
    try{
        await user.save()  
        sendWelcomeEmail(user.email, user.name)
        //geneate tokens for signup, after saving;
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})



router.post('/users/logout', auth, async(req, res)=>{
    try{
        //no need to fetch user again, since we have authenticated using auth middleware we now have access to user
        //req.user is the user
        req.user.tokens = req.user.tokens.filter((token)=>{  
            return token.token !== req.token  
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

//logout from all sessions, remove all the tokens

router.post('/users/logoutALL', auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth,  async (req, res)=>{
    res.send(req.user)  //we now get an individual user
})

//login
router.post('/users/login', async(req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})  
    }catch(e){
        res.status(400).send()
    }
})



router.patch('/users/me', auth, async(req, res)=>{
    const updates = Object.keys(req.body) 
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: "invalid updates!"})
    }
    try{
        updates.forEach((update)=>{ 
            req.user[update] = req.body[update] //syntax in place of hardcoding like req.user.name/req.user.email/req.user.age
        })

        await req.user.save() 

       res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

//delete profile
router.delete('/users/me', auth,  async (req, res)=>{
    try{

        await req.user.remove() 
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user) 
    }catch(e){
        return res.status(500).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('Please upload an image '))
        }
        cb(undefined, true)
    }
})


//upload avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() 
    req.user.avatar = buffer

    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message}) 
})


// delete avatar
router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined; 
    await req.user.save()
    res.send()
})

//fetching avatar
router.get('/users/:id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        //set response header, using .set
        res.set('Content-Type', 'image/png') 
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})

module.exports = router
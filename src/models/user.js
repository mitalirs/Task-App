const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        unique: true, 
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value) {
            if(value<0){
                throw new Error('age must be a positive number')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error ("cannot contain password")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }] ,
    avatar : {
        type: Buffer
    }

}, { 
    timestamps: true 
})

userSchema.virtual('tasks', {
    ref: 'Task',  
    localField: '_id', 
    foreignField: 'owner' 
})




userSchema.methods.toJSON = function() {  //works w/o we explicitly calling it while returning user everytime
    const user = this
    const userObject = user.toObject()//gives us raw profile data

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar 

    return userObject 
    
}   


userSchema.methods.generateAuthToken = async function(){   
    const user = this 
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET) 
    user.tokens = user.tokens.concat({token:token}) 
    user.save() //generating tokens+saving them
    return token
    
}


userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email: email}) //else ({email})

    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)  //bcrypt.compare takes 2 args, 1st: plainTextPassword 2nd: hashedPassword

    if(!isMatch){
        throw new Error('unable to login')
    }

    return user
}

userSchema.pre('save',async function (next){
    const user = this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)  // hashed password 
    }
    next() //if not called things would hang forever

}) 
userSchema.pre('remove',async function (next){  //pre remove => before user deletes himself
    const user = this 
    await Task.deleteMany({owner: user._id})  //have to use await as it is an asynchronous process
    next() 

})
const User = mongoose.model('User', userSchema)  
module.exports = User


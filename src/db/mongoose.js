const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: tru,
    useFindAndModify:false, 
    useUnifiedTopology: true 
})


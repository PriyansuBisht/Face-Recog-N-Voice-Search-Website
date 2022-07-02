const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/faceVoiceNodeProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
}).then( () => {
    console.log(`Node.js - MongoDB : Connection Sucessful`);
}).catch( (err) => {
    console.log(`Node.js - MongoDB : Connection Un-Sucessful`);
})
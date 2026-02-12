require('dotenv').config();
const app = require('./src/app');
const connectToDatabase = require('./src/config/db')


connectToDatabase()
app.listen(3000,()=>{
    console.log('server is starting on port 3000');
})
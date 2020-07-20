const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url.replace(process.env.MONGODB_CRED, 'usr:hunter2'))

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(_ => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

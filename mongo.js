const mongoose = require("mongoose")

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]
const url =
`mongodb+srv://jani:${password}@cluster0.a96ed.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url,
	{ useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})

const personSchema = new mongoose.Schema({
	number: String,
	name: String
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

if (process.argv.length === 5) {
	// New object of Person
	const person = new Person({
		number: process.argv[4],
		name: process.argv[3]
	})
	// Save to database
	person.save().then(response => {
		console.log(`added ${response.name} number ${response.number} to phonebook`)
		mongoose.connection.close()
	})
}

else if (process.argv.length === 3) {
	Person.find({}).then(result => {
		console.log(`phonebook contains ${result.length} persons:`)
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}

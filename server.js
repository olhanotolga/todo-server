const express = require('express');
const { v4: uuidv4 } = require('uuid');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = 5000;

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`);
})

app.use(express.json());

const adapter = new FileSync('data/db.json');
const db = lowdb(adapter);
db.defaults({todos: []}).write();

app.get('/', (req, res) => {
	res.send('Welcome to the todo server!\nStay tuned for documentation...');
})

// GET todos
app.get('/todos', (req, res) => {
	const todos = db.get('todos').value();
	
	res.send(todos);
})

// GET todo by id
app.get('/todos/:id', (req, res) => {
	const { id } = req.params;

	const todo = db.get('todos').find({id}).value();

	if (!todo) res.send({error: `No item with id ${id} found :(`});
	res.send(todo);
})

// POST todo
app.post('/todos', (req, res) => {
	const {text} = req.body;
	console.log(req.body);

	const id = uuidv4();
	const dateTime = new Intl.DateTimeFormat("en" , {dateStyle: "short"});
	const date = dateTime.format(Date.now());

	const newTodo = {
		id,
		text,
		date
	}

	db.get('todos').push(newTodo).write();

	res.send(newTodo);
})

// DELETE todo
app.delete('/todos/:id', (req, res) => {
	const { id } = req.params;

	const todo = db.get('todos').find({id}).value();
	
	if (!todo) {
		return res.send({error: `No item with id ${id} found :(`});
	}

	db.get('todos').remove({id}).write();

	res.send({removed: todo.text});
})

// UPDATE todo
app.put('/todos/:id', (req, res) => {
	const { id } = req.params;
	const { text } = req.body;
	
	const todo = db.get('todos').find({id}).value();
	if (!todo) {
		return res.send({error: `No item with id ${id} found :(`});
	}

	db.get('todos').find({id}).assign({text}).write();

	const newTodo = db.get('todos').find({id}).value();

	res.send(newTodo);
})

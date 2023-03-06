const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const UsernameExist = users.find((user) => user.username === username);

  if(!UsernameExist) return response.status(404).json({error:'User not found'})

  request.usernameexist = UsernameExist

  next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const user = {
    id: uuidv4(),
    name, 
    username,
    todos: []
  }
  const UsernameExist = users.find((user) => user.username === username);
  if(UsernameExist) return response.status(400).json({error:'User already exists'})

  users.push(...users, user);
  response.status(200).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { usernameexist } = request

  response.status(201).json(usernameexist.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { usernameexist } = request
  const {title, deadline} = request.body
  

  const createtodos = {
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }
  usernameexist.todos.push(createtodos)
  return response.status(201).json(createtodos);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { usernameexist } = request
  const { id } = request.params
  const { title, deadline } = request.body;

  const findtodos = usernameexist.todos.find(user => user.id === id)

  if(!findtodos) return response.status(404).json({error: 'todos not found'})


  findtodos.title = title;
  findtodos.deadline = new Date(deadline);

 

  return response.status(201).json(findtodos);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { usernameexist } = request
  const { id } = request.params

  const findtodos = usernameexist.todos.find(user => user.id === id)

  if(!findtodos) return response.status(404).json({error: 'todos not found'})

  findtodos.done = true


  return response.status(201).json(findtodos);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { usernameexist } = request
  const { id } = request.params

  const todosIndex = usernameexist.todos.findIndex(user => user.id === id)
  
if(todosIndex === -1){
  return response.status(404).json({error: 'Todo not found'})
} 

usernameexist.todos.splice(todosIndex, 1)

return response.status(204).json()
  

});

module.exports = app;
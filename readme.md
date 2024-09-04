# TODO CRUD API 

This is a simple Node.js-based CRUD (Create, Read, Update, Delete) API for managing a todo list using builtin modules. The todos are stored in a JSON file named `todos.json`. The API provides endpoints to create, retrieve, update, and delete todo items.

## Builtin Modules used
        os
        fs
        path
        url 
        http
        
## Features

- **Create Todo:** Add a new todo item.
- **Retrieve Todos:** Fetch all todos or a specific todo by ID.
- **Update Todo:** Modify an existing todo item.
- **Delete Todo:** Remove a todo item by its ID.

## Installation

1. Clone the repository or download the source code.
  
        git clone https://github.com/Ivar246/Internship-Task-2

2. Navigate to the project directory.
3. Install the required dependencies using npm:

   ```bash
   npm install

### API End Points

        GET /api/todo/todos

        GET /api/todo?id=faldjflalkdfja

        POST /api/todo/create

        PUT /api/todo/update?id=fadfadfssfds

        DELETE /api/todo/delete?id=fadflsdkjflaj
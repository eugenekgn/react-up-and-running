import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo/';
import {addTodo, generateRandomId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from "./lib/todoHelpers";
import {pipe, partial} from "./lib/utils";
import {loadTodos, createTodo, saveTodo, destroyTodo} from "./lib/todoServer";

class App extends Component {

  state = {
    todos: [],
    currentToDo: '',

  };

  componentDidMount() {
    loadTodos()
      .then(todos => this.setState({todos: todos}));
  }

  handleSubmit = (event) => {

    event.preventDefault();
    const newId = generateRandomId();
    const newTodo = {id: newId, name: this.state.currentToDo, isComplete: false};
    const updateTodos = addTodo(this.state.todos, newTodo);
    this.setState({
      todos: updateTodos,
      currentToDo: '',
      errorMessage: ''
    });

    createTodo(newTodo).then(() => {
      this.showMessage('Todo added')
    })
  };


  showMessage = (msg) => {
    this.setState({message: msg});
    setTimeout(() => this.setState({message: ''}), 2500);
  };

  handleEmptySubmit = (event) => {
    event.preventDefault();
    this.setState({
      errorMessage: 'Please supply a todo name'
    });
  };

  handleToggle = (id) => {
    // const todo = findById(id, this.state.todos);
    // const toggled = toggleTodo(todo);
    // const updatedTodos = updateTodo(this.state.todos, toggled);
    //const getUpdatedTodos = pipe(findById, toggleTodo, partial(updateTodo, this.state.todos));

    const getToggledTodo = pipe(findById, toggleTodo);
    const updated = getToggledTodo(id, this.state.todos);
    const getUpdatedTodos = partial(updateTodo, this.state.todos);
    const updatedTodos = getUpdatedTodos(updated);

    this.setState({
      todos: updatedTodos
    });

    saveTodo(updated).then(() => this.showMessage('Updated!'));
  };


  handleInputChange = (event) => {
    const value = event.target.value;
    this.setState({
      currentToDo: value
    });
  };

  handleRemove = (id, event) => {
    event.preventDefault();

    const updatedTodos = removeTodo(this.state.todos, id);
    this.setState({
      todos: updatedTodos
    });

    destroyTodo(id).then(() => {
      this.showMessage('Todo Removed!')
    });
  };

  static
  contextTypes = {
    route: React.PropTypes.string
  };

  render() {
    const submitHandler = this.state.currentToDo ? this.handleSubmit : this.handleEmptySubmit;
    const displayTodos = filterTodos(this.state.todos, this.context.route);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>React Todos</h2>
        </div>
        <div className="todo-app">
          {this.state.errorMessage && <span className="error">{this.state.errorMessage}</span>}
          {this.state.message && <span className="success">{this.state.message}</span>}
          <TodoForm handleInputChange={this.handleInputChange}
                    currentToDo={this.state.currentToDo}
                    handleSubmit={submitHandler}
          />
          <TodoList todos={displayTodos}
                    handleToggle={this.handleToggle}
                    handleRemove={this.handleRemove}
          />
          <Footer/>
        </div>

      </div>
    );
  }
}

export default App;

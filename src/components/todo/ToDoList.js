// stateless functional component
import React from 'react';
import {TodoItem} from './ToDoItem';

export const TodoList = (props) => {
  return (
    <div className="todo-list">
      <ul>
        {props.todos.map(todo => <TodoItem handleToggle={props.handleToggle} key={todo.id} {...todo} handleRemove={props.handleRemove}/>)}
      </ul>
    </div>
  )
};

TodoList.PropTypes = {
  todos: React.PropTypes.array.isRequired,

};
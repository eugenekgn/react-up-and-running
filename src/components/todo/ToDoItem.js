import React from 'react';
import {partial} from '../../lib/utils';

export const TodoItem = (props) => {
  const handleToggle = partial(props.handleToggle, props.id);
  const handleRemove = partial(props.handleRemove, props.id);
  return (
    <li key={props.id}>
      <span className="delete-item">
        <a href="#" onClick={handleRemove}>x</a>
      </span>
      <input type="checkbox"
             onChange={handleToggle}
             checked={props.isComplete}/> {props.name}
    </li>
  )
};

TodoItem.PropTypes = {
  name: React.PropTypes.string.isRequired,
  isComplete: React.PropTypes.isRequired,
  id: React.PropTypes.number.isRequired
};
import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import Checkbox from "./components/Checkbox";
import { Row } from "./components/FlexboxGrid";
import { KeyCode } from "./utils/constants";

const Item = styled(Row)`
  position: relative;
  font-size: 24px;

  label {
    word-break: break-all;
    padding: 15px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }
  label.completed {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  label.time {
    margin-left: 2em;
    font-size: 50%;
    color: #737373;
  }

  button.destroy {
    visibility: hidden;
    width: 30px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    text-align: left;
    color: #cc9a9a;
    transition: color 0.2s ease-out;
    cursor: pointer;
    &:hover {
      color: #af5b5e;
    }
  }
  &:hover {
    button.destroy {
      visibility: visible;
    }
  }
`;

const Input = styled.input`
  display: block;
  width: calc(100% - 42px);
  padding: 12px 15px;
  margin: 0 0 0 40px;
  font-size: 24px;
  font-weight: 300;
  line-height: 1.4em;
  color: #4d4d4d;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
`;

class TodoItem extends React.Component {
  state = {
    editText: "",
    editting: false,
  };

  intoEdit = () => {
    this.setState({ editText: this.props.todo.name, editting: true });
  };

  inputText = event => {
    this.setState({ editText: event.target.value });
  };

  submitText = () => {
    var name = this.state.editText.trim();
    if (name) {
      this.props.onUpdate(name);
      this.setState({ editting: false });
    } else {
      this.props.onDestroy();
    }
  };

  handleKeyDown = event => {
    if (event.which === KeyCode.Escape) {
      this.setState({ editting: false });
    } else if (event.which === KeyCode.Enter) {
      this.submitText();
    }
  };

  render() {
    const { todo, filter, onToggle, onDestroy } = this.props;
    const { editText, editting } = this.state;
    return editting ? (
      <li>
        <Input
          autoFocus
          value={editText}
          onBlur={this.submitText}
          onChange={this.inputText}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    ) : (
      <Item as="li">
        <Checkbox checked={todo.completed} onToggle={onToggle} />
        <Row grow={1} space="between" valign="baseline">
          <label
            className={
              todo.completed && filter != "completed" ? "completed" : ""
            }
            onDoubleClick={this.intoEdit}
          >
            {todo.name}
          </label>
          <label className="time">
            {format(
              todo.completed && filter == "completed"
                ? todo.completedAt
                : todo.createdAt,
              "yyyy-MM-dd HH:mm"
            )}
          </label>
        </Row>
        <button className="destroy" onClick={onDestroy}>
          ×
        </button>
      </Item>
    );
  }
}

export default TodoItem;

import React from "react";
import styled from "styled-components";
import { Row } from "./components/FlexboxGrid";

const StyledFooter = styled(Row)`
  color: #777;
  padding: 10px 15px;
  text-align: center;
  border-top: 1px solid #e6e6e6;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
    0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
    0 17px 2px -6px rgba(0, 0, 0, 0.2);
`;

const Links = styled(Row)`
  a {
    margin: 3px;
    padding: 3px 7px;
    text-decoration: none;
    color: inherit;
    border: 1px solid transparent;
    border-radius: 3px;
  }
  a:hover {
    border-color: rgba(175, 47, 47, 0.1);
  }
  a.selected {
    border-color: rgba(175, 47, 47, 0.2);
  }
`;

function Footer({ filter, itemCount }) {
  const selected = self => (self == filter ? "selected" : "");
  const words = { all: "in total", active: "left", completed: "finished" };
  return (
    <StyledFooter as="footer" space="between" valign="middle">
      <label>
        <strong>{itemCount}</strong>&nbsp;
        {itemCount == 1 ? "item" : "items"}&nbsp;
        {words[filter]}
      </label>
      <Links>
        <a className={selected("all")} href="#all">
          All
        </a>
        <a className={selected("active")} href="#active">
          Active
        </a>
        <a className={selected("completed")} href="#completed">
          Completed
        </a>
      </Links>
      <label />
    </StyledFooter>
  );
}

export default Footer;

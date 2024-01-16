import { connect } from "react-redux";
import Header from "../components/header";
import { addTodo } from "../actions";

export default connect(null, { addTodo })(Header);

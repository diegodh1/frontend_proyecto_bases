import React, { Component } from 'react';
import { connect } from 'react-redux';
import { success_login_empleado, error_login_empleado } from '../../redux/actions';
import { withRouter, Redirect } from 'react-router-dom';


class Login_empleado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: '',
    };
  }

  render() {
    const { message } = this.props;
    return (
    <h1>{message}</h1>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    empleado: state.redux_reducer.empleado,
    message: state.redux_reducer.message
  };
}
const mapDispatchToProps = {
  success_login_empleado,
  error_login_empleado
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Login_empleado)

);
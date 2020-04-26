import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import store from './redux/store';
import Login_empleado from './components/login_empleado';
import Formulario_empleado from './components/formulario_empleado';
import Inicio from './components/inicio';


const Root = (
    <Provider store={store}>
    <BrowserRouter>
    <Switch>
        <Route path="/login_empleado" component={Login_empleado}/>
        <Route path="/formulario_empleado" component={Formulario_empleado}/>
        <Route path="/inicio" component={Inicio}/>
        <Redirect from="/" to="/inicio" />
    </Switch>
    </BrowserRouter>
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
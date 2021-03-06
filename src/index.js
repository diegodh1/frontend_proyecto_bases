import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import store from './redux/store';
import Login_empleado from './components/login_empleado';
import Formulario_empleado from './components/formulario_empleado';
import Formulario_usuario from './components/formulario_usuario';
import Login_usuario from './components/login_usuario';
import Dashboard from './components/inicio_usuario';
import Reporte from './components/inicio_usuario/reporte';
import Dashboard_empleado from './components/inicio_empleado';


const Root = (
    <Provider store={store}>
    <BrowserRouter>
    <Switch>
        <Route path="/login_empleado" component={Login_empleado}/>
        <Route path="/login_usuario" component={Login_usuario}/>
        <Route path="/formulario_empleado" component={Formulario_empleado}/>
        <Route path="/formulario_usuario" component={Formulario_usuario}/>
        <Route path="/inicio_usuario" component={Dashboard}/>
        <Route path="/inicio_empleado" component={Dashboard_empleado}/>
        <Route path="/reporte" component={Reporte}/>
        <Redirect from="/" to="/login_usuario" />
    </Switch>
    </BrowserRouter>
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
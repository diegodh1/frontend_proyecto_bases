import React, { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    TextField,
    Grid,
    IconButton,
    Tooltip,
    Slide,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { CheckCircleOutline, DeleteOutline } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card_root: {
        minWidth: 275,
        marginBottom: '2%',
    },
    card_bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    card_title: {
        fontSize: 14,
    },
    card_pos: {
        marginBottom: 12,
    },
    scroll_grid: {
        height: '500px',
        overflowY: 'scroll'
    },
}));


export default function Pedido() {
    const classes = useStyles();
    const { usuario, message } = useSelector(state => ({
        usuario: state.redux_reducer.usuario,
        message: state.redux_reducer.message,
    }));
    const dispatch = useDispatch();
    const [sugerencias, set_sugerencias] = useState([]);
    const [ocupacion, set_ocupacion] = useState('');
    const [cargando, set_cargando] = useState(false);
    const [ocupaciones, set_ocupaciones] = useState([]);
    const [ocupaciones_temp, set_ocupaciones_temp] = useState([]);
    const [descripcion_trabajo, set_descripcion_trabajo] = useState('');
    const [valor_hora, set_valor_hora] = useState('');
    const [valor_unidad, set_valor_unidad] = useState('');
    const [error, set_error] = React.useState(false);
    const [error_message, set_error_message] = useState('');
    const [success, set_success] = React.useState(false);
    const [success_message, set_success_message] = useState('');
    const [open, setOpen] = React.useState(false);
    const vertical = 'top';
    const horizontal = 'right';

    const add_ocupacion = () => {
        let temp = sugerencias;
        let ocup = ocupaciones_temp;

        if (!Number(valor_hora) && valor_hora != "0") {
            set_error(true);
            set_error_message('El precio por hora no puede estar vacio y debe ser un número');
        }
        else if (!Number(valor_unidad) && valor_unidad != "0") {
            set_error(true);
            set_error_message('El precio por unidad no puede estar vacio y debe ser un número');
        }
        else if (temp.filter(x => x == ocupacion).length === 0) {
            set_error(true);
            set_error_message('Seleccione una profesión válida');
        }
        else if (parseFloat(valor_unidad) < 0) {
            set_error(true);
            set_error_message('El precio por unidad debe ser mayor a cero');
        }
        else if (parseFloat(valor_hora) < 0) {
            set_error(true);
            set_error_message('El precio por hora debe ser mayor a cero');
        }
        else {
            ocup.filter(x => x.ocupacion_id === ocupacion).length === 0 ? ocup.push({ ocupacion_id: ocupacion, servicio_precio_hora: valor_hora, servicio_precio_unidad_labor: valor_unidad, servicio_descripcion: descripcion_trabajo }) : alert('Usted ya selecciono esta profesión');
            set_ocupaciones_temp(ocup);
            set_ocupacion('');
            set_valor_hora('');
            set_valor_unidad('');
            set_sugerencias([]);
            set_descripcion_trabajo('');
        }
    }
    const eliminar_ocupacion_temp = (value) => {
        let ocups = ocupaciones_temp;
        for (let i = 0; i < ocups.length; i++) {
            if (value === ocups[i].ocupacion_id) {
                ocups.splice(i, 1);
            }
        }
        set_ocupaciones_temp(ocups);
        set_valor_unidad("0");
    }
    const search_ocupacion = value => {
        set_cargando(true);
        set_ocupacion(value);
        fetch('http://localhost:4000/filtro_ocupacion', {
            method: 'POST',
            body: JSON.stringify({
                id: value
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 400 || response.status === 200) {
                    let sugg = [];
                    for (let i = 0; i < response.sugerencias.length; i++) {
                        sugg.push(response.sugerencias[i].ocupacion_id);
                    }
                    set_sugerencias(sugg);
                    set_cargando(false);
                }
                else {
                    set_sugerencias([]);
                    set_cargando(false);
                }
            })
            .catch(error => {
                set_sugerencias([]);
                set_cargando(false);
            });
    }
    const inactivar_servicio = servicio_nro => {

        fetch('http://localhost:4000/inactivar_servicio', {
            method: 'POST',
            body: JSON.stringify({
                servicio_nro
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_success(true);
                    set_success_message(response.message);
                    get_servicios_trabajador();
                }
                else {
                    set_error(true);
                    set_error_message(response.message);
                }
            })
            .catch(error => {
                set_error(true);
                set_error_message('error interno del servidor');
            });
    }
    const agregar_servicios_empleado = () => {

        fetch('http://localhost:4000/agregar_servicios_empleado', {
            method: 'POST',
            body: JSON.stringify({
                cedula: usuario.cedula,
                servicios: JSON.stringify(ocupaciones_temp)
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.length>0) {
                    set_success(true);
                    set_success_message('Servicios agregados con éxito');
                    get_servicios_trabajador();
                }
                else {
                    set_error(true);
                    set_error_message('No se pudieron agregar los servicios');
                }
            })
            .catch(error => {
                set_error(true);
                set_error_message('error interno del servidor');
            });
    }
    const get_servicios_trabajador = () => {
        fetch('http://localhost:4000/get_servicios_trabajador', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuario.cedula
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_ocupaciones(response.servicios);
                }
                else {
                    set_ocupaciones(response.servicios);
                }
            })
            .catch(error => {
                alert(error);
            });
    }
    useEffect(() => {
        fetch('http://localhost:4000/get_servicios_trabajador', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuario.cedula
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_ocupaciones(response.servicios);
                }
                else {
                    set_ocupaciones(response.servicios);
                }
            })
            .catch(error => {
                alert(error);
            });
    }, []);

    return (
        <Fragment>
            <h2 style={{ color: 'gray', textAlign: 'center' }}>
                AGREGAR UN NUEVO SERICIO
            </h2>
            <Grid container className={classes.root}>
                <Grid item xs={11}>
                    <Autocomplete
                        options={sugerencias}
                        getOptionLabel={option => option}
                        inputValue={ocupacion}
                        onChange={(e, v) => set_ocupacion(v)}
                        renderInput={params => (
                            <TextField
                                {...params}
                                onChange={({ target }) => search_ocupacion(target.value)}
                                label="Escribir Profesión"
                                fullWidth
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Tooltip title="Buscar Empleados" placement="top">
                        <IconButton
                            children={<Search fontSize="large" />}
                        />
                    </Tooltip>
                </Grid>
            </Grid>
            <br></br>
            <Grid container className={classes.root}>
                <Grid item xs={3}>
                    <TextField type="number" id="valor_hora" value={valor_hora} onChange={e => set_valor_hora(e.target.value)} label="Precio por hora" />
                </Grid>
                <Grid item xs={3} md={3}>
                    <TextField type="number" id="valor_unidad" value={valor_unidad} onChange={e => set_valor_unidad(e.target.value)} label="Precio por unidad" />
                </Grid>
                <Grid item xs={3} md={3}>
                    <TextField
                        id="standard-textarea"
                        label="Describa sus habilidades"
                        fullWidth
                        multiline
                        value={descripcion_trabajo} onChange={e => set_descripcion_trabajo(e.target.value)}
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <Button style={{ color: 'green', marginLeft: '5%' }} onClick={e => add_ocupacion()}>
                        Agregar
						<CheckCircleOutline style={{ fontSize: 30, marginLeft: '10px', color: 'green' }} />
                    </Button>
                </Grid>
            </Grid>
            <h3 style={{ textAlign: 'center', color: 'gray' }}>OCUPACIONES ALMACENADAS</h3>
            <TableContainer component={Paper} style={{ width: '97%' }}>
                <Table stickyHeader={true} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>OCUPACIÓN</TableCell>
                            <TableCell>PRECIO POR HORA</TableCell>
                            <TableCell>PRECIO UNIDAD LABOR</TableCell>
                            <TableCell>DESCRIPCIÓN</TableCell>
                            <TableCell>ELIMINAR</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {
                            ocupaciones_temp.map((element) => (
                                <TableRow key={element.ocupacion_id}>
                                    <TableCell>{element.ocupacion_id}</TableCell>
                                    <TableCell>{element.servicio_precio_hora}</TableCell>
                                    <TableCell>{element.servicio_precio_unidad_labor}</TableCell>
                                    <TableCell>{element.servicio_descripcion}</TableCell>
                                    <TableCell><IconButton onClick={e => eliminar_ocupacion_temp(element.ocupacion_id)} children={<DeleteOutline style={{ fontSize: 30, marginLeft: '10px', color: 'red' }} />} /></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ textAlign: 'center', marginTop: '4%' }}>
                <Button style={{ color: 'white', backgroundColor: 'green' }} variant="contained" onClick={e => agregar_servicios_empleado()}>
                    REGISTRAR TODAS LOS SERVICIOS ALMACENADOS
						<CheckCircleOutline style={{ fontSize: 30, marginLeft: '10px', color: 'green' }} />
                </Button>
            </div>
            <br></br>
            <h3 style={{ textAlign: 'center', color: 'gray' }}>OCUPACIONES REGISTRADAS</h3>
            <TableContainer component={Paper} style={{ width: '97%' }}>
                <Table stickyHeader={true} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>OCUPACIÓN</TableCell>
                            <TableCell>PRECIO POR HORA</TableCell>
                            <TableCell>PRECIO UNIDAD LABOR</TableCell>
                            <TableCell>DESCRIPCIÓN</TableCell>
                            <TableCell>ELIMINAR</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {
                            ocupaciones.map((element) => (
                                <TableRow key={element.ocupacion_id}>
                                    <TableCell>{element.ocupacion_id}</TableCell>
                                    <TableCell>{element.servicio_precio_hora}</TableCell>
                                    <TableCell>{element.servicio_precio_unidad_labor}</TableCell>
                                    <TableCell>{element.servicio_descripcion}</TableCell>
                                    <TableCell><IconButton onClick={e => inactivar_servicio(element.servicio_nro)} children={<DeleteOutline style={{ fontSize: 30, marginLeft: '10px', color: 'red' }} />} /></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={error} autoHideDuration={2000}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert onClose={() => set_error(false)} variant="filled" severity="error">
                    {error_message}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={2000}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert onClose={() => set_success(false)} variant="filled" style={{backgroundColor:'white', color:'black'}}>
                    {success_message}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}
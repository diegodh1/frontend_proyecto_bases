import React, { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Table, Button, Grid, TableBody, TableCell, TableContainer, Switch, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles({
    table: {
        width: '100%',
    },
    container: {
        maxHeight: 400,
    },
    root: {
        flexGrow: 1,
    },
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Servicio_pedido = () => {
    const { usuario, message } = useSelector(state => ({
        usuario: state.redux_reducer.usuario,
        message: state.redux_reducer.message,
    }));
    const dispatch = useDispatch();
    // INITIAL STATE
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [servicios_pedidos, set_servicios_pedidos] = React.useState([]);
    const [value, setValue] = React.useState('PENDIENTE');
    const [open, setOpen] = React.useState(false);
    const [servicio_pedido_id, set_servicio_pedido_id] = React.useState('');
    const [success, set_success] = useState(false);
    const [error, set_error] = useState(false);
    const [cantidad_pendientes, set_cantidad_pendientes] = useState(0);
    const [message_dialog, set_message_dialog] = useState('');
    const vertical = 'center';
    const horizontal = 'right';
    const [operacion, set_operacion] = React.useState('CANCELADO');

    const handleClickOpen = (id_pedido) => {
        set_servicio_pedido_id(id_pedido);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        let fecha = new Date();
        let fecha_hora = fecha.getFullYear() + "-" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "-" + ("0" + fecha.getDate()).slice(-2) + " " + ("0" + fecha.getHours()).slice(-2) + ":" + ("0" + fecha.getMinutes()).slice(-2) + ":" + ("0" + fecha.getSeconds()).slice(-2) + "-5";
        if (operacion !== 'ACEPTADO') {
            if (value === 'ACEPTADO') {
                actualizar_servicio_aceptado(servicio_pedido_id, operacion);
                if (operacion === 'CANCELADO') {
                    actualizar_servicio_pedido(servicio_pedido_id, operacion);
                }
            }
            else {
                actualizar_servicio_pedido(servicio_pedido_id, operacion);
            }
        }
        else {
            aceptar_servicio(servicio_pedido_id, fecha_hora);
            actualizar_servicio_pedido(servicio_pedido_id, operacion);
        }
        get_servicios(value);
    };
    const handleChange = (event) => {
        setValue(event);
        get_servicios(event);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const defaultProps = {
        color: 'secondary',
        children: <MailIcon />,
      };
    const get_servicios = estado => {
        let temp = 'http://localhost:4000/get_servicios_pedidos_trabajdor';

        let ruta = estado !== 'PENDIENTE' && estado !== 'CANCELADO' ? 'http://localhost:4000/get_servicios_aceptados_trabajador' : temp;
        fetch(ruta, {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuario.cedula,
                estado_servicio_id: estado,
                limite: 2
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_servicios_pedidos(response.servicios);
                }
                else {
                    set_servicios_pedidos(response.servicios);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    const actualizar_servicio_pedido = (servicio_pedido_id, estado_servicio) => {

        fetch('http://localhost:4000/modificar_estado_servicio', {
            method: 'POST',
            body: JSON.stringify({
                servicio_pedido_id,
                estado_servicio
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_success(true);
                    set_message_dialog(response.message);
                }
                else {
                    set_error(true);
                    set_message_dialog(response.message);
                }
            })
            .catch(error => {
                set_error(true);
                set_message_dialog(error);
            });
    }
    const actualizar_servicio_aceptado = (servicio_pedido_id, estado_servicio_id) => {

        fetch('http://localhost:4000/update_servicio_aceptado', {
            method: 'POST',
            body: JSON.stringify({
                servicio_pedido_id,
                estado_servicio_id
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_success(true);
                    set_message_dialog(response.message);
                }
                else {
                    set_error(true);
                    set_message_dialog(response.message);
                }
            })
            .catch(error => {
                set_error(true);
                set_message_dialog(error);
            });
    }
    const aceptar_servicio = (servicio_pedido_id, servicio_aceptado_fecha) => {

        fetch('http://localhost:4000/aceptar_servicio', {
            method: 'POST',
            body: JSON.stringify({
                servicio_pedido_id,
                servicio_aceptado_fecha
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_success(true);
                    set_message_dialog(response.message);
                }
                else {
                    set_error(true);
                    set_message_dialog(response.message);
                }
            })
            .catch(error => {
                set_error(true);
                set_message_dialog(error);
            });
    }

    useEffect(() => {
        fetch('http://localhost:4000/get_servicios_pedidos_trabajdor', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuario.cedula,
                estado_servicio_id: 'PENDIENTE',
                limite: 2
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_servicios_pedidos(response.servicios);
                }
                else {
                    set_servicios_pedidos(response.servicios);
                }
            })
            .catch(error => {
                alert(error);
            });
    }, []);
    setInterval(() => {
        fetch('http://localhost:4000/get_servicios_pedidos_trabajdor', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuario.cedula,
                estado_servicio_id: 'PENDIENTE',
                limite: 2
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    set_cantidad_pendientes(response.servicios.length);
                }
                else {
                    set_cantidad_pendientes(response.servicios.length);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, 3000);
    return (
        <Fragment>
            <h1 style={{ textAlign: 'center', color:'gray' }}><u>Ultimos Servicios Solicitados</u></h1>
            <br></br>
            <FormControl component="fieldset" style={{ flexDirection: "row" }}>
                <FormLabel component="legend">Filtrar por servicios</FormLabel>
                <RadioGroup row aria-label="servicios_group" name="servicios_group" value={value} onChange={e=>handleChange(e.target.value)}>
                    <FormControlLabel value="PENDIENTE" control={<Radio />} label="Pendientes" />
                    <FormControlLabel value="FINALIZADO" control={<Radio />} label="Finalizados" />
                    <FormControlLabel value="CANCELADO" control={<Radio />} label="Cancelados" />
                    <FormControlLabel value="ACEPTADO" control={<Radio />} label="Aceptados" />
                    <FormControlLabel value="OCUPADO" control={<Radio />} label="Ocupados" />
                </RadioGroup>

            </FormControl>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nro</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Nombre Cliente</TableCell>
                                <TableCell>Celular</TableCell>
                                <TableCell>Solicitud</TableCell>
                                <TableCell>Es por horas?</TableCell>
                                <TableCell>Precio x hora</TableCell>
                                <TableCell>Precio x unidad</TableCell>
                                <TableCell># de horas</TableCell>
                                <TableCell># de unidades</TableCell>
                                <TableCell>Valor a Pagar</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Modificar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {servicios_pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.servicio_pedido_id}>
                                        <TableCell>{row.servicio_pedido_id}</TableCell>
                                        <TableCell>{row.fecha}</TableCell>
                                        <TableCell>{row.usuario_nombre}</TableCell>
                                        <TableCell>{row.usuario_celular}</TableCell>
                                        <TableCell>{row.ocupacion_id}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={row.servicio_pedido_es_por_hora}
                                                name="checked"
                                                color="primary"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora ? row.servicio_precio_hora : "No Aplica"}</TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora ? "No Aplica" : row.servicio_precio_unidad_labor}</TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora ? row.servicio_pedido_horas : "No Aplica"}</TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora ? "No Aplica" : row.servicio_pedido_unidad_labor}</TableCell>
                                        <TableCell>{row.valor_servicio}</TableCell>
                                        <TableCell>{row.estado_servicio_id}</TableCell>
                                        {value !== 'PENDIENTE' && value !== 'ACEPTADO' && value !== 'OCUPADO' ? <TableCell>
                                            <IconButton disabled={true} style={{ color: 'gray' }} aria-label="upload picture" component="span" onClick={e => handleClickOpen(row.servicio_pedido_id)}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell> : <TableCell>
                                                <IconButton style={{ color: 'red' }} aria-label="upload picture" component="span" onClick={e => handleClickOpen(row.servicio_pedido_id)}>
                                                    <Edit />
                                                </IconButton>
                                            </TableCell>}

                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={servicios_pedidos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            {cantidad_pendientes!==0?
            <div style={{textAlign:'center', marginTop:'5%'}}>
                <Button color="secondary" onClick={e => handleChange("PENDIENTE")}>Tienes algunos servicios pendientes</Button>
                <Badge badgeContent={cantidad_pendientes} {...defaultProps} />
            </div>:
            null}
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    Qué operación desea realizar con el servicio?
                </DialogTitle>
                {value === 'ACEPTADO' ?
                    <Select
                        labelId="Seleccionar Operación"
                        id="demo-simple-select"
                        style={{ width: '50%', marginLeft: '25%' }}
                        value={operacion}
                        onChange={e => set_operacion(e.target.value)}
                    >
                        <MenuItem value="CANCELADO">CANCELAR</MenuItem>
                    </Select> :
                    <Select
                        labelId="Seleccionar Operación"
                        id="demo-simple-select"
                        style={{ width: '50%', marginLeft: '25%' }}
                        value={operacion}
                        onChange={e => set_operacion(e.target.value)}
                    >
                        <MenuItem value="ACEPTADO">ACEPTAR</MenuItem>
                        <MenuItem value="CANCELADO">CANCELAR</MenuItem>
                    </Select>}
                <DialogActions style={{ marginRight: '15%' }}>
                    <Button style={{ color: 'red' }} onClick={e => setOpen(false)} color="primary">
                        Anular Cambios
                    </Button>
                    <Button style={{ color: 'green' }} onClick={e => handleClose()} color="primary">
                        Aceptar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={error} autoHideDuration={2000}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert onClose={() => set_error(false)} variant="filled" severity="error">
                    {message_dialog}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={2000}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert onClose={() => set_success(false)} variant="filled" severity="success">
                    {message_dialog}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}
export default Servicio_pedido;
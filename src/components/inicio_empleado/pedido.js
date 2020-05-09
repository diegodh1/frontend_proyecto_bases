import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    TextField,
    Input,
    Divider,
    Grid,
    IconButton,
    Tooltip,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Snackbar from '@material-ui/core/Snackbar';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';


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
    }
}));


export default function Pedido() {
    const classes = useStyles();
    const { usuario, message } = useSelector(state => ({
        usuario: state.redux_reducer.usuario,
        message: state.redux_reducer.message,
    }));
    const dispatch = useDispatch();
    const [sugerencias, set_sugerencias] = useState([]);
    const [empleados, set_empleados] = useState([]);
    const [limite, set_limite] = useState(1);
    const [ocupacion, set_ocupacion] = useState('');
    const [cargando, set_cargando] = useState(false);
    const [servicio_descripcion, set_sercicio_descripcion] = useState('');
    const [cantida_horas, set_cantidad_horas] = useState('');
    const [cantidad_unidades, set_cantidad_unidades] = useState('');
    const [es_por_horas, set_es_por_horas] = useState(true);
    const [fecha, set_selected_date] = React.useState(new Date());
    const [servicio_nro, set_servicio_nro] = useState(-1);
    const [error, set_error] = React.useState(false);
    const [error_message, set_error_message] = useState('');
    const [success, set_success] = React.useState(false);
    const [success_message, set_success_message] = useState('');
    const [open, setOpen] = React.useState(false);
    const [tipo_servicio, set_tipo_servicio] = React.useState('Por Horas');
    const vertical = 'center';
    const horizontal = 'right';

    const subir_formulario_servicio = () => {
        if (servicio_descripcion === '') {
            set_error(true);
            set_error_message('Por favor escriba una breve descripción');
        }
        else if (es_por_horas == true && !Number(cantida_horas)) {
            set_error(true);
            set_error_message('Por favor ingrese el número de horas');
        }
        else if (es_por_horas == true && parseFloat(cantida_horas) < 1) {
            set_error(true);
            set_error_message('La cantidad de horas debe ser mayor o igual a 1 hora');
        }
        else if (es_por_horas == false && !Number(cantidad_unidades)) {
            set_error(true);
            set_error_message('Por favor ingrese el número de unidades');
        }
        else if (es_por_horas == false && parseFloat(cantidad_unidades) < 1) {
            set_error(true);
            set_error_message('La cantidad de unidades debe ser mayor o igual a 1');
        }
        else {
            let fecha_hora = fecha.getFullYear() + "-" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "-" + ("0" + fecha.getDate()).slice(-2) + " " + ("0" + fecha.getHours()).slice(-2) + ":" + ("0" + fecha.getMinutes()).slice(-2) + ":" + ("0" + fecha.getSeconds()).slice(-2)+"-5";
            fetch('http://localhost:4000/pedir_servicio', {
                method: 'POST',
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    servicio_nro,
                    servicio_pedido_fecha: fecha_hora,
                    descripcion: servicio_descripcion,
                    servicio_horas: es_por_horas?cantida_horas:-1,
                    servicio_unidad_labor: !es_por_horas?cantidad_unidades:-1,
                    es_por_hora: es_por_horas
                }), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => {
                    if (response.status === 200) {
                        set_success(true);
                        set_success_message('Solicitud enviada');
                        set_sercicio_descripcion('');
                        set_cantidad_unidades('');
                        set_cantidad_horas('');
                    }
                    else {
                        set_error(true);
                        set_error_message(response.message);
                    }
                })
                .catch(error => {
                    set_error(true);
                    set_error_message(error);
                });

        }
    }

    const handle_date_change = (date) => {
        set_selected_date(date);

    };
    const [trabajador, set_trabajador] = useState({
        trabajador_cedula: '', trabajador_nombre: '', trabajador_direccion: '',
        trabajador_latitud: '',
        trabajador_longitud: '',
        trabajador_foto_base64: '',
        puntuacion: 0
    });

    const cambiar_tipo_servicio = value => {
        if (value === 'Por Horas') {
            set_tipo_servicio(value);
            set_es_por_horas(true);
        }
        else {
            set_tipo_servicio(value);
            set_es_por_horas(false);
        }
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


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
    const get_info_empleado = (id) => {
        set_cargando(true);
        set_servicio_nro(id);
        fetch('http://localhost:4000/empleado_informacion', {
            method: 'POST',
            body: JSON.stringify({
                servicio_nro: id
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 400 || response.status === 200) {
                    set_cargando(false);
                    set_trabajador(response.trabajador)
                }
                else {
                    set_cargando(false);
                    set_trabajador(response.trabajador)
                }
            })
            .catch(error => {
                alert(error);
                set_cargando(false);
            });

    }

    const get_empleados = () => {
        set_cargando(true);
        fetch('http://localhost:4000/empleados_cercanos', {
            method: 'POST',
            body: JSON.stringify({
                id_usuario: usuario.id,
                ocupacion_id: ocupacion,
                limite
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 400 || response.status === 200) {
                    set_cargando(false);
                    set_empleados(response.trabajadores);
                    set_trabajador({
                        trabajador_cedula: '', trabajador_nombre: '', trabajador_direccion: '',
                        trabajador_latitud: '',
                        trabajador_longitud: '',
                        trabajador_foto_base64: '',
                        puntuacion: 0
                    });
                }
                else {
                    set_cargando(false);
                    set_empleados(response.trabajadores);
                    set_trabajador({
                        trabajador_cedula: '', trabajador_nombre: '', trabajador_direccion: '',
                        trabajador_latitud: '',
                        trabajador_longitud: '',
                        trabajador_foto_base64: '',
                        puntuacion: 0
                    });
                }
            })
            .catch(error => {
                alert(error);
                set_cargando(false);
                set_trabajador({
                    trabajador_cedula: '', trabajador_nombre: '', trabajador_direccion: '',
                    trabajador_latitud: '',
                    trabajador_longitud: '',
                    trabajador_foto_base64: '',
                    puntuacion: 0
                });
            });

    }
    const get_more_empleados = (value) => {
        set_cargando(true);
        set_limite(value);
        fetch('http://localhost:4000/empleados_cercanos', {
            method: 'POST',
            body: JSON.stringify({
                id_usuario: usuario.id,
                ocupacion_id: ocupacion,
                limite: value
            }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.status === 400 || response.status === 200) {
                    set_cargando(false);
                    set_empleados(response.trabajadores)
                }
                else {
                    set_cargando(false);
                    set_empleados(response.trabajadores)
                }
            })
            .catch(error => {
                alert(error);
                set_cargando(false);
            });

    }

    return (
        <Fragment>
            <h3>
                Buscar profesional
            </h3>
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
                            onClick={e => get_empleados()}
                            children={<Search fontSize="large" />}
                        />
                    </Tooltip>
                </Grid>
            </Grid>
            {cargando ? <LinearProgress color="secondary" /> : null}
            <div>
                <Grid container className={classes.root}>
                    <Grid item xs={6}>
                        <div className={classes.scroll_grid}>
                            {
                                empleados.map((element) =>
                                    <Card className={classes.card_root} key={element.trabajador_cedula}>
                                        <CardContent>
                                            <Typography className={classes.card_pos} color="textPrimary">
                                                {element.trabajador_cedula}
                                            </Typography>
                                            <Typography className={classes.card_title} color="textSecondary" gutterBottom>
                                                {element.trabajador_nombre + " " + element.trabajador_apellido}
                                            </Typography>
                                            <Typography className={classes.card_pos} color="textSecondary">
                                                {element.servicio_descripcion}
                                            </Typography>
                                            <Typography className={classes.card_pos} color="textSecondary">
                                                {element.trabajador_direccion}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" style={{ color: 'green' }} onClick={e => get_info_empleado(element.servicio_nro)}>Detalles</Button>
                                        </CardActions>
                                    </Card>
                                )
                            }
                            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                <Button color="primary" onClick={e => get_more_empleados(limite + 5)}>Cargar más Resultados</Button>
                            </div>

                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        {trabajador.trabajador_cedula !== '' ?
                            <div style={{ marginLeft: '1%', marginTop: '2%' }}>
                                <h3 style={{ textAlign: 'center' }}>{trabajador.trabajador_nombre}</h3>
                                <img height="200" width="200" style={{ display: 'block', marginBottom: '5%', marginLeft: 'auto', marginRight: 'auto' }} src={'data:image/png;base64,' + trabajador.trabajador_foto_base64} alt="foto trabajador" />
                                <b>Identificación </b><span>{trabajador.trabajador_cedula}</span><br></br>
                                <b>Celular </b><span>{trabajador.trabajador_celular}</span><br></br>
                                <b>Dirección </b><span>{trabajador.trabajador_direccion}</span><br></br>
                                <div style={{ textAlign: 'center', marginTop: '5%' }}>
                                    <Typography component="legend">Calificación</Typography>
                                    <Rating name="read-only" value={trabajador.puntuacion} readOnly />
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '5%' }}>
                                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                                        Solicitar Servicio
                                    </Button>
                                </div>
                            </div> : null}
                    </Grid>
                </Grid>
            </div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Petición de un nuevo servicio"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Una vez solicitado el servicio se le enviará una petición al trabajador y en caso de que la acepte
                        se le enviará una notificación
                </DialogContentText>
                    <TextField
                        margin="normal"
                        label="Descripción del servicio"
                        fullWidth
                        value={servicio_descripcion}
                        onChange={e => set_sercicio_descripcion(e.target.value)}
                        multiline
                        rowsMax={6}
                        type="text"
                        id="password"
                        color='primary'
                    />
                    <div style={{ marginTop: '2%' }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Tipo de Servicio</FormLabel>
                            <RadioGroup aria-label="Servicios" name="Servicios" value={tipo_servicio} onChange={e => cambiar_tipo_servicio(e.target.value)}>
                                <FormControlLabel value="Por Horas" control={<Radio />} label="Por Horas" />
                                <FormControlLabel value="Por Unidades" control={<Radio />} label="Por Unidades" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container className={classes.root}>
                            <Grid item xs={5}>
                                <TextField
                                    disabled={!es_por_horas}
                                    margin="normal"
                                    label="Cantidad de Horas"
                                    value={cantida_horas}
                                    onChange={e => set_cantidad_horas(e.target.value)}
                                    fullWidth
                                    rowsMax={6}
                                    type="number"
                                    id="password"
                                    color='primary'
                                />
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={5}>
                                <TextField
                                    disabled={es_por_horas}
                                    margin="normal"
                                    value={cantidad_unidades}
                                    onChange={e => set_cantidad_unidades(e.target.value)}
                                    label="Cantidad de Unidades"
                                    fullWidth
                                    rowsMax={6}
                                    type="number"
                                    color='primary'
                                />
                            </Grid>

                            <Grid xs={6}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Fecha del servicio"
                                    format="MM/dd/yyyy"
                                    value={fecha}
                                    onChange={handle_date_change}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Hora del servicio"
                                    value={fecha}
                                    onChange={handle_date_change}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </Grid>

                        </Grid>
                        <div style={{ textAlign: 'center', marginTop: '3%' }}>
                            <Button variant="outlined" style={{ color: 'white', background: 'green' }} onClick={e => subir_formulario_servicio()}>
                                Confirmar Servicio
                            </Button>
                        </div>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Disagree
                </Button>
                    <Button onClick={handleClose} color="primary">
                        Agree
                </Button>
                </DialogActions>
            </Dialog>
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
                <Alert onClose={() => set_success(false)} variant="filled" severity="success">
                    {success_message}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}
import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Input, Grid, IconButton, Tooltip, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
        overflowY:'scroll'
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
    const [limite, set_limite] = useState(5);
    const [ocupacion, set_ocupacion] = useState('');
    const [cargando, set_cargando] = useState(false);


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
                                            <Button size="small" style={{ color: 'green' }}>Detalles</Button>
                                        </CardActions>
                                    </Card>
                                )
                            }
                        </div>
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                </Grid>
            </div>
        </Fragment>
    )
}
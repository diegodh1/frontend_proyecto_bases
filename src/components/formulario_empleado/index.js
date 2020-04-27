
import React, { Component, useState } from 'react';
import Search_location from './search_location';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField, Input } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useSelector, useDispatch } from 'react-redux';
import {
	set_cedula,
	set_nombre,
	set_apellido,
	set_celular,
	set_correo,
	set_contrasenha,
	set_servicios,
	subio_cedula,
	subio_foto
} from '../../redux/actions';
import { CloudUpload } from '@material-ui/icons';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	button: {
		marginRight: theme.spacing(1),
		background: 'green'
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	input: {
		width: '95%',
		margin: '1%'
	}
}));

function getSteps() {
	return ['Información básica', 'Dirección', 'Seguridad'];
}
function Informacion_basica() {
	const classes = useStyles();
	const [cedula, set_cc] = useState('');
	const [nombre, set_name] = useState('');
	const [apellido, set_last_name] = useState('');
	const [celular, set_cellphone] = useState('');
	const [correo, set_email] = useState('');
	const { empleado } = useSelector(state => ({
		empleado: state.redux_reducer.empleado,
	}));
	const dispatch = useDispatch();
	const set_state_cedula = (value) => {
		dispatch(set_cedula(value));
		set_cc(value);
	}
	const set_state_nombre = (value) => {
		dispatch(set_nombre(value));
		set_name(value);
	}
	const set_state_apellido = (value) => {
		dispatch(set_apellido(value));
		set_last_name(value);
	}
	const set_state_celular = (value) => {
		dispatch(set_celular(value));
		set_cellphone(value);
	}
	const set_state_correo = (value) => {
		dispatch(set_correo(value));
		set_email(value);
	}
	return (
		<div style={{ justifyContent: 'center', alignItems: 'center', }}>
			<TextField id="empleado_cedula" value={cedula} onChange={e => set_state_cedula(e.target.value)} className={classes.input} label="Cédula" variant="outlined" />
			<TextField id="empleado_nombre" value={nombre} onChange={e => set_state_nombre(e.target.value)} className={classes.input} label="Nombre" variant="outlined" />
			<TextField id="empleado_apellido" value={apellido} onChange={e => set_state_apellido(e.target.value)} className={classes.input} label="Apellido" variant="outlined" />
			<TextField id="empleado_celular" value={celular} onChange={e => set_state_celular(e.target.value)} className={classes.input} label="Celular" variant="outlined" />
			<TextField id="empleado_correo" value={correo} onChange={e => set_state_correo(e.target.value)} className={classes.input} label="Correo" variant="outlined" />
		</div>
	)
}

function Informacion_seguridad() {
	const classes = useStyles();
	const [contrasenha, set_password] = useState('');
	const [foto, set_foto] = useState(0);
	const [documento, set_documento] = useState(0);
	const [open, setOpen] = React.useState(false);
	const [message, set_message] = useState('');
	const vertical = 'top';
	const horizontal = 'right';

	const { empleado } = useSelector(state => ({
		empleado: state.redux_reducer.empleado,
	}));
	const dispatch = useDispatch();

	const handleClose = () => {
		setOpen(false);
	};
	const set_state_contrasenha = (value) => {
		dispatch(set_contrasenha(value));
		set_password(value);
	}
	const set_file = value => {
		set_foto(value);
	}
	const set_doc = value => {
		set_documento(value);
	}
	const subir_foto_server = () => {
		const data = new FormData();

		if (empleado.cedula.length === 0 || !Number(empleado.cedula)) {
			setOpen(true);
			set_message('Debe rellenar el campo de cédula y debe ser un dato tipo numérico');
		}
		else if (foto == 0) {
			setOpen(true);
			set_message('Debe seleccionar un archivo');
		}
		else {
			data.append('cedula', empleado.cedula);
			data.append('foto', foto);
			fetch('http://localhost:4000/upload_fotos', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
				},
				body: data
			}).then(res => res.json())
				.then(response => {
					alert(JSON.stringify(response));
					dispatch(subio_foto(true));
				})
				.catch(error => { alert(error); dispatch(subio_foto(false)); });
		}
	}
	const subir_documento_server = () => {
		const data = new FormData();

		if (empleado.cedula.length === 0 || !Number(empleado.cedula)) {
			setOpen(true);
			set_message('Debe rellenar el campo de cédula y debe ser un dato tipo numérico');
		}
		else if (documento == 0) {
			setOpen(true);
			set_message('Debe seleccionar un archivo');
		}
		else {
			data.append('cedula', empleado.cedula);
			data.append('documento', documento);
			fetch('http://localhost:4000/upload_cedula', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
				},
				body: data
			}).then(res => res.json())
				.then(response => {
					alert(JSON.stringify(response));
					dispatch(subio_cedula(true));
				})
				.catch(error => { alert(error); dispatch(subio_cedula(false)); });
		}
	}
	return (
		<div style={{ alignContent: 'center' }}>
			<TextField id="contrasenha" value={contrasenha} onChange={e => set_state_contrasenha(e.target.value)} className={classes.input} label="Contraseña para el inicio de sección" variant="outlined" />
			<div style={{ marginLeft: '32%' }}>
				<Button variant="contained" component="label">Seleccionar foto del empleado
					<Input
						type="file"
						onChange={e => set_file(e.target.files[0])}
						style={{ display: "none" }}
					/>
				</Button>
				<Button variant="outlined" color="secondary" style={{ marginLeft: '3%' }} onClick={e => subir_foto_server()}>
					Subir foto del empleado
					<CloudUpload style={{ fontSize: 30, marginLeft: '10px' }} />
				</Button>
			</div>
			<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleClose} severity="error">
					{message}
				</Alert>
			</Snackbar>
			<div style={{ marginLeft: '32%', marginTop: '3%' }}>
				<Button variant="contained" component="label">Seleccionar foto de la cédula
					<Input
						type="file"
						onChange={e => set_doc(e.target.files[0])}
						style={{ display: "none" }}
					/>
				</Button>
				<Button variant="outlined" color="secondary" style={{ marginLeft: '4%' }} onClick={e => subir_documento_server()}>
					Subir foto de la cédula
					<CloudUpload style={{ fontSize: 30, marginLeft: '10px' }} />
				</Button>
			</div>
		</div>
	)
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return <Informacion_basica />;
		case 1:
			return <Search_location />;
		case 2:
			return <Informacion_seguridad />;
		default:
			return 'Unknown step';
	}
}

export default function Formulario_empleado() {
	const classes = useStyles();
	const vertical = 'top';
	const horizontal = 'right';
	const [open, setOpen] = React.useState(false);
	const [open_success, set_open_sucess] = React.useState(false);
	const [message, set_message] = React.useState('');
	const [message_success, set_message_success] = React.useState('');
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set());
	const steps = getSteps();
	const { empleado, direccion, coordenadas } = useSelector(state => ({
		empleado: state.redux_reducer.empleado,
		coordenadas: state.redux_reducer.coordenadas,
		direccion: state.redux_reducer.direccion
	}));
	const dispatch = useDispatch();
	const handleClose = () => {
		setOpen(false);
	};
	const handleCloseSucess = () => {
		set_open_sucess(false);
	};
	const comprobar_info = () => {
		if (!Number(empleado.cedula)) {
			set_message('la cédula no puede estar vacia y debe ser un dato tipo numérico');
			setOpen(true);
		}
		else if (empleado.nombre.length == 0) {
			set_message('el nombre no puede estar vacio');
			setOpen(true);
		}
		else if (empleado.apellido.length == 0) {
			set_message('el apellido no puede estar vacio');
			setOpen(true);
		}
		else if (!Number(empleado.celular)) {
			set_message('el celular no puede estar vacio y debe ser un dato tipo numérico');
			setOpen(true);
		}
		else if (!empleado.correo.includes('@')) {
			set_message('el correo no puede estar vacio y debe ser de la forma example@example.com');
			setOpen(true);
		}
		else {
			setOpen(false);
			handleNext()
		}
	}
	const subir_formulario = () => {
		if (direccion.length == 0 || !Number(empleado.cedula) || empleado.nombre.length == 0 || empleado.apellido.length == 0 || !Number(empleado.celular) || !empleado.correo.includes('@') || empleado.contrasenha.length < 7) {

			if (!Number(empleado.cedula)) {
				set_message('la cédula no puede estar vacia y debe ser un dato tipo numérico');
			}
			if (empleado.nombre.length == 0) {
				set_message('el nombre no puede estar vacio');
			}
			if (empleado.apellido.length == 0) {
				set_message('el apellido no puede estar vacio');
			}
			if (!Number(empleado.celular)) {
				set_message('el celular no puede estar vacio y debe ser un dato tipo numérico');
			}
			if (!empleado.correo.includes('@')) {
				set_message('el correo no puede estar vacio y debe ser de la forma example@example.com');
			}
			if (empleado.contrasenha.length < 7) {
				set_message('la contraseña debe ser mayor a 6 caracteres');
			}
			if (direccion.length == 0) {
				set_message('seleccione una dirección válida');
			}
			setOpen(true);
		}
		else {
			setOpen(false);
			fetch('http://localhost:4000/crear_empleado', {
				method: 'POST',
				body: JSON.stringify({
					cedula: empleado.cedula,
					nombre: empleado.nombre,
					apellido: empleado.apellido,
					celular: empleado.celular,
					correo: empleado.correo,
					latitud: coordenadas.lat,
					longitud: coordenadas.lng,
					direccion,
					contrasenha: empleado.contrasenha,
					servicios: JSON.stringify([])
				}), // data can be `string` or {object}!
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(res => res.json())
				.then(response => {
					if(response.status == 400){
						set_message(response.message);
						setOpen(true);
					}
					else{
						set_message_success(response.message);
						set_open_sucess(true);					
					}
				})
				.catch(error => {
					set_message(error);
					setOpen(true);
				});
		}
	}
	const isStepOptional = (step) => {
		return step === 1;
	};

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleClose} severity="error">
					{message}
				</Alert>
			</Snackbar>
			<Snackbar open={open_success} autoHideDuration={3000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleCloseSucess} severity="success">
					{message_success}
				</Alert>
			</Snackbar>
			<div style={{ bottom: '0', width: '100%' }}>
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed - you&apos;re finished
						</Typography>
						<Button onClick={handleReset} className={classes.button}>
							handleReset
						</Button>
					</div>
				) : (
						<div>
							<div className={classes.instructions}>{getStepContent(activeStep)}</div>
							<div style={{ marginLeft: '44%', marginTop: '3%' }}>
								<Button color="secondary" disabled={activeStep === 0} onClick={handleBack} variant="outlined" >
									Regresar
								</Button>
								{activeStep === steps.length - 1 ?
									<Button
										variant="contained"
										color="primary"
										onClick={e => subir_formulario()}
										style={{ marginLeft: '5%' }}>Finalizar
									</Button> :
									<Button
										variant="contained"
										color="primary"
										onClick={e => comprobar_info()}
										style={{ marginLeft: '5%' }}>Siguiente
									</Button>}

							</div>
						</div>
					)}
			</div>
		</div>
	);
}
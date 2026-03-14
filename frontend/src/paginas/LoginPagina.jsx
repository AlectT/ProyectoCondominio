import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Building,
	ShieldCheck,
	QrCode,
	AlertTriangle,
	Sun,
	Moon,
	Lock,
	Mail,
	Eye,
	EyeOff,
} from 'lucide-react';
import { CaballoAnimado, AnimacionCarga } from '../componentes/ui/Animaciones.jsx';
import useStore from '../estado/useStore.js';
import { usuariosApi } from '../api/usuariosApi.js';

export default function LoginPagina() {
	const navigate = useNavigate();
	const { setUsuario, temaOscuro, toggleTema } = useStore();

	const [usuario, setUsuarioVal] = useState('');
	const [contrasena, setContrasena] = useState('');
	const [mostrarPassword, setMostrarPassword] = useState(false);
	const [focusUsuario, setFocusUsuario] = useState(false);
	const [focusPassword, setFocusPassword] = useState(false);
	const [shake, setShake] = useState(false);
	const [cargando, setCargando] = useState(false);
	const [pupilaX, setPupilaX] = useState(0);
	const [pupilaY, setPupilaY] = useState(0);
	const inputRef = useRef(null);

	const tapado = focusPassword && !mostrarPassword;

	const actualizarPupila = (val, selStart) => {
		if (!focusUsuario) return;
		const len = val.length;
		if (len === 0) {
			setPupilaX(-2.0);
			setPupilaY(-0.5);
			return;
		}
		const ratio = selStart / Math.max(len, 1);
		setPupilaX(-2.5 + ratio * 5.0);
		setPupilaY(-0.8 + ratio * 0.6);
	};

	useEffect(() => {
		if (focusUsuario) {
			actualizarPupila(inputRef.current?.value ?? '', inputRef.current?.selectionStart ?? 0);
		} else if (focusPassword) {
			setPupilaX(2.4);
			setPupilaY(0.5);
		} else {
			setPupilaX(0);
			setPupilaY(0);
		}
	}, [focusUsuario, focusPassword]);

	const bodyTransform = tapado
		? 'scale(0.93) translateY(5px)'
		: focusUsuario
			? 'scale(1.03) translateY(-3px) rotate(-2.5deg)'
			: focusPassword
				? 'scale(1.03) translateY(-3px) rotate(2.5deg)'
				: 'scale(1) translateY(0px)';

	const inputBg = (activo) =>
		activo
			? temaOscuro
				? 'rgba(39,39,42,0.7)'
				: 'rgba(241,245,249,0.9)'
			: temaOscuro
				? 'rgba(9,9,11,0.6)'
				: 'rgba(248,250,252,0.8)';

	const inputBorder = (activo) =>
		activo
			? temaOscuro
				? 'rgba(113,113,122,0.8)'
				: 'rgba(100,116,139,0.6)'
			: temaOscuro
				? 'rgba(63,63,70,0.8)'
				: 'rgba(203,213,225,0.8)';

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!usuario.trim() || !contrasena) {
			setShake(true);
			setTimeout(() => setShake(false), 600);
			return;
		}
		setCargando(true);
		try {
			const res = await usuariosApi.login({ nombreUsuario: usuario, contrasena });
			setUsuario(res.data);
			navigate('/dashboard');
		} catch (err) {
			const mensaje = err.response?.data?.mensaje ?? 'Error al conectar con el servidor.';
			alert(mensaje);
			setShake(true);
			setTimeout(() => setShake(false), 600);
		} finally {
			setCargando(false);
		}
	};

	if (cargando) return <AnimacionCarga mensaje="Ingresando al panel de gestión" />;

	return (
		<div
			className="flex w-full h-full relative overflow-hidden"
			style={{ background: temaOscuro ? '#09090b' : '#f1f5f9' }}
		>
			{/* Fondo con grid */}
			<div
				className="absolute inset-0"
				style={{ background: temaOscuro ? '#09090b' : '#f1f5f9' }}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundImage: temaOscuro
							? 'linear-gradient(rgba(63,63,70,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.15) 1px, transparent 1px)'
							: 'linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px)',
						backgroundSize: '40px 40px',
					}}
				/>
			</div>

			{/* Botón tema */}
			<div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 50 }}>
				<button
					onClick={toggleTema}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						padding: '8px 14px',
						borderRadius: '999px',
						border: temaOscuro ? '1px solid rgba(63,63,70,0.7)' : '1px solid rgba(100,116,139,0.3)',
						background: temaOscuro ? 'rgba(24,24,27,0.8)' : 'rgba(255,255,255,0.8)',
						backdropFilter: 'blur(12px)',
						cursor: 'pointer',
						transition: 'all 0.25s ease',
					}}
				>
					{temaOscuro ? (
						<Sun style={{ width: '14px', height: '14px', color: '#facc15' }} />
					) : (
						<Moon style={{ width: '14px', height: '14px', color: '#475569' }} />
					)}
					<span
						style={{ fontSize: '11px', fontWeight: 600, color: temaOscuro ? '#a1a1aa' : '#475569' }}
					>
						{temaOscuro ? 'Modo día' : 'Modo noche'}
					</span>
				</button>
			</div>

			{/* Panel izquierdo */}
			<div className="hidden lg:flex flex-col justify-between w-[45%] relative z-10 p-12 border-r border-zinc-800/50">
				<div>
					<div className="flex items-center gap-3 mb-16">
						<div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
							<Building className="w-5 h-5 text-zinc-900" />
						</div>
						<span className="text-white font-bold text-lg tracking-tight">PuraFé</span>
					</div>
					<div className="space-y-6">
						<h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
							Sistema de
							<br />
							<span style={{ color: '#d4d4d8' }}>Gestión</span>
							<br />
							<span
								style={{
									background: 'linear-gradient(135deg,#ffffff 0%,#71717a 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
							>
								Residencial
							</span>
						</h1>
						<p className="text-zinc-500 text-base leading-relaxed max-w-sm">
							Administra propiedades, accesos y residentes desde un solo lugar.
						</p>
					</div>
				</div>
				<div className="space-y-3">
					{[
						{ Icono: Building, text: 'Control de propiedades y cuotas', color: 'text-white' },
						{ Icono: ShieldCheck, text: 'Seguridad y garita integrada', color: 'text-zinc-300' },
						{ Icono: QrCode, text: 'Pases QR para visitantes', color: 'text-zinc-400' },
						{
							Icono: AlertTriangle,
							text: 'Gestión de infracciones y multas',
							color: 'text-zinc-500',
						},
					].map(({ Icono, text, color }, i) => (
						<div key={i} className="flex items-center gap-3">
							<div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
								<Icono className="w-3.5 h-3.5 text-zinc-300" />
							</div>
							<span className={`text-sm font-medium ${color}`}>{text}</span>
						</div>
					))}
				</div>
			</div>

			{/* Panel derecho — formulario */}
			<div className="flex-1 flex items-center justify-center relative z-10 p-6">
				<div
					style={{
						width: '100%',
						maxWidth: '400px',
						animation: shake
							? 'loginShake 0.6s ease'
							: 'loginFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
					}}
				>
					<div
						style={{
							background: temaOscuro ? 'rgba(24,24,27,0.88)' : 'rgba(255,255,255,0.92)',
							backdropFilter: 'blur(20px)',
							border: temaOscuro ? '1px solid rgba(63,63,70,0.6)' : '1px solid rgba(226,232,240,0.9)',
							borderRadius: '24px',
							padding: '36px',
							boxShadow: temaOscuro
								? '0 32px 64px -16px rgba(0,0,0,0.8)'
								: '0 16px 48px -12px rgba(15,23,42,0.15)',
						}}
					>
						{/* Caballo */}
						<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
							<div
								style={{
									transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
									transform: bodyTransform,
								}}
							>
								<CaballoAnimado
									tapado={tapado}
									asomado={mostrarPassword}
									pupilaX={pupilaX}
									pupilaY={pupilaY}
								/>
							</div>
						</div>

						<div className="text-center mb-7">
							<h2
								style={{
									fontSize: '22px',
									fontWeight: 800,
									color: temaOscuro ? '#fafafa' : '#0f172a',
									letterSpacing: '-0.5px',
									marginBottom: '4px',
								}}
							>
								Bienvenido
							</h2>
							<p
								style={{
									fontSize: '13px',
									color: temaOscuro ? '#71717a' : '#64748b',
									fontWeight: 500,
								}}
							>
								Accede al panel administrativo
							</p>
						</div>

						<form
							onSubmit={handleSubmit}
							style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
						>
							{/* Campo usuario */}
							<div>
								<label
									style={{
										display: 'block',
										fontSize: '11px',
										fontWeight: 600,
										color: '#71717a',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: '8px',
									}}
								>
									Usuario
								</label>
								<div style={{ position: 'relative' }}>
									<Mail
										style={{
											position: 'absolute',
											left: '14px',
											top: '50%',
											transform: 'translateY(-50%)',
											width: '15px',
											height: '15px',
											color: focusUsuario ? '#a1a1aa' : '#52525b',
											transition: 'color 0.2s',
										}}
									/>
									<input
										ref={inputRef}
										type="text"
										required
										value={usuario}
										onChange={(e) => {
											setUsuarioVal(e.target.value);
											actualizarPupila(e.target.value, e.target.selectionStart ?? e.target.value.length);
										}}
										onKeyUp={(e) =>
											actualizarPupila(e.target.value, e.target.selectionStart ?? e.target.value.length)
										}
										placeholder="nombre de usuario"
										style={{
											width: '100%',
											paddingLeft: '42px',
											paddingRight: '16px',
											paddingTop: '12px',
											paddingBottom: '12px',
											fontSize: '14px',
											background: inputBg(focusUsuario),
											border: `1px solid ${inputBorder(focusUsuario)}`,
											borderRadius: '12px',
											color: temaOscuro ? '#fafafa' : '#0f172a',
											outline: 'none',
											transition: 'border-color 0.25s, background 0.25s',
											boxSizing: 'border-box',
										}}
										onFocus={() => setFocusUsuario(true)}
										onBlur={() => setFocusUsuario(false)}
									/>
								</div>
							</div>

							{/* Campo contraseña */}
							<div>
								<label
									style={{
										display: 'block',
										fontSize: '11px',
										fontWeight: 600,
										color: '#71717a',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: '8px',
									}}
								>
									Contraseña
								</label>
								<div style={{ position: 'relative' }}>
									<Lock
										style={{
											position: 'absolute',
											left: '14px',
											top: '50%',
											transform: 'translateY(-50%)',
											width: '15px',
											height: '15px',
											color: focusPassword ? '#a1a1aa' : '#52525b',
											transition: 'color 0.2s',
										}}
									/>
									<input
										type={mostrarPassword ? 'text' : 'password'}
										required
										value={contrasena}
										onChange={(e) => setContrasena(e.target.value)}
										placeholder="••••••••"
										style={{
											width: '100%',
											paddingLeft: '42px',
											paddingRight: '48px',
											paddingTop: '12px',
											paddingBottom: '12px',
											fontSize: '14px',
											background: inputBg(focusPassword),
											border: `1px solid ${inputBorder(focusPassword)}`,
											borderRadius: '12px',
											color: temaOscuro ? '#fafafa' : '#0f172a',
											outline: 'none',
											transition: 'border-color 0.25s, background 0.25s',
											boxSizing: 'border-box',
										}}
										onFocus={() => setFocusPassword(true)}
										onBlur={() => setFocusPassword(false)}
									/>
									<button
										type="button"
										onClick={() => setMostrarPassword((p) => !p)}
										style={{
											position: 'absolute',
											right: '12px',
											top: '50%',
											transform: 'translateY(-50%)',
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											padding: '4px',
											color: mostrarPassword ? '#d4d4d8' : '#52525b',
											borderRadius: '6px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										{mostrarPassword ? (
											<Eye style={{ width: '16px', height: '16px' }} />
										) : (
											<EyeOff style={{ width: '16px', height: '16px' }} />
										)}
									</button>
								</div>
							</div>

							<button
								type="submit"
								style={{
									marginTop: '8px',
									width: '100%',
									padding: '14px',
									fontSize: '14px',
									fontWeight: 700,
									borderRadius: '12px',
									background: 'linear-gradient(135deg, #fafafa 0%, #d4d4d8 100%)',
									color: '#09090b',
									border: 'none',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
								}}
							>
								<Lock style={{ width: '15px', height: '15px' }} />
								Iniciar Sesión
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

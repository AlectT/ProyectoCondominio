import {
	LayoutDashboard,
	CreditCard,
	AlertTriangle,
	CalendarDays,
	ShieldCheck,
} from 'lucide-react';

import { Link, Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
	const location = useLocation();
	return (
		<div
			className="
            min-h-screen
            text-white
            flex
        "
		>
			{/* ===== SIDEBAR ===== */}

			<aside
				className="
                w-[280px]
                border-r
                border-cyan-500/10
                p-6
                hidden
                lg:flex
                flex-col
            "
			>
				<div className="mb-10">
					<h1
						className="
                        text-3xl
                        font-black
                        text-cyan-400
                    "
					>
						CONDOMINIO
					</h1>

					<p className="text-gray-400 mt-2">Sistema Reportería</p>
				</div>

				{/* ===== MENÚ ===== */}

				<nav
					className="
    flex
    flex-col
    gap-4
"
				>
					{/* ===== DASHBOARD ===== */}

					<Link
						to="/dashboard/reportes"
						className={`
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            transition

            ${
													location.pathname === '/dashboard/reportes'
														? 'bg-cyan-500/10 border border-cyan-500/20'
														: 'hover:bg-white/5'
												}
        `}
					>
						<LayoutDashboard className="text-cyan-400" />

						<span>Dashboard</span>
					</Link>

					{/* ===== PAGOS ===== */}

					<Link
						to="/dashboard/reportes/pagos"
						className={`
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            transition

            ${
													location.pathname.includes('/pagos')
														? 'bg-cyan-500/10 border border-cyan-500/20'
														: 'hover:bg-white/5'
												}
        `}
					>
						<CreditCard className="text-cyan-400" />

						<span>Pagos</span>
					</Link>

					{/* ===== MORAS ===== */}

					<Link
						to="/dashboard/reportes/moras"
						className={`
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            transition

            ${
													location.pathname.includes('/moras')
														? 'bg-pink-500/10 border border-pink-500/20'
														: 'hover:bg-white/5'
												}
        `}
					>
						<AlertTriangle className="text-pink-400" />

						<span>Moras</span>
					</Link>

					{/* ===== RESERVAS ===== */}

					<Link
						to="/dashboard/reportes/reservas"
						className={`
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            transition

            ${
													location.pathname.includes('/reservas')
														? 'bg-purple-500/10 border border-purple-500/20'
														: 'hover:bg-white/5'
												}
        `}
					>
						<CalendarDays className="text-purple-400" />

						<span>Reservas</span>
					</Link>

					{/* ===== MULTAS ===== */}

					<Link
						to="/dashboard/reportes/multas"
						className={`
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            transition

            ${
													location.pathname.includes('/multas')
														? 'bg-yellow-500/10 border border-yellow-500/20'
														: 'hover:bg-white/5'
												}
        `}
					>
						<ShieldCheck className="text-yellow-400" />

						<span>Multas</span>
					</Link>
				</nav>
			</aside>

			{/* ===== MAIN CONTENT ===== */}

			<main
				className="
                flex-1
                p-8
                overflow-auto
            "
			>
				{/* ===== HEADER ===== */}

				{/* ===== CONTENIDO ===== */}

				<Outlet />
				{children}
			</main>
		</div>
	);
};

export default DashboardLayout;

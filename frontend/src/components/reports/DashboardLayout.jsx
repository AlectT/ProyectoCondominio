import {
	LayoutDashboard,
	CreditCard,
	AlertTriangle,
	CalendarDays,
	ShieldCheck,
} from 'lucide-react';

import { Link, Outlet } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
	// const location = useLocation();
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

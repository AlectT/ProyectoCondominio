import React from 'react';

const Cargando = ({ Texto }) => {
	return (
		<>
			<div className="loading-overlay">
				<div className="loading-card">
					{/* Loader */}
					<div className="loader-wrapper">
						<div className="loader-ring"></div>
						<div className="loader-core"></div>
					</div>

					{/* Text */}
					<div className="loading-content">
						<span className="loading-badge">
							<span className="pulse-dot"></span>
							Cargando {Texto}...
						</span>

						<div className="loading-line">
							<div className="loading-progress"></div>
						</div>
					</div>
				</div>
			</div>

			<style>{`
				.loading-overlay {
					position: fixed;
					inset: 0;
					background: rgba(20, 20, 20, 0.18);
					background: rgba(255, 255, 255, 0.08);

					display: flex;
					justify-content: center;
					align-items: center;

					z-index: 9999;
				}

				.loading-card {
					width: 320px;
					padding: 32px 28px;

					border-radius: 24px;

					background: rgba(255, 255, 255, 0.08);
					border: 1px solid rgba(0, 255, 170, 0.08);

					box-shadow:
  0 0 25px rgba(0, 0, 0, 0.08),
  0 8px 30px rgba(0, 0, 0, 0.08);

					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 24px;
				}

				.loader-wrapper {
					position: relative;
					width: 72px;
					height: 72px;

					display: flex;
					justify-content: center;
					align-items: center;
				}

				.loader-ring {
					position: absolute;
					width: 72px;
					height: 72px;
					border-radius: 50%;

					border: 3px solid rgba(0, 255, 170, 0.08);
					border-top: 3px solid #00ffb3;
					border-right: 3px solid #00c8ff;

					animation: rotate 1s linear infinite;

					box-shadow: 0 0 18px rgba(0, 255, 170, 0.15);
				}

				.loader-core {
					width: 18px;
					height: 18px;
					border-radius: 50%;

					background: linear-gradient(135deg, #00ffb3, #00c8ff);

					box-shadow:
						0 0 12px rgba(0, 255, 170, 0.45),
						0 0 22px rgba(0, 200, 255, 0.25);

					animation: pulse 1.5s ease-in-out infinite;
				}

				.loading-content {
					width: 100%;
					text-align: center;
				}

				.loading-badge {
					display: inline-flex;
					align-items: center;
					gap: 8px;

					padding: 7px 14px;
					border-radius: 999px;

					background: rgba(0, 255, 170, 0.06);
					border: 1px solid rgba(127, 127, 127, 0.15);

					color: #00ffb3;

					font-size: 11px;
					font-weight: 700;
					letter-spacing: 1.5px;

					margin-bottom: 18px;
				}

				.pulse-dot {
					width: 8px;
					height: 8px;
					border-radius: 50%;
					background: #00ffb3;

					animation: blink 1s infinite;
				}

				.loading-content h2 {
					color: inherit;
					font-size: 20px;
					font-weight: 600;

					margin-bottom: 18px;
				}

				.loading-line {
					width: 100%;
					height: 6px;

					background: rgba(127, 127, 127, 0.12);

					border-radius: 999px;
					overflow: hidden;
				}

				.loading-progress {
					width: 40%;
					height: 100%;

					border-radius: inherit;

					background: linear-gradient(90deg, #00ffb3, #00c8ff);

					animation: progressMove 1.5s ease-in-out infinite;
				}

				@keyframes rotate {
					from {
						transform: rotate(0deg);
					}

					to {
						transform: rotate(360deg);
					}
				}

				@keyframes pulse {
					0%,
					100% {
						transform: scale(1);
						opacity: 1;
					}

					50% {
						transform: scale(1.2);
						opacity: 0.7;
					}
				}

				@keyframes blink {
					0%,
					100% {
						opacity: 1;
					}

					50% {
						opacity: 0.4;
					}
				}

				@keyframes progressMove {
					0% {
						transform: translateX(-120%);
					}

					100% {
						transform: translateX(320%);
					}
				}

				@media (max-width: 480px) {
					.loading-card {
						width: 88%;
						padding: 28px 22px;
					}
				}
			`}</style>
		</>
	);
};

export default Cargando;

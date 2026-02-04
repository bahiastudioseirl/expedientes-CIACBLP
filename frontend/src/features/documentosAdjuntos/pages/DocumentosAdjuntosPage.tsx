import { useEffect, useMemo, useState } from 'react';
import { Download, FolderOpen, Loader2, Paperclip, FileText, Search, MapPin } from 'lucide-react';
import { useDocumentosAdjuntos } from '../hooks/useDocumentosAdjuntos';
import ModalCaminoExpediente from '../../../admin/features/expedienteAdmin/components/ModalCaminoExpediente';

export default function DocumentosAdjuntosPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [modalCaminoAbierto, setModalCaminoAbierto] = useState(false);
	const [expedienteCamino, setExpedienteCamino] = useState<{id: number, codigo: string} | null>(null);
	const {
		expedientes,
		adjuntos,
		expedienteSeleccionado,
		cargandoExpedientes,
		cargandoAdjuntos,
		error,
		seleccionarExpediente
	} = useDocumentosAdjuntos();


	const filteredExpedientes = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return expedientes;
		return expedientes.filter((exp) => exp.codigo_expediente.toLowerCase().includes(term));
	}, [expedientes, searchTerm]);

	// Seleccionar automáticamente el primer expediente disponible (filtrado)
	useEffect(() => {
		if (filteredExpedientes.length === 0) return;
		const exists = filteredExpedientes.some((exp) => exp.id === expedienteSeleccionado);
		if (!expedienteSeleccionado || !exists) {
			seleccionarExpediente(filteredExpedientes[0].id);
		}
	}, [expedienteSeleccionado, filteredExpedientes, seleccionarExpediente]);

	const handleAbrirCamino = (expediente: {id: number, codigo_expediente: string}) => {
		setExpedienteCamino({ id: expediente.id, codigo: expediente.codigo_expediente });
		setModalCaminoAbierto(true);
	};

	const handleCerrarCamino = () => {
		setModalCaminoAbierto(false);
		setExpedienteCamino(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div className="bg-white border shadow-sm rounded-xl border-slate-200">
					<div className="p-6 border-b border-slate-200">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="p-2 rounded-lg bg-blue-50">
									<Paperclip className="w-6 h-6 text-blue-600" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-slate-900">Documentos adjuntos</h1>
									<p className="mt-1 text-slate-600">Consulta y descarga los archivos de tus expedientes.</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
									<span className="font-medium text-slate-700">{filteredExpedientes.length}</span>
									<span className="ml-1 text-slate-500">expedientes</span>
								</div>
							</div>
						</div>
					</div>

					<div className="p-6">
						<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							<div className="w-full max-w-md">
								<div className="relative">
									<Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
									<input
										type="text"
										placeholder="Buscar por código de expediente..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{error && (
					<div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-6">
					{/* Lista de expedientes */}
					<div className="bg-white border border-slate-200 rounded-xl shadow-sm">
						<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
							<div className="flex items-center gap-2 text-slate-700 font-semibold">
								<FolderOpen className="w-5 h-5 text-blue-600" />
								Mis expedientes
							</div>
							{cargandoExpedientes && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
						</div>

						<div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
							{cargandoExpedientes && filteredExpedientes.length === 0 && (
								<div className="p-5 text-sm text-slate-500 flex items-center gap-2">
									<Loader2 className="w-4 h-4 animate-spin" /> Cargando expedientes...
								</div>
							)}

							{!cargandoExpedientes && filteredExpedientes.length === 0 && (
								<div className="p-5 text-sm text-slate-500">No se encontraron expedientes.</div>
							)}

							{filteredExpedientes.map((expediente) => {
								const activo = expedienteSeleccionado === expediente.id;
								return (
									<div
										key={expediente.id}
										className={`w-full px-5 py-4 transition ${
											activo
												? 'bg-blue-50/70 border-l-4 border-blue-500'
												: 'hover:bg-slate-50'
										}`}
									>
										{/* Primera fila: CÓDIGO y Botón */}
										<div className="flex items-center justify-between mb-2">
											<p className="text-xs uppercase tracking-wide text-slate-500">Código</p>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleAbrirCamino(expediente);
												}}
												className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
											>
												<MapPin className="w-4 h-4" />
												Camino del expediente
											</button>
										</div>
										
										{/* Segunda fila: Número de expediente e ID */}
										<button
											onClick={() => seleccionarExpediente(expediente.id)}
											className="w-full text-left"
										>
											<div className="flex items-center justify-between">
												<p className="text-sm font-semibold text-slate-900">{expediente.codigo_expediente}</p>
												<span className="text-xs text-slate-500">#{expediente.id}</span>
											</div>
										</button>
									</div>
								);
							})}
						</div>
					</div>

					{/* Adjuntos */}
					<div className="bg-white border border-slate-200 rounded-xl shadow-sm">
						<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
							<div className="flex items-center gap-2 text-slate-700 font-semibold">
								<Paperclip className="w-5 h-5 text-blue-600" />
								Adjuntos del expediente
							</div>
							{cargandoAdjuntos && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
						</div>

						{!expedienteSeleccionado && (
							<div className="p-6 text-sm text-slate-500">Selecciona un expediente para ver sus adjuntos.</div>
						)}

						{expedienteSeleccionado && (
							<div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
								{cargandoAdjuntos && adjuntos.length === 0 && (
									<div className="flex items-center gap-2 text-sm text-slate-500">
										<Loader2 className="w-4 h-4 animate-spin" /> Cargando adjuntos...
									</div>
								)}

								{!cargandoAdjuntos && adjuntos.length === 0 && (
									<div className="text-sm text-slate-500">No hay adjuntos para este expediente.</div>
								)}

								{adjuntos.map((adjunto) => (
									<div
										key={adjunto.id_adjunto}
										className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition"
									>
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
												<FileText className="w-5 h-5" />
											</div>
											<div>
												<p className="text-sm font-semibold text-slate-900">{adjunto.nombre_archivo}</p>
											</div>
										</div>
										<a
											href={adjunto.ruta_archivo}
											download
											className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
										>
											<Download className="w-4 h-4" />
											Descargar
										</a>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			
			{/* Modal Camino Expediente */}
			{modalCaminoAbierto && expedienteCamino && (
				<ModalCaminoExpediente
					expedienteId={expedienteCamino.id}
					codigoExpediente={expedienteCamino.codigo}
					onClose={handleCerrarCamino}
				/>
			)}
		</div>
	);
}

// Componente principal
export { default as BandejaEntradaPage } from './BandejaEntradaPage';
export { default as BandejaEntradaMain } from './BandejaEntradaMain';

// Componentes individuales
export { default as BandejaEntrada } from './components/BandejaEntrada';
export { default as ListaAsuntos } from './components/ListaAsuntos';

// Servicios
export * from './services/obtenerExpedientesAsignados';
export * from './services/obtenerAsuntos';
export * from './services/mensajesService';

// Schemas/Types
export * from './schemas/BandejaEntradaSchema';
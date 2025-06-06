export type ProductoFactura = {
  id: number; // id único de la relación producto-factura o del producto
  producto_id: number;
  nombre: string;
  descripcion: string;  // <-- pon descripción, no "descripcion_tecnica" si así te llega
  cantidad: number;
  precio_unitario: number;
};

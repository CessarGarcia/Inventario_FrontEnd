export class Producto{
    _id?: number;
    nombre: string;
    categoria: string;
    proveedor: string;
    precio: number;
    items: number;

    constructor(nombre: string, categoria: string, proveedor: string, precio: number, items: number){
        this.nombre = nombre;
        this.categoria = categoria;
        this.proveedor = proveedor;
        this.precio = precio;
        this.items = items;
    }
}
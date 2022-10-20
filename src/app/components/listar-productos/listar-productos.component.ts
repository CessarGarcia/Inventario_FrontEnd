import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.scss']
})
export class ListarProductosComponent implements OnInit {
  listProductos: Producto[] = [];
  dataUser: any;
  
  constructor(private _productoService: ProductoService,
        private toastr: ToastrService,
        private routes: Router,
        private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.isLogin();
  }

  isLogin(){
    this.afAuth.currentUser.then(user => {
      if(user){
        this.dataUser = user;
      }else{
        this.routes.navigate(['/Home']);
        this.toastr.error('Favor de registrar una cuenta', 'Error');
      }
    })
  }

  obtenerProductos() {
    this._productoService.getProductos().subscribe(data => {
      console.log(data);
      this.listProductos = data;
    }, error => {
      console.log(error);
    })
  }

  eliminarProducto(id: any) {
    this._productoService.eliminarProducto(id).subscribe(data => {
      this.toastr.error('El producto fue eliminado con exito' ,'Producto Eliminado');
      this.obtenerProductos();
    }, error => {
      console.log(error);
    })
  }

}
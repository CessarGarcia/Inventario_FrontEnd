import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';


@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  productoForm: FormGroup;
  dataUser: any;
  titulo = 'Crear producto';
  id: string | null;
  constructor( private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private _productoService: ProductoService,
              private aRouter: ActivatedRoute,
              private afAuth: AngularFireAuth) {
    this.productoForm = this.fb.group({
      //nombre, categoria, proveedor, precio, items
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      proveedor: ['', Validators.required],
      precio: ['', Validators.required],
      items: ['', Validators.required],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
    this.isLogin();
  }
  
  //Guard para que no pueda ingresar a la pagina sino esta logeado
  isLogin(){
    this.afAuth.currentUser.then(user => {
      if(user){
        this.dataUser = user;
      }else{
        this.router.navigate(['/Home']);
        this.toastr.error('Favor de registrar una cuenta', 'Error');
      }
    })
  }

  agregarProducto(){
    console.log(this.productoForm);

    const PRODUCTO: Producto = {
      nombre: this.productoForm.get('nombre')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      proveedor: this.productoForm.get('proveedor')?.value,
      precio: this.productoForm.get('precio')?.value,
      items: this.productoForm.get('items')?.value,
    }
    
    //Condicional para verificar que el id no este vacio 
    if(this.id !== null){
      //Editamos Producto
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data =>{
        this.toastr.info('El producto fue editado con exito!', 'Actualización Correcta!');
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.productoForm.reset();
      })
    }else{
      //agregamos producto
      console.log(PRODUCTO);
      this._productoService.guardarProducto(PRODUCTO).subscribe(data => {
        this.toastr.success('El producto fue registrado con exito!', 'Producto Registrado!');
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.productoForm.reset();
      })
    }

  }

  esEditar() {
    if(this.id !== null) {
      this.titulo = 'Editar producto';
      this._productoService.obtenerProducto(this.id).subscribe(data => {
        this.productoForm.setValue({
          //nombre, categoria, proveedor, precio, items
          nombre: data.nombre,
          categoria: data.categoria,
          proveedor: data.proveedor,
          precio: data.precio,
          items: data.items,
        })
      })
    }
  }
}

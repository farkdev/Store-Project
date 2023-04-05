const fs = require('fs')

class Productos{
    constructor (){
        this.productos = []
        this.path = './package.json'
        try{
            fs.readFile(this.path, 'utf-8', (err, data) => {
                if (err){
                    console.log(err)
                }else{
                    this.productos =JSON.parse(data)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async agregarProducto(nombre, descripcion, precio, codigo, stock){
        try {
            const producto = {
                nombre,
                descripcion,
                precio,
                codigo,
                stock
            }
            if (this.productos.length === 0){
                producto.id = 1
            } else {
                const ultimoProducto = this.productos[this.productos.length - 1]
                producto.id = ultimoProducto.id + 1
            }

            this.productos.push(producto)

            await fs.promises.writeFile(this.path, JSON.stringify(this.productos, null, 2))
            return producto
        } catch (error){
            throw new error(`no se agrego el producto ${err.message}`)
        }
        

    }
    async obtenerProducto(){
        try{
            const data = await fs.promises.readFile(this.path)
            this.productos = JSON.parse(data)
            return this.productos
        } catch (error){
            throw new Error(`no se encontro el producto seleccionado ${error.message}`)

        }

    }

    async obtenerProductobyID (id){
        try{
            const productos = await this.obtenerProducto()
            const producto = productos.find((p)=> p.id === id)
            if (!producto){
                throw new Error(`producto con id ${id} no encontrado`)
            }
            return producto
        } catch (err){
            console.log(`no se pudo obtener el producto con ese ID ${id} `)
        }  
    }

    async actualizarProducto(id, newData){
        try{
            const productos = await this.obtenerProducto()
            const productoIndex = productos.findIndex((producto) => producto.id === id)
            if (productoIndex <= -1){
                throw new Error(`Producto con ID ${id} no encontrado`)
            }
            const oldData = productos[productoIndex]
            const actualizarProducto = {...oldData, ...newData}
            productos[productoIndex] = actualizarProducto
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2))
            return actualizarProducto
        } catch (err){
            throw new Error(`no se pudo actualizar el producto ${err.message}`)
        }
    }

    async borrarProducto(id) { // Elimina un producto basado en su ID
        try {
          const productos = await this.obtenerProductos(); // Obtener todos los productos
          const productoIndex = productos.findIndex((producto) => producto.id === id); // Buscar el índice del producto a eliminar
          if (productoIndex === -1) { // Si no se encontró el producto, lanzar un error
            throw new Error(`Producto con ID ${id} no encontrado`);
          }
          productos.splice(productoIndex, 1); // Eliminar el producto del array
          await fs.promises.writeFile(this.path, JSON.stringify(productos)); // Guardar la lista actualizada de productos en el archivo
        } catch (error) {
          console.error(`Error al eliminar producto con ID ${id}: ${error.message}`);
        }
    }

}

const PM = new Productos


// PM.agregarProducto("Maceta", "Maceta Cerámica Mediana, color violeta", 4500, 135, 2)
// PM.agregarProducto("Porta Vela", "Porta vela cerámica chica, color verde variado", 2000, 234, 3)
// PM.agregarProducto("Tabla", "Tablita cerámica Mediana, color naranja", 3500, 123, 1)

PM.obtenerProducto().then(res => console.table(res))



module.exports=Productos
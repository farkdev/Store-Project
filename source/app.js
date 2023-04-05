const express = require('express')

const ProductoManager = require('./productos')
const productos = require('./package.json')
const { error } = require('console')



const ProM = new ProductoManager
const app = express()


app.use(express.urlencoded({extended:true}))


app.get('/productos', (req, res) =>{
    const limit = req.query.limit
    try{
        let mostrarProd = productos
        if(limit && parseInt(limit) > 0){
            mostrarProd = productos.slice(0, parseInt(limit))
        }
        return res.send({productos: mostrarProd})
    } catch (error){
        console.log(error)
        return res.status(500).send({error: "error al obtener los resultados"})
    }
})



app.listen(8080, ()=>{
    console.log("escuchando al servidor")
})
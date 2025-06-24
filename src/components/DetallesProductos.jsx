import React from 'react'
import { useParams } from 'react-router-dom'

const DetallesProductos = ({productos}) => {
    // console.log(productos);
    
    const {id} = useParams()

    const product = productos.find(producto => producto.id == id)

  return (
    <div>
      <h1>Detalle del producto: {id}</h1>
      {product ? (<h2>{product.nombre}</h2>) : (<p>Producto no encontrado</p>)}
    </div>
  )
}

export default DetallesProductos

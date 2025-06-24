import React from 'react'
import Header from '../components/estaticos/Header'
import Footer from '../components/estaticos/Footer'
import ProductList from '../components/ProductList'

const GaleriaDeProductos = ({cart,productos, cargando,agregarCarrito, borrarProducto}) => {
  return (
    <>
      <Header borrarProducto={borrarProducto} cartItems={cart}/>
      <h1>Galeria de productos</h1>
      {
        cargando ? 
          <div>Cargando...</div> :
          <ProductList agregarCarrito={agregarCarrito} productos={productos}/>
      }
      <Footer/>
    </>
  )
}

export default GaleriaDeProductos

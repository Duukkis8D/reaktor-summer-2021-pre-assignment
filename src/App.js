import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import ProductList from './components/ProductList'
import productService from './services/productService'
import './css/App.css'

const App = () => {
	const baseUrl = 'http://localhost:3001/api'
	
	const [ products, setProducts ] = useState( [] )
	const [ productType, setProductType ] = useState ( '' )
	const [ productManufacturers, setProductManufacturers ] = useState( [] )
	// Gets all product data (except availability).
	useEffect( () => {
		//console.log( 'productManufacturers in the beginning of useEffect: ', productManufacturers )

		productService
			.getProducts( baseUrl )
			.then( productData => {
				setProducts( productData )

				// Spreads 2-dimensional array to 1 dimension, filters out other than product manufacturer data
				// and passes the result to findManufacturers function.
				setProductManufacturers( productService.findManufacturers( 
					[].concat( ...productData ).map( product => product.manufacturer ) ) )
			} )
	}, [] )

	//console.log( 'productManufacturers after useEffect: ', productManufacturers )

	const [ productAvailabilities, setProductAvailabilities ] = useState( new Map() )
	// Gets all product availability data.
	useEffect( () => {
		productService
			.getProductAvailabilities( productManufacturers, baseUrl )
			.then( availabilityData => {
				setProductAvailabilities( availabilityData )
			} )

		console.log( 'productAvailabilities Map object in state: ', productAvailabilities )
	}, [ productManufacturers ] )

	const handleProductTypeChange = ( event ) => {
		setProductType( event.target.value )
	}

	const renderIfThereIsProductData = () => {
		if( typeof products !== 'undefined' && products.length > 0 ) {
			return (
				<div id='filterProductsAndProductListContainer'>
					<Filter productType={ productType }
						    handleProductTypeChange={ handleProductTypeChange }></Filter>
					<ProductList products={ products }
								 productType={ productType }></ProductList>
				</div>
			)
		} else return <p>Loading product data. Please wait.</p>
	}

	return (
		<div id='appContainer'>
			<h1>Product list</h1>
			{ renderIfThereIsProductData() }
		</div>
	)
}

export default App
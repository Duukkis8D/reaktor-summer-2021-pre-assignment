import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import ProductList from './components/ProductList'
import productService from './services/productService'
import './css/App.css'

const App = () => {
	const [ products, setProducts ] = useState( [] )
	const [ productType, setProductType ] = useState ( '' )
	const [ productManufacturers, setProductManufacturers ] = useState( [] )
	// Gets all product data (except availability).
	useEffect( () => {
		productService
			.getProducts()
			.then( productData => {
				setProducts( productData )

				// Spreads 2-dimensional array to 1 dimension, filters out other than product manufacturer data
				// and passes the result to findManufacturers function.
				setProductManufacturers( productService.findManufacturers( 
					[].concat( ...productData ).map( product => product.manufacturer ) ) )
			} )
	}, [] )

	const [ productAvailabilityData, setProductAvailabilityData ] = useState( [] )
	// Gets all product availability data.
	useEffect( () => {
		productService
			.getProductAvailabilityData( productManufacturers )
			.then( productAvailabilityData => {
				setProductAvailabilityData( productAvailabilityData )
			} )
			.catch( error => {
				console.error( 'Error occurred while fetching product availability data.', error )
			} )
	}, [ productManufacturers ] )

	const [ productAvailabilityMap, setProductAvailabilityMap ] = useState( new Map() )
	// Builds product availability Map data structure.
	// key: product manufacturer, value: product availability data
	useEffect( () => { 
		setProductAvailabilityMap( productService
			.buildProductAvailabilityMap( productManufacturers, productAvailabilityData ) )
	}, [ productAvailabilityData ] )

	const [ productsAndAvailabilities, setProductsAndAvailabilities ] = useState( [] )
	// Merges product and availability information.
	useEffect( () => {	
		setProductsAndAvailabilities( productService
			.buildCompleteProductList( products, productAvailabilityMap )
		)
	}, [ productAvailabilityMap ] )

	const handleProductTypeChange = ( event ) => {
		setProductType( event.target.value )
	}

	const renderIfThereIsProductData = () => {
		if( typeof productsAndAvailabilities !== 'undefined' && productsAndAvailabilities.length > 0 ) {
			return (
				<div id='filterProductsAndProductListContainer'>
					<Filter productType={ productType }
						    handleProductTypeChange={ handleProductTypeChange }></Filter>
					<ProductList productsAndAvailabilities={ productsAndAvailabilities }
								 productType={ productType }></ProductList>
				</div>
			)
		} else return <p>Loading product data. Please wait. This might take about 30-60 seconds.</p>
	}

	return (
		<div id='appContainer'>
			<h1>Product list</h1>
			{ renderIfThereIsProductData() }
		</div>
	)
}

export default App
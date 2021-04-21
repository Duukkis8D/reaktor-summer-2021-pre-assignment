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
		console.log( 'productManufacturers in the beginning of useEffect: ', productManufacturers )

		productService
			.getProducts( baseUrl )
			.then( response => {
				/*
				Move some of the code to productService. Check this:
				https://fullstackopen.com/osa2/palvelimella_olevan_datan_muokkaaminen
				const getAll = () => {
					const request = axios.get(baseUrl)
					return request.then(response => response.data)
				}
				... and so on.
				*/
				console.log( 'all products (headers, data etc):', response )

				const allProducts = []

				response.forEach( products => {
					allProducts.push( products.data )
				} )

				console.log( 'all products (only data):', allProducts )

				// allProducts contains [0]: gloves, [1]: facemasks, [2]: beanies
				setProducts( allProducts )

				// Spreading 2-dimensional array to 1 dimension.
				const allManufacturers = productService.findManufacturers( 
					[].concat( ...allProducts ).map( product => product.manufacturer ) )
				setProductManufacturers( allManufacturers )

				console.log( 'productManufacturers after the server response and setters: ', productManufacturers )
			} )
	}, [] )

	console.log( 'productManufacturers after useEffect: ', productManufacturers )

	const [ productAvailabilities, setProductAvailabilities ] = useState( new Map() )
	// Gets all product availability data.
	useEffect( () => {
		const productAvailabilityData = productService
			.getProductAvailabilities( productManufacturers, baseUrl )
		console.log( 'productAvailabilityData from useEffect:', productAvailabilityData )

		// Should setProductAvailabilities be in 'then' function in the same way than in productService.getProducts?
		setProductAvailabilities( productAvailabilityData )
		console.log( 'productAvailabilities Map object in state: ', productAvailabilities )
	}, [ productManufacturers ] )

	const handleProductTypeChange = ( event ) => {
		setProductType( event.target.value )
	}

	const renderIfThereIsProductData = () => {
		if( typeof products !== 'undefined' && products.length > 0 ) {
			return (
				<div id='filterProductsAndProductListContainer'>
					<Filter productType={ productType } handleProductTypeChange={ handleProductTypeChange }></Filter>
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
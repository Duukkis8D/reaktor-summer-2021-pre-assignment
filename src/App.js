import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import ProductList from './components/ProductList'

const App = () => {
	const baseUrl = 'https://reaktor-2021-duukkis8d.herokuapp.com/api'
	
	const [ products, setProducts ] = useState( [] )
	const [ productType, setProductType ] = useState ( '' )
	const [ productManufacturers, setProductManufacturers ] = useState( [] )
	//const [ gloveAvailability, setGloveAvailability ] = useState( Map )

	// Finds unique manufacturers from a long list with many duplicants.
	const findManufacturers = productsArray => {
		const manufacturers = []
		for ( let manufacturer of productsArray ) {
			if ( manufacturers.indexOf( manufacturer ) === -1 ) {
				manufacturers.push( manufacturer )
			}
		}

		return manufacturers
	}

	// Gets all products.
	useEffect( () => {
		console.log( 'productManufacturers in the beginning of useEffect: ', productManufacturers )

		Promise
			.all( [
				/*
				axios.get( `${baseUrl}/?category=gloves` ),
				axios.get( `${baseUrl}/?category=facemasks` ),
				axios.get( `${baseUrl}/?category=beanies` )
				*/
				axios.get( baseUrl, { params: { category: 'gloves' } } ),
				axios.get( baseUrl, { params: { category: 'facemasks' } } ),
				axios.get( baseUrl, { params: { category: 'beanies' } } )
			] )
			.then( response => {
				console.log( 'all products (headers, data etc):', response )

				const allProducts = []

				response.forEach( products => {
					allProducts.push( products.data )
				} )

				console.log( 'all products (only data):', allProducts )

				// allProducts contains [0]: gloves, [1]: facemasks, [2]: beanies
				setProducts( allProducts )

				// Spreading 2-dimensional array to 1 dimension.
				const allManufacturers = findManufacturers( 
					[].concat( ...allProducts ).map( product => product.manufacturer ) )
				setProductManufacturers( allManufacturers )

				console.log( 'productManufacturers after the server response and setters: ', productManufacturers )
			} )
	}, [] )

	console.log( 'productManufacturers after useEffect: ', productManufacturers )

	const handleProductTypeChange = ( event ) => {
		setProductType( event.target.value )
	}

	/*
	const gloveAvailabilityPromises = new Map()
	const gloveAvailability = gloveManufacturers => {  
		gloveManufacturers.forEach( manufacturer => {
			gloveAvailabilityPromises.set( manufacturer, axios.get( `${this.baseUrl}/availability/${manufacturer}` ) )
			console.log( manufacturer )
		} )

		return gloveAvailabilityPromises
	}
	*/

	// How to keep manufacturer information during HTTP requests? I need to know which HTTP response is for which
	// manufacturer. Perhaps copying the keys from gloveAvailabilityPromises Map to gloveAvailabilityData Map...
	/*
	const gloveAvailabilityData = new Map()
	Promise
		.all( gloveAvailability( this.state.gloveManufacturers ) )
		.then( results => {
			results.forEach( response => {
				console.log( response.data )
				gloveAvailabilityData.set( response.data )
			} )
		} )
	*/

	// Then set availability data to App state. No code yet...

	return (
		<div>
			<h1>Product list</h1>
			<Filter productType={ productType } handleProductTypeChange={ handleProductTypeChange }></Filter>
			<ProductList products={ products }
						 productType={ productType }></ProductList>
		</div>
	)
}

export default App
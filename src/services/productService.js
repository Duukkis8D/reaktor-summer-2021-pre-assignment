import React from 'react'
import axios from 'axios'

// axios response interceptor. Request is sent again if the array of server response is empty.
axios.interceptors.response.use( response => {
	const baseUrl = '/api'

	console.log( 'axios response interceptor:' )
	console.log( 'response in server response:', response )
	console.log( 'response.data.length in server response:', response.data.length )

	if( response.config.params.manufacturer ) {
		if( response.data.length <= 2 ) {
			console.error( 
				'invalid server response detected with parameter:', response.config.params.manufacturer,
				'response.data.length:', response.data.length,
				'requesting data again...' 
			)

			return axios.get( baseUrl, { params: { manufacturer: response.config.params.manufacturer } } )
		}
	}

	return response
}, error => {
	return Promise.reject( 'error occurred during API request:', error )
} )

const getProducts = ( baseUrl ) => {
	return Promise
		.all( [
			axios.get( baseUrl, { params: { category: 'gloves' } } ),
			axios.get( baseUrl, { params: { category: 'facemasks' } } ),
			axios.get( baseUrl, { params: { category: 'beanies' } } )
		] )
		.then( response => {
			const allProducts = response.map( response => response.data )
			// allProducts contains [0]: gloves, [1]: facemasks, [2]: beanies
			return allProducts
		} )
}

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

const getProductAvailabilityData = ( productManufacturers, baseUrl ) => {
	const createProductAvailabilityPromise = ( productManufacturer ) => {
		return axios.get( baseUrl, { params: { manufacturer: productManufacturer } } )
	}

	const productAvailabilityPromises = productManufacturers.map( productManufacturer => {
		return createProductAvailabilityPromise( productManufacturer )
	} )

	console.log( 
		'1. getProductAvailabilityData(...), productAvailabilityPromises:', 
		productAvailabilityPromises 
	)

	return Promise
		.all( productAvailabilityPromises )
		.then( serverResponses => { 
			console.log( 
				'return Promise.all( productAvailabilityPromises ).then( serverResponses => {', '\n',
				'serverResponses:', serverResponses
			)
			return serverResponses.map( response => response.data ) 
		} )
}

const buildProductAvailabilityMap = ( productManufacturers, productAvailabilityData ) => {
	const productAvailabilityMap = new Map()

	for( let i = 0; i < productManufacturers.length; i++ ) {
		productAvailabilityMap.set( productManufacturers[ i ], productAvailabilityData[ i ] )
	}

	if( typeof productAvailabilityData !== 'undefined' && productAvailabilityData.length > 0 ) {
		console.log( 
			'2. buildProductAvailabilityMap(...), productAvailabilityData:', 
			productAvailabilityData
		)
		console.log(
			'2. buildProductAvailabilityMap(...), productAvailabilityMap:', 
			productAvailabilityMap
		)

		return productAvailabilityMap
	} else {
		console.log(
			'2. buildProductAvailabilityMap(...), returning empty Map'
		)

		return new Map()
	}
}

const buildCompleteProductList = ( products, productAvailabilities ) => {
	const addAvailabilityInfo = ( product ) => {
		return (
			<tr key={ product.id }>
				<td key={ product.id }>{ product.id }</td>
				<td key={ product.type }>{ product.type }</td>
				<td key={ product.name }>{ product.name }</td>
				<td key={ product.color }>{ product.color.map( color => `${color} ` ) }</td>
				<td key={ product.manufacturer }>{ product.manufacturer }</td>
				<td key={ product.price }>{ product.price }</td>
				<td key={ product.availability }>{ productAvailabilities
					.get( product.manufacturer )
					.filter( availabilityObject => availabilityObject.id === product.id.toUpperCase() )
					.map( productAvailabilityInfo => {
						return productAvailabilityInfo
							.DATAPAYLOAD
							.substring(
								productAvailabilityInfo.DATAPAYLOAD.search( '<INSTOCKVALUE>' ) + 14,
								productAvailabilityInfo.DATAPAYLOAD.search( '</INSTOCKVALUE>' )
							)
					} )[0].toLowerCase() }
				</td>
			</tr>
		)
	}

	if( typeof productAvailabilities !== 'undefined' && productAvailabilities.size > 0 ) {
		console.log(
			'3. buildCompleteProductList(...), productAvailabilities:', 
			productAvailabilities
		)

		return products.map( productList => {
			return productList.map( addAvailabilityInfo )
		} )
	} else {
		console.log(
			'3. buildCompleteProductList(...), returning Loading product data. Please wait. info text'
		)

		return ( <tr><td>Loading product data. Please wait.</td></tr> )
	}
}

export default { 
	getProducts,
	findManufacturers,
	getProductAvailabilityData,
	buildProductAvailabilityMap,
	buildCompleteProductList
}
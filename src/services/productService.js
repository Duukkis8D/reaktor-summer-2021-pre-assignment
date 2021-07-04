import React from 'react'
import axios from 'axios'
import retryApiRequest from './retryApiRequest'

const axiosInstance = axios.create()
const baseUrl = 'http://localhost:3001/api'
retryApiRequest.axiosResponseInterceptor( axiosInstance, baseUrl )

const getProducts = () => {
	return Promise
		.all( [
			axiosInstance.get( baseUrl, { params: { category: 'gloves' } } ),
			axiosInstance.get( baseUrl, { params: { category: 'facemasks' } } ),
			axiosInstance.get( baseUrl, { params: { category: 'beanies' } } )
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

const getProductAvailabilityData = ( productManufacturers ) => {
	const createProductAvailabilityPromise = ( productManufacturer ) => {
		return axiosInstance.get( baseUrl, { params: { manufacturer: productManufacturer } } )
	}

	const productAvailabilityPromises = productManufacturers.map( productManufacturer => {
		return createProductAvailabilityPromise( productManufacturer )
	} )

	/*
	console.log( 
		'1. getProductAvailabilityData(...), productAvailabilityPromises:', 
		productAvailabilityPromises 
	)
	*/

	return Promise
		.all( productAvailabilityPromises )
		.then( serverResponses => { 
			/*
			console.log( 
				'return Promise.all( productAvailabilityPromises ).then( serverResponses => {', '\n',
				'serverResponses:', serverResponses
			)
			*/

			return serverResponses.map( response => response.data ) 
		} )
}

const buildProductAvailabilityMap = ( productManufacturers, productAvailabilityData ) => {
	const productAvailabilityMap = new Map()

	for( let i = 0; i < productManufacturers.length; i++ ) {
		productAvailabilityMap.set( productManufacturers[ i ], productAvailabilityData[ i ] )
	}

	if( typeof productAvailabilityData !== 'undefined' && productAvailabilityData.length > 0 ) {
		/*
		console.log( 
			'2. buildProductAvailabilityMap(...), productAvailabilityData:', 
			productAvailabilityData
		)
		console.log(
			'2. buildProductAvailabilityMap(...), productAvailabilityMap:', 
			productAvailabilityMap
		)
		*/

		return productAvailabilityMap
	} else {
		/*
		console.log(
			'2. buildProductAvailabilityMap(...), returning empty Map'
		)
		*/

		return new Map()
	}
}

const buildCompleteProductList = ( products, productAvailabilities ) => {
	const addAvailabilityInfo = ( product ) => {
		return ( {
			id: product.id,
			type: product.type,
			name: product.name,
			color: product.color.map( color => `${color} ` ),
			price: product.price,
			manufacturer: product.manufacturer,
			availability: productAvailabilities
				.get( product.manufacturer )
				.filter( availabilityObject => availabilityObject.id === product.id.toUpperCase() )
				.map( productAvailabilityInfo => {
					return productAvailabilityInfo
						.DATAPAYLOAD
						.substring(
							productAvailabilityInfo.DATAPAYLOAD.search( '<INSTOCKVALUE>' ) + 14,
							productAvailabilityInfo.DATAPAYLOAD.search( '</INSTOCKVALUE>' )
						)
				} )[0].toLowerCase()
		} )
	}

	if( typeof productAvailabilities !== 'undefined' && productAvailabilities.size > 0 ) {
		/*
		console.log(
			'3. buildCompleteProductList(...), productAvailabilities:', 
			productAvailabilities
		)
		*/

		return products.map( productList => {
			return productList.map( addAvailabilityInfo )
		} )
	} else {
		/*
		console.log(
			'3. buildCompleteProductList(...), returning Loading product data. Please wait. info text'
		)
		*/

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
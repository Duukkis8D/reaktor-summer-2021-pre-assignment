import React from 'react'
import axios from 'axios'

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

const buildProductAvailabilityMap = ( productManufacturers, productAvailabilityData ) => {
	const productAvailabilityMap = new Map()

	for( let i = 0; i < productManufacturers.length; i++ ) {
		productAvailabilityMap.set( productManufacturers[ i ], productAvailabilityData[ i ] )
	}

	return productAvailabilityMap
}

const getProductAvailabilityPromises = ( productManufacturers, baseUrl ) => {
	const createProductAvailabilityPromise = ( productManufacturer ) => {
		return axios.get( baseUrl, { params: { manufacturer: productManufacturer } } )
	}

	const productAvailabilityPromises = productManufacturers.map( productManufacturer => {
		return createProductAvailabilityPromise( productManufacturer )
	} )

	return Promise
		.all( productAvailabilityPromises )
		.then( response => response.map( serverResponse => serverResponse.data ) )
}

const buildCompleteProductList = ( products, productAvailabilities ) => {
	console.log( 'productAvailabilities in buildCompleteProductList function:', productAvailabilities )

	const testProductAvailability = productAvailabilities
		.get( 'ippal' )
		.filter( id => id === '5A32A104E2E0A003B3064' )
	console.log( 'testProductAvailability in buildCompleteProductList function:', testProductAvailability )

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
					.filter( id => id === product.id )
					.map( productAvailabilityInfo => {
						return productAvailabilityInfo
							.DATAPAYLOAD
							.substring(
								productAvailabilityInfo.DATAPAYLOAD.search( '<INSTOCKVALUE>' ),
								productAvailabilityInfo.DATAPAYLOAD.search( '</INSTOCKVALUE>' )
							)
					} ) }
				</td>
			</tr>
		)
	}

	return products.map( productList => {
		return productList.map( addAvailabilityInfo )
	} )
}

export default { 
	getProducts, 
	findManufacturers, 
	buildCompleteProductList, 
	buildProductAvailabilityMap, 
	getProductAvailabilityPromises 
}
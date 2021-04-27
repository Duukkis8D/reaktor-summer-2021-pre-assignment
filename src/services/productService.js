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
			console.log( 'all products (headers, data etc):', response )

			const allProducts = response.map( products => products.data )

			console.log( 'all products (only data):', allProducts )

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

	console.log( 'manufacturers in findManufacturers function:', manufacturers )
	return manufacturers
}

const getProductAvailabilityPromises = ( productManufacturers, baseUrl ) => {
	const productAvailabilityPromises = productManufacturers.map( productManufacturer => {
		return axios.get( baseUrl, { params: { manufacturer: productManufacturer } } )
	} )

	return productAvailabilityPromises
}

const buildProductAvailabilityMap = ( productManufacturers, productAvailabilityData ) => {
	console.log( 
		'productAvailabilityData (response field) from buildProductAvailabilityMap function:', 
		productAvailabilityData 
	)

	const productAvailabilityMap = new Map()

	for( let i = 0; i < productManufacturers.length; i++ ) {
		productAvailabilityMap.set( productManufacturers[ i ], productAvailabilityData[ i ] )
	}

	console.log( 'productAvailabilityMap (keys, values):', productAvailabilityMap )
	return productAvailabilityMap
}

const buildCompleteProductList = ( products, productAvailabilities ) => {
	console.log( 'productAvailabilities in buildCompleteProductList function:', productAvailabilities )

	/*
	How to nest map functions: 
	var array = [[1, 2], [3, 4]];
	var double = x => x * 2;
	var doubledArray = array.map( subarray => subarray.map( double ));
	*/

	const addAvailabilityInfo = ( product ) => {
		console.log( 'product in buildCompleteProductList function:', product )
		console.log(
			'productAvailabilities.get( product.manufacturer ) in addAvailabilityInfo function:',
			productAvailabilities.get( product.manufacturer )
		)
		
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
		productList.map( addAvailabilityInfo )
	} )
}

const getProductAvailabilities = ( productManufacturers, baseUrl ) => {
	return Promise
		.all( getProductAvailabilityPromises( productManufacturers, baseUrl ) )
		.then( serverResponse => {
			console.log( 
				'product availability serverResponse from getProductAvailabilities function:', 
				serverResponse
			)
			return serverResponse.map( response => response.data )
		} )
		.then( productAvailabilityData => {
			console.log( 
				'product availability serverResponse data field from getProductAvailabilities function:', 
				productAvailabilityData 
			)
			return buildProductAvailabilityMap( productManufacturers, productAvailabilityData.map( data => data.response ) )
		} )
}

export default { getProducts, findManufacturers, buildCompleteProductList, getProductAvailabilities }
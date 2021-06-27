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

const getProductAvailabilityPromises = ( productManufacturers, baseUrl ) => {
	const createProductAvailabilityPromise = ( productManufacturer ) => {
		axios
			.get( baseUrl, { params: { manufacturer: productManufacturer } } )
			.then( serverResponse => {
				const productAvailabilityData = serverResponse.data

				if( productAvailabilityData.length > 2 ) {
					console.log( '1. createProductAvailabilityPromise(...), productAvailabilityData.length:', 
						productAvailabilityData.length,
						'valid server response with', productManufacturer, 'productManufacturer'
					)
					return productAvailabilityData
				} else if( productAvailabilityData.length <= 2 ) {
					console.log( '1. createProductAvailabilityPromise(...), productAvailabilityData.length:', 
						productAvailabilityData.length,
						'invalid server response with', 
						productManufacturer, 'productManufacturer, fetching data again...'
					)
					createProductAvailabilityPromise( productManufacturer )
				}
			} )
			.catch( error => {
				console.error( '1. Error occurred while fetching product availability data.', error )
			} )
	}

	const productAvailabilityPromises = productManufacturers.map( productManufacturer => {
		return createProductAvailabilityPromise( productManufacturer )
	} )

	console.log( 
		'2. getProductAvailabilityPromises(...), productAvailabilityPromises:', 
		productAvailabilityPromises 
	)

	return productAvailabilityPromises
}

const buildProductAvailabilityMap = ( productManufacturers, productAvailabilityData ) => {
	const productAvailabilityMap = new Map()

	for( let i = 0; i < productManufacturers.length; i++ ) {
		productAvailabilityMap.set( productManufacturers[ i ], productAvailabilityData[ i ] )
	}

	return productAvailabilityMap
}

const getProductAvailabilities = ( productManufacturers, baseUrl ) => {
	const productAvailabilities = getProductAvailabilityPromises( productManufacturers, baseUrl )
	return buildProductAvailabilityMap( productManufacturers, productAvailabilities )
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

	return products.map( productList => {
		return productList.map( addAvailabilityInfo )
	} )
}

export default { 
	getProducts, 
	findManufacturers, 
	buildCompleteProductList,
	getProductAvailabilities
}
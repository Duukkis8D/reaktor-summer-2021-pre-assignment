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
	const createProductAvailabilityPromise = ( productManufacturer ) => {
		axios
			.get( baseUrl, { params: { manufacturer: productManufacturer } } )
			.then( serverResponse => {
				const productAvailabilityData = serverResponse.data.response
				console.log(
					'productAvailabilityData from createProductAvailabilityPromise function:', 
					productAvailabilityData
				)

				if( productAvailabilityData.length > 2 ) {
					console.log( 'productAvailabilityData.length:', productAvailabilityData.length,
						productManufacturer, 'valid server response' )
					return productAvailabilityData
				} else if( productAvailabilityData.length <= 2 ) {
					console.log( 'productAvailabilityData.length:', productAvailabilityData.length,
						productManufacturer, 'invalid server response' )
					createProductAvailabilityPromise( productManufacturer )
				} else throw 'Error occurred.'
			} )
	}

	const productAvailabilityPromises = productManufacturers.map( productManufacturer => {
		createProductAvailabilityPromise( productManufacturer )
	} )
	console.log( 
		'productAvailabilityPromises in getProductAvailabilityPromises function:', 
		productAvailabilityPromises 
	)

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

const getProductAvailabilities = ( productManufacturers, baseUrl ) => {
	const productAvailabilities = getProductAvailabilityPromises( productManufacturers, baseUrl )
	return buildProductAvailabilityMap( productManufacturers, productAvailabilities )
}

const buildCompleteProductList = ( products, productAvailabilities ) => {
	console.log( 'productAvailabilities in buildCompleteProductList function:', productAvailabilities )

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
		productList.map( addAvailabilityInfo )
	} )
}

export default { getProducts, findManufacturers, buildCompleteProductList, getProductAvailabilities }
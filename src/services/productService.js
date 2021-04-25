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

/* const buildCompleteProductList = ( products, productAvailabilities ) => {

} */

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

export default { getProducts, findManufacturers, getProductAvailabilities }
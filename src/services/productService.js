import axios from 'axios'

const getProducts = ( baseUrl ) => {
	return Promise.all( [
		axios.get( baseUrl, { params: { category: 'gloves' } } ),
		axios.get( baseUrl, { params: { category: 'facemasks' } } ),
		axios.get( baseUrl, { params: { category: 'beanies' } } )
	] )
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
	const productAvailabilityPromises = []

	productManufacturers.forEach( productManufacturer => {
		/*
		The order of manufacturers in productManufacturers array
		is preserved in the new productAvailabilityPromises array.
		*/
		productAvailabilityPromises.push( 
			axios.get( baseUrl, { params: { manufacturer: productManufacturer } } )
		)
		//console.log( 'product manufacturer from getProductAvailabilityPromises function: ', productManufacturer )
	} )

	//console.log( 'productAvailabilityPromises Array object: ', productAvailabilityPromises )

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
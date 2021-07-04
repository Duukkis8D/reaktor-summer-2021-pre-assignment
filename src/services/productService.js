import axios from 'axios'
import retryApiRequest from './retryApiRequest'

const axiosInstance = axios.create()
const baseUrl = 'https://reaktor-2021-duukkis8d.herokuapp.com/api'
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

	return Promise
		.all( productAvailabilityPromises )
		.then( serverResponses => serverResponses.map( response => response.data ) )
}

const buildProductAvailabilityMap = ( productManufacturers, productAvailabilityData ) => {
	const productAvailabilityMap = new Map()

	for( let i = 0; i < productManufacturers.length; i++ ) {
		productAvailabilityMap.set( productManufacturers[ i ], productAvailabilityData[ i ] )
	}

	return productAvailabilityMap
}

const buildCompleteProductList = ( products, productAvailabilities ) => {
	const addAvailabilityInfo = ( product ) => {
		return ( {
			id: product.id,
			type: product.type,
			name: product.name.toLowerCase(),
			color: product.color.map( color => `${color}` ),
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

	return products.map( productList => {
		return productList.map( addAvailabilityInfo )
	} )
}

export default { 
	getProducts,
	findManufacturers,
	getProductAvailabilityData,
	buildProductAvailabilityMap,
	buildCompleteProductList
}
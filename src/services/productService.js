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

export default { getProducts, findManufacturers }
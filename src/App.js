import React, { useState, useEffect } from 'react'
import axios from 'axios'

// The app only gets glove data now.
const App = () => {
	const glovesUrl = 'https://reaktor-2021-duukkis8d.herokuapp.com'
	//const baseUrl = 'https://bad-api-assignment.reaktor.com' // old temp address
	//const glovesUrl = `${baseUrl}/products/jackets` // old temp address
	const [ glovesArray, setGloves ] = useState( [] )
	const [ gloveManufacturersArray, setGloveManufacturers ] = useState( [] )
	//const [ gloveAvailability, setGloveAvailability ] = useState( Map )

	// Gets all gloves.
	useEffect( () => {
		axios
			.get( glovesUrl )
			.then( response => {
				const allManufacturers = findManufacturers( response.data.map( glove => glove.manufacturer ) )

				setGloves( response.data )
				setGloveManufacturers( allManufacturers )
				console.log( gloveManufacturersArray ) // findManufacturers function is skipped?
			} )
	}, [] )

	// Finds unique manufacturers from a long list with many duplicants.
	const findManufacturers = gloves => {
		const manufacturers = []
		for ( let manufacturer of gloves ) {
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

	return (
		// This table code should be in its own component ProductList. Product type (glove, facemask or beanie) could
		// be passed as props to the component. Now only gloves get rendered and there is no availability information.
		// Product availability information could be found with using correct manufacturer in the HTTP request url and 
		// then searching with specific product id.
		<table>
			<thead>
				<tr>
					<th>id</th>
					<th>product name</th>
					<th>color</th>
					<th>manufacturer</th>
					<th>price</th>
					<th>availability</th>
				</tr>
			</thead>
			<tbody>
				{ glovesArray.map( glove => 
					<tr key={ glove.id }>
						<td key={ glove.id }>{ glove.id }</td>
						<td key={ glove.name }>{ glove.name }</td>
						<td key={ glove.color }>{ glove.color.map( color => `${color} ` ) }</td>
						<td key={ glove.manufacturer }>{ glove.manufacturer }</td>
						<td key={ glove.price }>{ glove.price }</td>
					</tr>
				) }
			</tbody>
		</table>
	)
}

export default App
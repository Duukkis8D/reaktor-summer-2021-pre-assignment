import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
	const baseUrl = 'https://reaktor-2021-duukkis8d.herokuapp.com'
	
	const [ products, setProducts ] = useState( [] )
	const [ productManufacturers, setProductManufacturers ] = useState( [] )
	//const [ gloveAvailability, setGloveAvailability ] = useState( Map )

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

	// Gets all products.
	useEffect( () => {
		console.log( 'productManufacturers in the beginning of useEffect: ', productManufacturers )

		Promise
			.all( [
				axios.get( `${baseUrl}/?category=gloves` ),
				axios.get( `${baseUrl}/?category=facemasks` ),
				axios.get( `${baseUrl}/?category=beanies` )
			] )
			.then( response => {
				console.log( 'all products:', response )

				const allProducts = []

				response.forEach( products => {
					allProducts.push( products.data )
				} )

				// allProducts contains [0]: gloves, [1]: facemasks, [2]: beanies
				setProducts( allProducts )

				// Spreading 2-dimensional array to 1 dimension.
				const allManufacturers = findManufacturers( 
					[].concat( ...allProducts ).map( product => product.manufacturer ) )
				setProductManufacturers( allManufacturers )

				console.log( 'productManufacturers after the server response and setters: ', productManufacturers )
			} )
	}, [] )

	console.log( 'productManufacturers after useEffect: ', productManufacturers )

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

	const renderGloves = () => {
		if( products[0] !== undefined ) {
			return (
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
						{ products[0].map( glove => 
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
		} else return <p>Loading...</p>
	}

	return (
		/*
		This table code should be in its own component ProductList. Product type (glove, facemask or beanie) could
		be passed as props to the component. Now only gloves get rendered and there is no availability information.
		Product availability information could be found with using correct manufacturer in the HTTP request url and 
		then searching with specific product id.
		*/
		<div>
			<div>
				<button>gloves</button>
				<button>facemasks</button>
				<button>beanies</button>
			</div>
			<br></br>
			{ renderGloves() }
		</div>
	)
}

export default App
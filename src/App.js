import React from 'react'
import axios from 'axios'

// The app only gets glove data now.
class App extends React.Component {
	constructor( props ) {
		super( props )
		this.baseUrl = 'https://bad-api-assignment.reaktor.com/v2' // CORS error occurs
		//this.baseUrl = 'https://bad-api-assignment.reaktor.com'
		this.glovesUrl = `${this.baseUrl}/products/gloves` // CORS error occurs
		//this.glovesUrl = `${this.baseUrl}/products/jackets`
		this.state = {
			gloves: [],
			gloveManufacturers: [],
			gloveAvailability: Map
		}
	}

	componentDidMount() {
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

		// Gets all gloves.
		axios
			.get( this.glovesUrl )
			.then( response => {
				const allManufacturers = findManufacturers( response.data.map( glove => glove.manufacturer ) )
				this.setState( { 
					gloves: response.data,
					gloveManufacturers: allManufacturers
				} )
			} )

		const gloveAvailabilityPromises = new Map()
		const gloveAvailability = gloveManufacturers => {  
			gloveManufacturers.forEach( manufacturer => {
				gloveAvailabilityPromises.set( manufacturer, axios.get( `${this.baseUrl}/availability/${manufacturer}` ) )
				console.log( manufacturer )
			} )

			return gloveAvailabilityPromises
		}

		// How to keep manufacturer information during HTTP requests? I need to know which HTTP response is for which
		// manufacturer. Perhaps copying the keys from gloveAvailabilityPromises Map to gloveAvailabilityData Map...
		const gloveAvailabilityData = new Map()
		Promise
			.all( gloveAvailability( this.state.gloveManufacturers ) )
			.then( results => {
				results.forEach( response => {
					console.log( response.data )
					gloveAvailabilityData.set( response.data )
				} )
			} )

		// Then set availability data to App state. No code yet...
	}
	
	render() {
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
					{ this.state.gloves.map( glove => 
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
}

export default App
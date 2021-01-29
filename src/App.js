import React from 'react'
import axios from 'axios'

// The app only gets jacket data now.
class App extends React.Component {
	constructor( props ) {
		super( props )
		this.baseUrl = 'https://bad-api-assignment.reaktor.com'
		this.jacketsUrl = `${this.baseUrl}/products/jackets`
		this.state = {
			jackets: [],
			jacketManufacturers: [],
			jacketAvailability: Map
		}
	}

	componentDidMount() {
		// Finds unique manufacturers from a long list with many duplicants.
		const findManufacturers = jackets => {
			const manufacturers = []
			for ( let manufacturer of jackets ) {
				if ( manufacturers.indexOf( manufacturer ) === -1 ) {
					manufacturers.push( manufacturer )
				}
			}
		
			return manufacturers
		}

		// Gets all jackets.
		axios
			.get( this.jacketsUrl )
			.then( response => {
				const allManufacturers = findManufacturers( response.data.map( jacket => jacket.manufacturer ) )
				this.setState( { 
					jackets: response.data,
					jacketManufacturers: allManufacturers
				} )
			} )

		const jacketAvailabilityPromises = new Map()
		const jacketAvailability = jacketManufacturers => {  
			jacketManufacturers.forEach( manufacturer => {
				jacketAvailabilityPromises.set( manufacturer, axios.get( `${this.baseUrl}/availability/${manufacturer}` ) )
				console.log( manufacturer )
			} )

			return jacketAvailabilityPromises
		}

		// How to keep manufacturer information during HTTP requests? I need to know which HTTP response is for which
		// manufacturer. Perhaps copying the keys from jacketAvailabilityPromises Map to jacketAvailabilityData Map...
		const jacketAvailabilityData = new Map()
		Promise
			.all( jacketAvailability( this.state.jacketManufacturers ) )
			.then( results => {
				results.forEach( response => {
					console.log( response.data )
					jacketAvailabilityData.set( response.data )
				} )
			} )

		// Then set availability data to App state. No code yet...
	}
	
	render() {
		return (
			// This table code should be in its own component ProductList. Product type (jacket, shirt or accessory) could
			// be passed as props to the component. Now only jackets get rendered and there is no availability information.
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
					{ this.state.jackets.map( jacket => 
						<tr key={ jacket.id }>
							<td key={ jacket.id }>{ jacket.id }</td>
							<td key={ jacket.name }>{ jacket.name }</td>
							<td key={ jacket.color }>{ jacket.color.map( color => `${color} ` ) }</td>
							<td key={ jacket.manufacturer }>{ jacket.manufacturer }</td>
							<td key={ jacket.price }>{ jacket.price }</td>
						</tr>
					) }
				</tbody>
			</table>
		)
	}
}

export default App
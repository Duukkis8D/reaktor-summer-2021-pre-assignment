import React from 'react'

const ProductList = ( { products, productType } ) => {
	const renderProductList = () => {
		if( productType !== '' ) {
			return (
				<table>
					<thead>
						<tr>
							<th>id</th>
							<th>type</th>
							<th>product name</th>
							<th>color</th>
							<th>manufacturer</th>
							<th>price</th>
							<th>availability</th>
						</tr>
					</thead>
					<tbody>
						{ renderProducts() }
					</tbody>
				</table>
			)
		} else {
			return ( <p>Loading...</p> )
		}
	}

	const renderProducts = () => {
		if( productType === 'gloves' ) {
			return (
				products[0].map( product => 
					<tr key={ product.id }>
						<td key={ product.id }>{ product.id }</td>
						<td key={ product.type }>{ product.type }</td>
						<td key={ product.name }>{ product.name }</td>
						<td key={ product.color }>{ product.color.map( color => `${color} ` ) }</td>
						<td key={ product.manufacturer }>{ product.manufacturer }</td>
						<td key={ product.price }>{ product.price }</td>
					</tr>
				)
			)
		}
		if( productType === 'facemasks' ) {
			return (
				products[1].map( product => 
					<tr key={ product.id }>
						<td key={ product.id }>{ product.id }</td>
						<td key={ product.type }>{ product.type }</td>
						<td key={ product.name }>{ product.name }</td>
						<td key={ product.color }>{ product.color.map( color => `${color} ` ) }</td>
						<td key={ product.manufacturer }>{ product.manufacturer }</td>
						<td key={ product.price }>{ product.price }</td>
					</tr>
				)
			)
		}
		if( productType === 'beanies' ) {
			return (
				products[2].map( product => 
					<tr key={ product.id }>
						<td key={ product.id }>{ product.id }</td>
						<td key={ product.type }>{ product.type }</td>
						<td key={ product.name }>{ product.name }</td>
						<td key={ product.color }>{ product.color.map( color => `${color} ` ) }</td>
						<td key={ product.manufacturer }>{ product.manufacturer }</td>
						<td key={ product.price }>{ product.price }</td>
					</tr>
				)
			)
		} else return <tr><td>Loading...</td></tr>
	}

	/*
    This table code should be in its own component ProductList. Product type (product, facemask or beanie) could
    be passed as props to the component. Now only gloves get rendered and there is no availability information.
    Product availability information could be found with using correct manufacturer in the HTTP request url and 
    then searching with specific product id.
    */
	return (  
		<div>
			{ renderProductList() }
		</div>
	)
}

export default ProductList
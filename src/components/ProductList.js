import React from 'react'

const ProductList = ( { productsAndAvailabilities, productType } ) => {
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
		} else return // return nothing
	}

	const renderProducts = () => {
		if( productType === 'gloves' ) {
			console.log( 'productsAndAvailabilities[0] in renderProducts function:', productsAndAvailabilities[0] )
			return productsAndAvailabilities[0]
		}
		if( productType === 'facemasks' ) {
			console.log( 'productsAndAvailabilities[1] in renderProducts function:', productsAndAvailabilities[1] )
			return productsAndAvailabilities[1]
		}
		if( productType === 'beanies' ) {
			console.log( 'productsAndAvailabilities[2] in renderProducts function:', productsAndAvailabilities[2] )
			return productsAndAvailabilities[2]
		} else return <tr><td>Loading product data. Please wait.</td></tr>
	}

	return (  
		<div id='productListContainer'>
			{ renderProductList() }
		</div>
	)
}

export default ProductList
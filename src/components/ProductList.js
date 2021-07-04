import React from 'react'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

const ProductList = ( { productsAndAvailabilities, productType } ) => {
	const renderProductList = () => {
		if( productType !== '' ) {
			return (
				<Table
					width={ 1200 }
					height={ 500 }
					headerHeight={ 20 }
					rowHeight={ 30 }
					rowCount={ getProductData().length }
					rowGetter={ ( { index } ) => getProductData()[index] }>
					<Column label="id" dataKey="id" width={ 220 } flexGrow={ 1 } flexShrink={ 2 } />
					<Column label="type" dataKey="type" width={ 60 } flexGrow={ 1 } flexShrink={ 2 } />
					<Column label="name" dataKey="name" width={ 300 } flexGrow={ 1 } flexShrink={ 2 } />
					<Column label="color" dataKey="color" width={ 100 } flexGrow={ 1 } flexShrink={ 2 } />
					<Column label="price" dataKey="price" width={ 60 } flexGrow={ 1 } flexShrink={ 2 } />
					<Column label="manufacturer" dataKey="manufacturer" width={ 130 } flexGrow={ 1 } flexShrink={ 2 } />
					<Column label="availability" dataKey="availability" width={ 130 } flexGrow={ 1 } flexShrink={ 2 } />
				</Table>
			)
		} else return // return nothing
	}

	const getProductData = () => {
		if( productType === 'gloves' ) {
			//console.log( 'productsAndAvailabilities[0] in renderProducts function:', productsAndAvailabilities[0] )
			return productsAndAvailabilities[0]
		}
		if( productType === 'facemasks' ) {
			//console.log( 'productsAndAvailabilities[1] in renderProducts function:', productsAndAvailabilities[1] )
			return productsAndAvailabilities[1]
		}
		if( productType === 'beanies' ) {
			//console.log( 'productsAndAvailabilities[2] in renderProducts function:', productsAndAvailabilities[2] )
			return productsAndAvailabilities[2]
		} else return [ 'Loading product data. Please wait. This might take around 1 minute' ]
	}

	return (  
		<div id='productListContainer'>
			{ renderProductList() }
		</div>
	)
}

export default ProductList
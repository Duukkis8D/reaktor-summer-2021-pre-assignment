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
			return productsAndAvailabilities[0]
		}
		if( productType === 'facemasks' ) {
			return productsAndAvailabilities[1]
		}
		if( productType === 'beanies' ) {
			return productsAndAvailabilities[2]
		} else return [ 'Unexpected error occurred. Please refresh page.' ]
	}

	return (  
		<div id='productListContainer'>
			{ renderProductList() }
		</div>
	)
}

export default ProductList
import React from 'react'

const Filter = ( { handleProductTypeChange } ) => {
	return (
		<div id='filterProductsContainer'>
			<label htmlFor='products'></label><br></br>
			<select name='products' onChange={ handleProductTypeChange }>
				<option value='gloves'>gloves</option>
				<option value='facemasks'>facemasks</option>
				<option value='beanies'>beanies</option>
			</select>
			<br></br>
		</div>
	)
}

export default Filter
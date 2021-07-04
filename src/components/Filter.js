import React from 'react'

const Filter = ( { productType, handleProductTypeChange } ) => {
	return (
		<div id='filterProductsContainer'>
			<h2>Shows products by category type</h2>
			<label htmlFor='products'>
				Please select a category.
			</label><br></br>
			<select name='products' onChange={ handleProductTypeChange } value={ productType }>
				<option defaultValue disabled hidden style={ { display: 'none' } } value=''></option>
				<option value='gloves'>gloves</option>
				<option value='facemasks'>facemasks</option>
				<option value='beanies'>beanies</option>
			</select>
		</div>
	)
}

export default Filter
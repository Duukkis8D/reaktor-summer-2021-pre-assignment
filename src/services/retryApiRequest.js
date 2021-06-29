const axiosResponseInterceptor = ( axiosInstance, baseUrl ) => {
	// axios response interceptor. Request is sent again if the array of server response is empty.
	axiosInstance.interceptors.response.use( response => {
		if( response.data.length > 2 ) {
			console.log( 
				'valid server response detected with parameter:', response.config.params
			)

			return response
		}

		if( response.config.params.manufacturer ) {
			if( response.data.length <= 2 ) {
				console.error( 
					'invalid server response detected with product manufacturer parameter:', 
					response.config.params.manufacturer,
					'response.data.length:', response.data.length,
					'requesting data again...' 
				)

				return axiosInstance.get( baseUrl, { params: { manufacturer: response.config.params.manufacturer } } )
			}
		}
	}, error => {
		return Promise.reject( 'error occurred during API request:', error )
	} )
}

export default {
	axiosResponseInterceptor
}
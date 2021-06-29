const axiosResponseInterceptor = ( axiosInstance, baseUrl ) => {
	// axios response interceptor. Request is sent again if the array of server response is empty.
	axiosInstance.interceptors.response.use( response => {
		console.log( 'axios response interceptor:' )
		console.log( 'response in server response:', response )
		console.log( 'response.data.length in server response:', response.data.length )

		if( response.config.params.manufacturer ) {
			if( response.data.length <= 2 ) {
				console.error( 
					'invalid server response detected with parameter:', response.config.params.manufacturer,
					'response.data.length:', response.data.length,
					'requesting data again...' 
				)

				return axiosInstance.get( baseUrl, { params: { manufacturer: response.config.params.manufacturer } } )
			}
		}

		return response
	}, error => {
		return Promise.reject( 'error occurred during API request:', error )
	} )
}

export default {
	axiosResponseInterceptor
}
// import { configs } from '$lib/server/configs/configs'
// import { error } from '@sveltejs/kit'
// import type { ProductsResponseDto } from './productsResponse.dto.type'

// export const fetchProducts = async ({ slug }: { slug?: string }): Promise<ProductsResponseDto> => {
// 	try {
// 		const url = new URL(`${configs.env.vendors.directus.URL}/items/products`)

// 		if (slug) {
// 			url.searchParams.append('filter[slug][_eq]', slug)
// 		}
// 		url.searchParams.append(
// 			'fields',
// 			'*,fk_categories.*,fk_sub_categories.*' // ,product_alternatives.*.*
// 		)

// 		const headers = {
// 			Authorization: `Bearer ${configs.env.vendors.directus.TOKEN}`
// 		}

// 		const response = await fetch(url.toString(), { headers })

// 		if (!response.ok) {
// 			throw new Error('Failed to fetch product data')
// 		}

// 		const productsResponseDto: ProductsResponseDto = await response.json()

// 		return productsResponseDto
// 	} catch (err) {
// 		console.error(err)
// 		if (err instanceof Error) {
// 			throw error(500, {
// 				message: err.message,
// 				code: 'FETCH_FAILED'
// 			})
// 		} else {
// 			throw error(500, {
// 				message: 'An error occurred',
// 				code: 'UNKNOWN_ERROR'
// 			})
// 		}
// 	}
// }

// import { configs } from '$lib/server/configs/configs'
// import { error } from '@sveltejs/kit'
// import type { ProductsResponseDto } from './productsResponse.dto.type'

// const SIMILAR_PRODUCTS_LIMIT = 6

// export const fetchSimilarProducts = async ({
// 	subCategory,
// 	excludeId
// }: {
// 	subCategory: number
// 	excludeId: number
// }): Promise<ProductsResponseDto> => {
// 	try {
// 		const url = new URL(`${configs.env.vendors.directus.URL}/items/products`)

// 		url.searchParams.append('filter[fk_sub_categories][_eq]', `${subCategory}`)
// 		// Must not include self when looking for alternative products in the same category
// 		url.searchParams.append('filter[id][_neq]', `${excludeId}`)
// 		url.searchParams.append('fields', '*')
// 		url.searchParams.append('limit', `${SIMILAR_PRODUCTS_LIMIT}`)

// 		// console.log('decoded', decodeURI(url.toString()))

// 		const headers = {
// 			Authorization: `Bearer ${configs.env.vendors.directus.TOKEN}`
// 		}

// 		const response = await fetch(url.toString(), { headers })

// 		if (!response.ok) {
// 			throw new Error(`❌ Error in ${fetchSimilarProducts.name}`)
// 		}

// 		const productsResponseDto: ProductsResponseDto = await response.json()

// 		return productsResponseDto
// 	} catch (err) {
// 		console.error(err)
// 		if (err instanceof Error) {
// 			error(500, {
// 				message: err.message,
// 				code: 'FETCH_FAILED'
// 			})
// 		} else {
// 			error(500, {
// 				message: 'An error occurred',
// 				code: 'UNKNOWN_ERROR'
// 			})
// 		}
// 	}
// }

// type Category = {
// 	id: number
// 	date_created: string
// 	date_updated: string | null
// 	name: string
// }

// type SubCategory = {
// 	id: number
// 	date_created: string
// 	date_updated: string | null
// 	name: string
// 	how_to_choose: string
// 	fk_categories: number
// }

// type Product = {
// 	id: number
// 	status: string
// 	asin: string
// 	date_created: string
// 	date_updated: string
// 	title: string
// 	hero_image: string
// 	slug: string
// 	pros: string
// 	cons: string
// 	who_should_buy: string
// 	who_should_not_buy: string
// 	fk_categories: Category
// 	fk_sub_categories: SubCategory
// 	product_alternatives: ProductAlternative[]
// }

// type ProductAlternative = {
// 	id: number
// 	products_id: Product
// 	related_products_id: Product
// }

// export type ProductsResponseDto = {
// 	data: Product[]
// }

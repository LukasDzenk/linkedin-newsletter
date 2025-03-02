// /**
//  * This migration removes the redundant part of the string from the expedia uniqueHotelNameIdentifier
//  *
//  * @Example
//  * Sometimes, when parsing hotel search page, Expedia hotel page URL contains extra
//  * unnecessary characters within the range of letters that are used as uid.
//  * These fields were saved to DB.
//  *
//  * For example: https://www.expedia.com/New-York-Hotels-Staypineapple,-An-Artful-Hotel,-Midtown.h29051318.Hotel-Information
//  * While the actual page URL is: https://www.expedia.com/New-York-Hotels-Staypineapple.h29051318.Hotel-Information
//  *
//  * The issue arises when the server will try to find the hotel by the unique identifier,
//  * it will fail, because the unique identifier is different.
//  */
// export const up = async (db) => {
//     const collection = db.collection('hotel_name_mappings')

//     // Find the first document in the collection
//     const cursor = collection.find({})

//     let counter = 0

//     // Check if the next document exists
//     while (await cursor.hasNext()) {
//         // Get the next document (or the initial document if this is the first iteration)
//         const document = await cursor.next()
//         const uniqueHotelNameIdentifier = document.providers.expedia.uniqueHotelNameIdentifier

//         // Check if uniqueHotelNameIdentifier exists and is not null
//         if (uniqueHotelNameIdentifier) {
//             counter++
//             const updatedUniqueHotelNameIdentifier =
//                 removeExtraFieldsInExpediaUrl(uniqueHotelNameIdentifier)

//             if (updatedUniqueHotelNameIdentifier !== uniqueHotelNameIdentifier) {
//                 console.log(
//                     `Changed '${uniqueHotelNameIdentifier}' to '${updatedUniqueHotelNameIdentifier}'`,
//                 )
//                 await collection.updateOne(
//                     { _id: document._id },
//                     {
//                         $set: {
//                             'providers.expedia.uniqueHotelNameIdentifier':
//                                 updatedUniqueHotelNameIdentifier,
//                         },
//                     },
//                 )
//             }
//         }
//     }
//     console.log(`Updated ${counter} documents`)
// }

// /**
//  * Rollback migration is NOT possible for this migration,
//  * because we don't know what the original value of the string was.
//  */
// export const down = async () => {
//     // -
// }

// /**
//  * Removes the extra fields in the expedia uniqueHotelNameIdentifier
//  * by slicing out the part of the string that is between ',-' and '.'
//  */
// const removeExtraFieldsInExpediaUrl = (url) => {
//     const startIdx = url.indexOf(',-')
//     if (startIdx === -1) {
//         return url
//     }

//     const endIdx = url.indexOf('.', startIdx)
//     if (endIdx === -1) {
//         return url
//     }

//     return url.slice(0, startIdx) + url.slice(endIdx)
// }

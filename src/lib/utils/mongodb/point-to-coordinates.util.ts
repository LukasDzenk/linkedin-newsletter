// import { Point } from '../../types/mongoDb.types.js';

// /**
//  * Given a GeoJSON Point object, return a coordinate object.
//  */
// export const pointToCoordinates = ({
//     point,
// }: {
//     point: Point
// }): { latitude: number; longitude: number } => {
//     if (!point) {
//         throw new Error('Point is required')
//     }

//     const latitude = point.coordinates[1]
//     const longitude = point.coordinates[0]

//     if (typeof latitude !== 'number' || typeof longitude !== 'number') {
//         throw new Error('Point coordinates must be numbers')
//     }

//     return {
//         latitude,
//         longitude,
//     }
// }

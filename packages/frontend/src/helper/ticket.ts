/**
 * Thời gian bắt đầu có hiệu lực của vé trong ngày (7:30:00)
 * Được tính bằng giây: 7 giờ * 60 phút * 60 giây + 30 phút * 60 giây = 27000 giây
 * @description Thời gian bắt đầu có hiệu lực của vé trong ngày, tính bằng giây kể từ 00:00:00
 * @type {number}
 * @constant
 */
export const TICKET_VALID_TIME_FROM_SECOND: number = 7 * 60 * 60 + 30 * 60

/**
 * Thời gian kết thúc hiệu lực của vé trong ngày (17:30:00)
 * Được tính bằng giây: 17 giờ * 60 phút * 60 giây + 30 phút * 60 giây = 63000 giây
 * @description Thời gian kết thúc hiệu lực của vé trong ngày, tính bằng giây kể từ 00:00:00
 * @type {number}
 * @constant
 */
export const TICKET_VALID_TIME_TO_SECOND: number = 17 * 60 * 60 + 30 * 60

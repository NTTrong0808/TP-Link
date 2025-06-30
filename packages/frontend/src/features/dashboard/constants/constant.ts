import { OpUnitType } from 'dayjs'

export const DASHBOARD_TYPE_OPTIONS: {
  label: string
  value: OpUnitType
}[] = [
  {
    label: 'Giờ',
    value: 'hour',
  },
  {
    label: 'Ngày',
    value: 'day',
  },
  {
    label: 'Tuần',
    value: 'week',
  },
  {
    label: 'Tháng',
    value: 'month',
  },
  {
    label: 'Năm',
    value: 'year',
  },
]

export const DATE_FORMAT = 'YYYY-MM-DD'

export const CHART_COLORS = [
  // // Bộ 1
  // '#F87171', // Đỏ
  // '#C7AE34', // Vàng
  // '#7AB37D', // Xanh lá
  // '#6BA7FE', // Xanh dương

  // // Bộ 2
  // '#FFBE9F', // Cam
  // '#F8DF8D', // Vàng
  // '#80C7BC', // Xanh lá
  // '#C7A0CE', // Tím

  // // Bộ 3
  // '#FF4D00', // Cam
  // '#E7DE7A', // Vàng
  // '#12B76A', // Xanh lá
  // '#6BA7FE', // Xanh dương

  // // Bộ 4
  // '#EF4444', // Đỏ
  // '#F79009', // Vàng cam
  // '#41695B', // Xanh lá
  // '#A2D9E7', // Xanh dương

  // // Bộ 5
  // '#E73C3E', // Đỏ
  // '#E2D761', // Vàng
  // '#7AB37D', // Xanh lá
  // '#FFBE9F', // Cam (lặp lại)

  // Bộ 1
  '#F2827F',
  '#FF4D00',
  '#FFBE9F',
  '#E9D94F',

  // Bộ 2
  '#12B76A',
  '#A2D9E7',
  '#6BA7FE',
  '#F87171',

  // Bộ 3
  '#E73C3E',
  '#C7AE34',
  '#7AB37D',
  '#C7A0CE',

  // Bộ 4
  '#EF4444',
  '#F79009',
  '#80C7BC',
  '#6BA7FE',

  // Bộ 5
  '#CC3405',
  '#F8DF8D',
  '#41695B',
  '#A2D9E7',

  // '#6BA7FE', // Info
  // '#A2D9E7', // Lake
  // '#80C7BC', // Forest
  // // '#41695B', // Artichoke
  // '#12B76A', // Success
  // // '#7AB37D', // Green
  // '#E2D761', // Yellow 400
  // '#C7AE34', // Yellow 600
  // '#F8DF8D', // Banana
  // '#F79009', // Warning
  // '#FFBE9F', // Mango
  // '#FF4D00', // Orange 400
  // '#CC3405', // Orange 500
  // '#A9766A', // Brown
  // '#F2827F', // Persimmon
  // '#F87171', // Error 300
  // '#EF4444', // Error 400
  // '#D42426', // Strawberry 400
  // '#E73C3E', // Strawberry 300
  // '#C7A0CE', // Sweetpotato
]

export const PIE_CHART_RADIUS = 85

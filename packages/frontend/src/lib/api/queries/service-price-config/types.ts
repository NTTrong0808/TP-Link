export interface IServicePriceConfigByMonthYear {
  id: string;
  date: string;
  title: string;
  isDefault: boolean;
  servicePriceListId: string;
  isRepeat?: boolean;
}

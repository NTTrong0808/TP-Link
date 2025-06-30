'use client';

import { PanelView } from '@/layouts/panel/panel-view';
import ServiceSection from '../components/service-section';
import ServicePriceListSection from '../components/service-price-list-section';

export interface UserListProps {}

const ServiceManagement = (props: UserListProps) => {
  return (
    <PanelView className='w-full flex gap-4 flex-row justify-center overflow-hidden max-h-[calc(100vh-73px)]'>
      <ServiceSection />
      <ServicePriceListSection />
    </PanelView>
  );
};

export default ServiceManagement;

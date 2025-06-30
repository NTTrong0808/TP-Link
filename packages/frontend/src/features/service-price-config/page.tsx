'use client';

import PriceConfigCalendar from './_components/price-config-calendar';
import { PriceConfigProvider } from './_components/price-config-context';
import PriceConfigHeader from './_components/price-config-header';

const PriceConfigPage = () => {
  return (
    <PriceConfigProvider>
      <PriceConfigHeader />
      <PriceConfigCalendar />
    </PriceConfigProvider>
  );
};

export default PriceConfigPage;

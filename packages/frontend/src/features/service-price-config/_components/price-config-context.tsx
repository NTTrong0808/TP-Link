'use client';

import { useServicePriceConfigByMonthYear } from '@/lib/api/queries/service-price-config/get-service-price-config-by-month-year';
import { IServicePriceConfigByMonthYear } from '@/lib/api/queries/service-price-config/types';
import { appDayJs } from '@/utils/dayjs';
import { Dayjs } from 'dayjs';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface PriceConfigContextType {
  currentDate: Dayjs;
  setCurrentDate: (date: Dayjs) => void;
  nextMonth: () => void;
  previousMonth: () => void;
  priceConfigs: IServicePriceConfigByMonthYear[];
  selectedPriceConfigs: IServicePriceConfigByMonthYear[];
  setSelectedPriceConfigs: Dispatch<
    SetStateAction<IServicePriceConfigByMonthYear[]>
  >;
  isLoadingServicePriceConfig: boolean;
}

export const PriceConfigContext = createContext<PriceConfigContextType>({
  currentDate: appDayJs(),
  setCurrentDate: () => {},
  nextMonth: () => {},
  previousMonth: () => {},
  priceConfigs: [],
  selectedPriceConfigs: [],
  setSelectedPriceConfigs: () => {},
  isLoadingServicePriceConfig: false,
});

export const usePriceConfigContext = () => {
  const ctx = useContext(PriceConfigContext);

  if (!ctx)
    throw new Error(
      'usePriceConfigContext must be used within a PriceConfigContext'
    );

  return ctx;
};

export const PriceConfigProvider = ({ children }: PropsWithChildren) => {
  const [currentDate, setCurrentDate] = useState(appDayJs());

  const [priceConfigs, setPriceConfigs] = useState<
    IServicePriceConfigByMonthYear[]
  >([]);
  const [selectedPriceConfigs, setSelectedPriceConfigs] = useState<
    IServicePriceConfigByMonthYear[]
  >([]);

  const { data, isLoading: isLoadingServicePriceConfig } =
    useServicePriceConfigByMonthYear({
      variables: {
        month: currentDate.month() + 1,
        year: currentDate.year(),
      },
      enabled: !!currentDate,
    });

  const nextMonth = () => {
    setCurrentDate(appDayJs(currentDate).add(1, 'month'));
  };

  const previousMonth = () => {
    setCurrentDate(appDayJs(currentDate).subtract(1, 'month'));
  };

  const values = useMemo<PriceConfigContextType>(
    () => ({
      currentDate,
      setCurrentDate,
      nextMonth,
      previousMonth,
      priceConfigs,
      selectedPriceConfigs,
      setSelectedPriceConfigs,
      isLoadingServicePriceConfig,
    }),
    [currentDate, priceConfigs, selectedPriceConfigs]
  );

  useEffect(() => {
    if (data && data.length) {
      setPriceConfigs((prevPriceConfigs) => {
        const priceConfigMap = new Map(prevPriceConfigs.map((t) => [t.id, t]));

        data.forEach((config) => {
          priceConfigMap.set(config.id, config);
        });

        return Array.from(priceConfigMap.values()).sort(
          (prev, curr) =>
            new Date(prev?.date).getTime() - new Date(curr?.date).getTime()
        );
      });
    }
  }, [data, currentDate]);

  return (
    <PriceConfigContext.Provider value={values}>
      <div className='p-6 bg-[#F5F5F5]'>{children}</div>
    </PriceConfigContext.Provider>
  );
};

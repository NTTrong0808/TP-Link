import { consumerApi } from '@/lib/api';
import { ApiResponse } from '@/lib/api/schema';
import { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';
import { Booking } from './schema';

export interface Variables {
  bookingId: string;
}

export interface Response
  extends ApiResponse<{
    status: number;
    message: string;
  }> {}

export interface Error extends AxiosError<Response> {}

export const verifyBookingOffline = async (
  variables: Variables
): Promise<Response> => {
  const response = await consumerApi.get<Response>(
    `/bookings/offline/${variables.bookingId}/verify`
  );

  return response.data;
};

export const verifyBookingOfflineKey = verifyBookingOffline.name;

export const useVerifyBookingOffline = createQuery<Response, Variables, any>({
  queryKey: [verifyBookingOfflineKey],
  fetcher: verifyBookingOffline,
});

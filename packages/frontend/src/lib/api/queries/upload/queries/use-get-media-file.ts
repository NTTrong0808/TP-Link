import { createMutation } from 'react-query-kit';
import { uploadService } from '..';

export interface Variables {
  mediaId: string;
}

export interface Response
  extends Awaited<ReturnType<typeof uploadService.getUploadFile>> {}

export const useGetMediaFile = createMutation<Response, Variables, any>({
  mutationFn: (variables) => uploadService.getUploadFile(variables.mediaId),
});

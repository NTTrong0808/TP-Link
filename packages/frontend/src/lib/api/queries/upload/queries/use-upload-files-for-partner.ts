import { createMutation } from 'react-query-kit';
import { uploadService } from '..';

export interface Variables {
  files: File[];
  deletedIds?: string[];
}

export interface Response
  extends Awaited<ReturnType<typeof uploadService.uploadFilesForPartner>> {}

export const useUploadFiles = createMutation<Response, Variables, any>({
  mutationFn: (variables) =>
    uploadService.uploadFilesForPartner(variables.files, variables.deletedIds),
});

import { Module } from '@nestjs/common';
import { UndiciHttpService } from './undici-http.service';

@Module({
  providers: [UndiciHttpService],
  exports: [UndiciHttpService],
})
export class UndiciModule {}
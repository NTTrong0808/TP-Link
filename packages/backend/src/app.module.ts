import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthCognitoModule } from './lib/auth-cognito/auth-cognito.module'
import { AuthModule } from './modules/auth/auth.module'
import { CustomerModule } from './modules/customer/customer.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { MeInvoiceModule } from './modules/meinvoice/meinvoice.module'
import { OrdersModule } from './modules/order/order.module'
import { ProductVariantModule } from './modules/product-variant/product-variant.module'
import { RoleModule } from './modules/role/role.module'
import { SystemConfigModule } from './modules/system-config/system-config.module'
import { UserModule } from './modules/user/user.module'
import { DatabaseModule } from './lib/database.module'
@Module({
  imports: [
    DatabaseModule,
    AuthCognitoModule,
    RoleModule,
    UserModule,
    AuthModule,
    RoleModule,
    MeInvoiceModule,
    CustomerModule,
    DashboardModule,
    SystemConfigModule,
    OrdersModule,
    ProductVariantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

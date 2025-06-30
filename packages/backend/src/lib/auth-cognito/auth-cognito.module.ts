import { CognitoAuthModule } from '@nestjs-cognito/auth'
import { Global, Module } from '@nestjs/common'
import { config } from 'dotenv'
import { AuthCognitoService } from './auth-cognito.service'

config()

@Global()
@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: process.env.COGNITO_USER_POOL_ID!,
        clientId: process.env.COGNITO_USER_CLIENT_ID!,
        tokenUse: 'access',
      },
    }),
  ],
  providers: [AuthCognitoService],
  exports: [AuthCognitoService],
})
export class AuthCognitoModule {}

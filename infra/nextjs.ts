export const nextjs = new sst.aws.Nextjs('Nextjs', {
  path: 'packages/frontend',
  ...(['production', 'staging'].includes($app.stage)
    ? {
        domain: {
          name: `${
            $app.stage === 'staging' ? 'staging-ticket.' : 'ticket.'
          }langfarmcenter.com`,
          redirects: [
            `www.${$app.stage === 'staging' ? 'staging-ticket.' : 'ticket.'}langfarmcenter.com`,
          ],
        },
      }
    : {}),
  environment: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
    NEXT_PUBLIC_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
    NEXT_PUBLIC_USER_CLIENT_ID: process.env.COGNITO_USER_CLIENT_ID || '',
    NEXT_PUBLIC_REGION: process.env.NEXT_PUBLIC_REGION || '',
    NEXT_PUBLIC_TICKET_URL: process.env.NEXT_PUBLIC_TICKET_URL || '',
    NEXT_PUBLIC_LFC_URL: process.env.NEXT_PUBLIC_LFC_URL || '',
  },
  permissions: [
    {
      actions: [
        'cognito-idp:AdminConfirmSignUp',
        'cognito-idp:AdminDeleteUser',
        'cognito-idp:AdminDisableUser',
        'cognito-idp:AdminEnableUser',
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminInitiateAuth',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminUpdateUserAttributes',
        'cognito-idp:ConfirmSignUp',
        'cognito-idp:SignUp',
      ],
      resources: ['*'],
    },
  ],
});

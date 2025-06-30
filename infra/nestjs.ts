/// <reference path="../.sst/platform/config.d.ts" />

import { queues } from './queue';
const vpc = new sst.aws.Vpc('BackendVpc', {
  nat: {
    type: 'ec2',
    ec2: {
      instance: 't4g.small',
    },
  },
});
const cluster = new sst.aws.Cluster('BackendCluster', {
  vpc: {
    // Use the VPC you've created
    id: vpc.id,
    // Use the private subnets for container placement
    containerSubnets: vpc.privateSubnets,
    // Use the public subnets for the load balancer
    loadBalancerSubnets: vpc.publicSubnets,
    // Keep the security groups from the VPC
    securityGroups: vpc.securityGroups,
    cloudmapNamespaceId: vpc.nodes.cloudmapNamespace.id,
    cloudmapNamespaceName: vpc.nodes.cloudmapNamespace.name,
  },
});

export const nestjs = new sst.aws.Service('BackendService', {
  cluster,
  loadBalancer: {
    domain: 'ticket-api.langfarmcenter.com',
    rules: [
      { listen: '80/tcp', forward: '8000/tcp' },
      { listen: '443/tls', forward: '8000/tcp' },
    ],
  },
  dev: {
    command: 'pnpm run start:dev',
    directory: 'packages/backend',
  },
  link: [...queues],
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
        'kms:Sign',
      ],
      resources: ['*'],
    },
  ],
  scaling: {
    min: 1,
    max: 2,
    cpuUtilization: 75,
    memoryUtilization: 75,
  },
  memory: '2 GB',
  environment: {
    APP_PORT: process.env.APP_PORT || '',
    APP_PREFIX: process.env.APP_PREFIX || '',
    APP_CORS: process.env.APP_CORS || '',
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
    COGNITO_USER_CLIENT_ID: process.env.COGNITO_USER_CLIENT_ID || '',
    DB_MONGO_URI: process.env.DB_MONGO_URI || '',
    BE_URL: process.env.BE_URL || '',
    SPARK_POST_KEY: process.env.SPARK_POST_KEY || '',
    SECRET_KEY: process.env.SECRET_KEY || '',
    FE_URL: process.env.FE_URL || '',
    FROM_EMAIL: process.env.FROM_EMAIL || '',
    FROM_EMAIL_NAME: process.env.FROM_EMAIL_NAME || '',
    COGNITO_REGION: process.env.COGNITO_REGION || '',
    LFC_VPC_URL: process.env.LFC_VPC_URL || '',
  },
});

/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'langfarm-ticket',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        aws: {
          region: 'ap-southeast-1',
        },
      },
    };
  },
  async run() {
    const storage = await import('./infra/storage');

    await import('./infra/nextjs');
    const infraNest = await import('./infra/nestjs');

    return {
      TicketBucket: storage.lfTicketBucket.name,
    };
  },

  defaultFunctionProps: {
    bundle: {
      assets: [
        'packages/functions/shared/templates/**', // ✅ This ensures HTML templates are bundled
        'packages/functions/shared/templates/assets/images/**', // ✅ If you use inline images
      ],
    },
  },
});

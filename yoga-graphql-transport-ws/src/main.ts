import { ExecutionArgs, execute, subscribe } from 'graphql';
import { createServer } from '@graphql-yoga/node';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './schema';

async function main() {
  const yogaApp = createServer({
    schema,
    graphiql: {
      subscriptionsProtocol: 'WS', // use WebSockets instead of SSE
    },
    port: 4001,
  });

  const httpServer = await yogaApp.start();
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: yogaApp.getAddressInfo().endpoint,
  });

  // yoga's envelop may augment the `execute` and `subscribe` operations
  // so we need to make sure we always use the freshest instance
  type EnvelopedExecutionArgs = ExecutionArgs & {
    rootValue: {
      execute: typeof execute;
      subscribe: typeof subscribe;
    };
  };

  useServer(
    {
      execute: (args) =>
        (args as EnvelopedExecutionArgs).rootValue.execute(args),
      subscribe: (args) =>
        (args as EnvelopedExecutionArgs).rootValue.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yogaApp.getEnveloped(ctx);

        const args: EnvelopedExecutionArgs = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wsServer,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

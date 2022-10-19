# How to use (graphql-transport-ws)

## Headers

| Header Name | Header Value |
| ----------- | ------------ |
| `Sec-WebSocket-Protocol` | `graphql-transport-ws` |

## Messages

### Init connection

```
{ "type": "connection_init" }
```

### Ping (test connection)

```
{ "type": "ping" }
```

### Start subscription

```
{ "id": "1", "type": "subscribe", "payload": { "query": "subscription Sub { countdown(from: 10) }" } }
```

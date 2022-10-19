# How to use (SSE)

## Spin up
```
npm run dev
```

## Headers

| Header Name | Header Value |
| ----------- | ------------ |
| `Accept` | `text/event-stream` |

## Test if it's working
```
curl -N -H "accept:text/event-stream" 'http://localhost:4000/graphql?query=subscription%20%7B%0A%20%20countdown%28from%3A%2010%29%0A%7D'
````

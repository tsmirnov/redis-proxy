# redis-proxy

## High-level architecture overview

![alt text](architecture-overview.png?raw=true "Architecture overview")

After running `make start` docker-compose will build and start 3 containers:
- test - it will start end-to-end tests. It will write test data directly to backing redis and get data from proxy
- proxy - proxy with LRU cache. Data can be fetched via HTTP or RESP 
- redis - backing redis container

## What the code does

The most common implementation of LRU cache is to use doubly linked list and hash map. 

However, JavaScript has a specific implementation of Map. According to [specification](#https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):
> The Map object holds key-value pairs and remembers the original insertion order of the keys.

This allows to use just a standard Map and make the code of `./proxy/src/cache.js` very simple and clean

## Algorithmic complexity of the cache operations. 
 O(1)

## Instructions for how to run the proxy and tests

Run tests:
```
make test
```

Run only proxy:
```
make start
```

Configuration can be changed via environmental variables:

- `REDIS_URL` - Address of the backing Redis
- `CACHE_TTL` - Cache expiry time
- `CAPACITY` - Capacity (number of keys)
- `PORT` - TCP/IP port number the proxy listens on

When you run `make start` default values are taken from `.env` file and are passed as environmental variables to a container.

By default tests will be run for HTTP server. In order to run them for RESP, you need to set `PROXY_PROTOCOL=RESP` in `.env`

## How long you spent on each part of the project

- devops - 2h
- development - 4h
- resp protocol - 3h
- documentation - 1h

## A list of the requirements that were not implemented and the reasons for omitting them

To be fair, the concurrent processing is not really parallel, it's asynchronous. However, the requirement stated:
>When multiple clients make concurrent requests to the proxy, it would execute a number of these requests (up to some configurable limit) in parallel (i.e. in a way so that one request does not have to wait for another one to complete before it starts processing)

The app meets this requirement. To be trully parallel, we need to use cluster module to fork processes.

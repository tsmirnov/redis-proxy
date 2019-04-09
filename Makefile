include .env
export

test:
	docker-compose up --abort-on-container-exit --build

start:
	docker build ./proxy -t proxy
	docker run \
		-p $(PORT):80 \
		--env-file .env \
		proxy

.PHONY: test start

version = 0.0.1
GoVersion = $(shell go version)
BuildTime = $(shell date +"%Y-%m-%d %H:%m:%S")
path = govue/version
ldflags = -ldflags " -X main.AutoOpen=false -X $(path).Version=$(version) -X '$(path).GoVersion=$(GoVersion)' -X '$(path).BuildTime=$(BuildTime)' -s -w"

export CGO_ENABLED=1
WDIR=${shell pwd}



all: web linux

docker:
	# docker run -u root --rm -it --security-opt seccomp=unconfined -v ${WDIR}:/code golang:1.16.5-alpine3.14 sh -c 'echo -e "http://mirrors.aliyun.com/alpine/latest-stable/main\nhttp://mirrors.aliyun.com/alpine/latest-stable/community" > /etc/apk/repositories && apk --no-cache add make build-base libc6-compat	libgcc	libstdc++	 && wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && wget http://192.168.13.105:8000/soft/linux/glibc-2.33-r0.apk && apk add glibc-2.33-r0.apk && cd /code && GOPROXY=https://goproxy.cn,direct make linux'
	docker build -t fdxxw/govue:${version} -f Dockerfile build/

web:
	@rm -rf ./back/resources/web
	cd web && yarn install
	cd web && yarn build
	mv ./web/dist ./back/resources/web
linux:
	@rm -rf ./build/linux
	@mkdir -p ./build/linux
	cd back && go mod tidy
	cd back && GOARCH=amd64 GOOS=linux go build $(ldflags) -o ../build/linux/govue main.go
	cp -r ${HIKVISION_LIB}/linux/* build/linux
	cp govue.service build/linux
	cp govue-template.yaml build/linux
	cp govue.yaml build/linux
nocgo:
	@rm -rf ./build/linux
	@mkdir -p ./build/linux
	cd back && go mod tidy
	cd back && CGO_ENABLED=0 GOOS=linux GOARCH=amd64  go build $(ldflags) -o ../build/linux/govue-nocgo-${version} main.go
arm7l:
	@rm -rf ./build/linux
	@mkdir -p ./build/linux
	cd back && go mod tidy
	cd back && CGO_ENABLED=0 GOOS=linux GOARCH=arm  GOARM=7  go build $(ldflags) -o ../build/linux/govue-arm7l-${version} main.go

version:
	@echo ${version}
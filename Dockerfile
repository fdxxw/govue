FROM ubuntu:18.04


RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    rm -rf /root/.cache

COPY linux  /app

RUN  chmod +x /app/*

ENV LD_LIBRARY_PATH=/app
WORKDIR /app
CMD ["/app/AcuIoT", "-config", "/app/acuiot.yaml"]

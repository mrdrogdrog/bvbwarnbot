FROM ubuntu:latest
LABEL MAINTAINER="Tilman Vatteroth<ich@tilmanvatteroth.de>"

RUN apt update && apt full-upgrade -y

RUN mkdir -p /opt/bvbwarnbot

COPY ./bvbspielwarnung /opt/bvbwarnbot/bot
RUN chmod +x /opt/bvbwarnbot/bot

WORKDIR /opt/bvbwarnbot
ENTRYPOINT ["/opt/bvbwarnbot/bot"]
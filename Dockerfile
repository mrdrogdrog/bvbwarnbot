FROM ubuntu:latest
LABEL MAINTAINER="Tilman Vatteroth<ich@tilmanvatteroth.de>"

RUN apt update -qq && apt full-upgrade -y -qq && apt install ca-certificates -y -qq

RUN mkdir -p /opt/bvbwarnbot

COPY ./bvbwarnbot /opt/bvbwarnbot/bot
RUN chmod +x /opt/bvbwarnbot/bot

WORKDIR /opt/bvbwarnbot
ENTRYPOINT ["/opt/bvbwarnbot/bot"]

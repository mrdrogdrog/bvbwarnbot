FROM ubuntu:latest
LABEL MAINTAINER="Tilman Vatteroth<ich@tilmanvatteroth.de>"

RUN apt update -qq && apt full-upgrade -y -qq && apt install ca-certificates -y -qq

RUN mkdir -p /opt/bvbwarnbot

COPY ./bvbwarnbot-telegram /opt/bvbwarnbot/telegram
RUN chmod +x /opt/bvbwarnbot/telegram

WORKDIR /opt/bvbwarnbot
ENTRYPOINT ["/opt/bvbwarnbot/telegram"]

FROM ubuntu:latest
LABEL MAINTAINER="Tilman Vatteroth<ich@tilmanvatteroth.de>"

RUN apt update && apt full-upgrade -y

RUN mkdir -p /opt/bvbspielwarnung

COPY ./bvbspielwarnung /opt/bvbspielwarnung/bot
RUN chmod +x /opt/bvbspielwarnung/bot

WORKDIR /opt/bvbspielwarnung
ENTRYPOINT ["/opt/bvbspielwarnung/bot"]
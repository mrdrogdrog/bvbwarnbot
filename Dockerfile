from golang:latest as builder

COPY . ./bvbwarnbot
WORKDIR bvbwarnbot
RUN go mod download
RUN GOOS=linux GARCH=amd64 CGO_ENABLED=0 go build -o bvbwarnbot-telegram cmd/bvbwarnbot-telegram/main.go

FROM alpine:latest
LABEL MAINTAINER="Tilman Vatteroth<ich@tilmanvatteroth.de>"

RUN apk update --no-cache && apk add --no-cache ca-certificates

RUN mkdir -p /opt/bvbwarnbot

COPY --from=builder /go/bvbwarnbot/bvbwarnbot-telegram /opt/bvbwarnbot/telegram
RUN chmod +x /opt/bvbwarnbot/telegram

WORKDIR /opt/bvbwarnbot
CMD ["/opt/bvbwarnbot/telegram"]

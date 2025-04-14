FROM golang:1.23.5-alpine

RUN apk update && apk add --no-cache git bash curl build-base

RUN go install github.com/cespare/reflex@latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["reflex", "-r", "\\.go$", "--", "go", "run", "cmd/main.go"]

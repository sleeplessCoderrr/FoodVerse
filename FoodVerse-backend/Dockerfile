FROM golang:1.24.2

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Install swag and air
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN go install github.com/air-verse/air@latest

# Copy source code
COPY . .

# Force regenerate docs to fix module issues
RUN rm -rf docs/ && swag init -g cmd/api/main.go -o docs/ --parseDependency --parseInternal

# Tidy up modules
RUN go mod tidy

# Expose port
EXPOSE 7000

# Command to run
CMD ["air"]
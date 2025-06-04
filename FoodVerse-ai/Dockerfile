FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY services/face-recognition-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/face-recognition-service/ .
COPY ["services/face-recognition-service/models/human_classifier.pkl", "./models/"]

EXPOSE 50005

CMD ["python", "app.py"]
FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY app ./app

RUN ls -R /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]



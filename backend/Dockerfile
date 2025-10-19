FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# system deps required for psycopg2 and PostGIS client libs
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev netcat-openbsd curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# copy requirements first for better caching
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy project
COPY . /app

RUN chmod +x /app/entrypoint.sh || true

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]

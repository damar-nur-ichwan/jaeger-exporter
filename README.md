This project was developed by Damar Nur Ichwan

# Jaeger Exporter
This is an application that you can use to summarize the *OpenTelemetry Tracing* data stored by Jaeger, then export it to Prometheus metric form.
Then, you can use these metrics as input data for Connectivity Dashboard or Dependecy Dashboard

## Initialization
Initialization here is the application activity to find the last summary data that has been saved. This serves as the basic data for subsequent calculations.
### Style
This application provides 3 initialization styles that can be adjusted to your needs. They are:
- ```elasticsearch```: initialize with elasticsearch datasource. This style works by calculating all Jaeger data stored in Elasticsearch.
- ```prometheus```: initialize with Prometheus datasource. This style only retrieves the last summary data stored in Prometheus.
- ```none```: without any initialization. With this style, all data will start from the value 0.

## Environment
Make sure you have the following environments set up:
``` env
#NODE_ENV (required): you can choose 'development' or 'production'. by default is 'development
NODE_ENV

#Tracing (required)
INSTANCE_NAME = jaeger-exporter
EXPORTER = jaeger
EXPORTER_URL = http://<your jaeger collector host>:14268

# ELASTICSEARCH_HOST (required): defines the elasticsearch endpoint host used to store your Jaeger data here.
ELASICSEARCH_HOST

# SCRAPE_INTERVAL: Tracing data capture time range in Elasticsearch. Write in milliseconds. By default, it is set to 15000 (15 seconds)
SCRAPE_INTERVAL

# INIT_STYLE: select 'elasticsearch', 'prometheus', or 'none'. By default, it is set to 'none'.
INIT_STYLE
```
*IMPORTANT*: 
If you use the initialization style ```prometheus```, you must add the following environment:
``` env
# PROMETHEUS_HOST: defines the prometheus host endpoint used to store your summary data here.
PROMETHEUS_HOST

# INSTANCE_TARGET: name of the sample summary data stored in prometheus, where the value of this data will be the initialization of the base data.
INSTANCE_TARGET
```

## Installation Example
In order for you to better understand how to install Jaeger Exporter, consider the following installation example in the form of Docker Compose.
```yml
version: "3"

services:
  prometheus:
    image: prom/prometheus
    ports:
      - 9090:9090
    networks:
      - monitoring
    restart: on-failure

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.9.3
    ports:
      - "127.0.0.1:9200:9200"
      - "127.0.0.1:9300:9300"
    restart: on-failure
    environment:
      - cluster.name=jaeger-cluster
      - discovery.type=single-node
      - http.host=0.0.0.0
      - http.cors.enabled=true
      - http.cors.allow-origin="*"
      - transport.host=127.0.0.1
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - xpack.security.enabled=false
    volumes:
      - esdata:/usr/share/elasticsearch/data
    networks:
      - monitoring

  jaeger-collector:
    image: jaegertracing/jaeger-collector
    ports:
      - "14269:14269"
      - "14268:14268"
      - "14267:14267"
      - "14250:14250"
      - "9411:9411"
    restart: on-failure
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
    command: [
      "--es.server-urls=http://elasticsearch:9200",
      "--es.num-shards=1",
      "--es.num-replicas=0",
      "--log-level=error"
    ]
    depends_on:
      - elasticsearch
    networks:
      - monitoring

  jaeger-agent:
    image: jaegertracing/jaeger-agent
    hostname: jaeger-agent
    command: ["--reporter.grpc.host-port=jaeger-collector:14250"]
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
    restart: on-failure
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
    depends_on:
      - jaeger-collector
    networks:
      - monitoring

  jaeger-query:
    image: jaegertracing/jaeger-query
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
      - no_proxy=localhost
    ports:
      - "16686:16686"
      - "16687:16687"
    restart: on-failure
    command: [
      "--es.server-urls=http://elasticsearch:9200",
      "--span-storage.type=elasticsearch",
      "--log-level=debug"
    ]
    depends_on:
      - elasticsearch
      - jaeger-agent
    networks:
      - monitoring

  jaeger-exporter:
    image: damarnurichwan/jaeger-exporter
    environment: 
    - NODE_ENV=production
    - INSTANCE_NAME=jaeger-exporter
    - EXPORTER=jaeger
    - EXPORTER_URL=http://jaeger-collector:14268
    - ELASTICSEARCH_HOST=http://elasticsearch:9200
    - INIT_STYLE=elasticsearch
    ports:
      - "9464:9464"
    restart: on-failure
    depends_on:
      - elasticsearch
    networks:
      - monitoring
      
volumes:
  esdata:
    driver: local
    
networks:
  monitoring:
```

### Initialize Style with Prometheus
```yml
version: "3"

services:
  prometheus:
    image: prom/prometheus
    ports:
      - 9090:9090
    networks:
      - monitoring
    restart: on-failure

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.9.3
    ports:
      - "127.0.0.1:9200:9200"
      - "127.0.0.1:9300:9300"
    restart: on-failure
    environment:
      - cluster.name=jaeger-cluster
      - discovery.type=single-node
      - http.host=0.0.0.0
      - http.cors.enabled=true
      - http.cors.allow-origin="*"
      - transport.host=127.0.0.1
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - xpack.security.enabled=false
    volumes:
      - esdata:/usr/share/elasticsearch/data
    networks:
      - monitoring

  jaeger-collector:
    image: jaegertracing/jaeger-collector
    ports:
      - "14269:14269"
      - "14268:14268"
      - "14267:14267"
      - "14250:14250"
      - "9411:9411"
    restart: on-failure
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
    command: [
      "--es.server-urls=http://elasticsearch:9200",
      "--es.num-shards=1",
      "--es.num-replicas=0",
      "--log-level=error"
    ]
    depends_on:
      - elasticsearch
    networks:
      - monitoring

  jaeger-agent:
    image: jaegertracing/jaeger-agent
    hostname: jaeger-agent
    command: ["--reporter.grpc.host-port=jaeger-collector:14250"]
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
    restart: on-failure
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
    depends_on:
      - jaeger-collector
    networks:
      - monitoring

  jaeger-query:
    image: jaegertracing/jaeger-query
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
      - no_proxy=localhost
    ports:
      - "16686:16686"
      - "16687:16687"
    restart: on-failure
    command: [
      "--es.server-urls=http://elasticsearch:9200",
      "--span-storage.type=elasticsearch",
      "--log-level=debug"
    ]
    depends_on:
      - elasticsearch
      - jaeger-agent
    networks:
      - monitoring

  jaeger-exporter:
    image: damarnurichwan/jaeger-exporter
    environment: 
    - NODE_ENV=production
    - INSTANCE_NAME=jaeger-exporter
    - EXPORTER=jaeger
    - EXPORTER_URL=http://jaeger-collector:14268
    - ELASTICSEARCH_HOST=http://elasticsearch:9200
    - INIT_STYLE=prometheus
    - PROMETHEUS_HOST=http://prometheus:9090
    - INSTANCE_TARGET=jaeger-exporter:9464
    ports:
      - "9464:9464"
    restart: on-failure
    depends_on:
      - prometheus
      - elasticsearch
    networks:
      - monitoring
      
volumes:
  esdata:
    driver: local
    
networks:
  monitoring:
```
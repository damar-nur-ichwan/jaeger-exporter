* developed by Damar Nur Ichwan

# Instalation

* note: make sure that your DOCKER, JAEGER, ELASTICSEARCH, and PROMETHEUS are running!

run jaeger-exporter with this command:
```cmd
docker run -p 9464:9464 --name <container name> -e ELASTICSEARCH_HOST=<elasticsearch host> -e SCRAPE_INTERVAL=<time interval to scrape elastricsearch> damarnurichwan/jaeger-exporter:latest
```

command example:
```cmd
docker run -p 9464:9464 --name jaeger-exporter -e ELASTICSEARCH_HOST=elasticssearch:9200 -e SCRAPE_INTERVAL=15000 damarnurichwan/jaeger-exporter:latest -d
```
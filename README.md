# DigitalHub Platform

## Generate self signed certicates with custom CA

### Create ROOT CA

```shell
openssl genrsa -out rootCA.key 4096
```

```shell
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.crt
```

### Create wildcard certicate for NGINX

```shell
openssl genrsa -out star.platform.local.key 2048
```

```shell
openssl req -new -sha256 \
    -key star.platform.local.key \
    -subj "/C=IT/ST=TN/O=FBK/CN=*.platform.local" \
    -reqexts SAN \
    -config <(cat /etc/ssl/openssl.cnf \
        <(printf "\n[SAN]\nsubjectAltName=DNS:*.platform.local,DNS:www.platform.local")) \
    -out star.platform.local.csr
```

```shell
openssl x509 -req -in star.platform.local.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out star.platform.local.crt -days 500 -sha256
```

### Create certicate and keystore for API-Manager

```shell
openssl genrsa -out api-gw.platform.local.key 2048
```

```shell
openssl req -new -sha256 \
    -key api-gw.platform.local.key \
    -subj "/C=IT/ST=TN/O=FBK/CN=api.platform.local" \
    -reqexts SAN \
    -config <(cat /etc/ssl/openssl.cnf \
        <(printf "\n[SAN]\nsubjectAltName=DNS:api.platform.local,DNS:gw.platform.local")) \
    -out api-gw.platform.local.csr
```

```shell
openssl x509 -req -in api-gw.platform.local.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out api-gw.platform.local.crt -days 500 -sha256
```

```shell
openssl pkcs12 -export -in api-gw.platform.local.crt.crt -inkey api-gw.platform.local.key.key -name "apigwself" -certfile rootCA.crt -out apigwself.pfx
```

```shell
keytool -importkeystore -srckeystore apigwself.pfx -srcstoretype pkcs12 -destkeystore apigwself.jks -deststoretype JKS
```

Get a copy of the client-truststore.jks file from the <PRODUCT_HOME>/repository/resources/security/ directory.

```shell
keytool -export -alias apigwself -keystore apigwself.jks -file apigwself.pem
```

```shell
keytool -import -alias apigwself -file apigwself.pem -keystore client-truststore.jks -storepass wso2carbon
```

```shell
keytool -import -trustcacerts -keystore client-truststore.jks -alias rootCA.platform.local -file rootCA.crt
```

```shell
keytool -storepasswd -keystore client-truststore.jks
```

### Create certicate and keystore for API-Manager Analytics

```shell
openssl genrsa -out am-analytics.key 2048
```

```shell
openssl req -new -sha256 \
    -key am-analytics.key \
    -subj "/C=IT/ST=TN/O=FBK/CN=am-analytics" \
    -reqexts SAN \
    -config <(cat /etc/ssl/openssl.cnf \
        <(printf "\n[SAN]\nsubjectAltName=DNS:am-analytics")) \
    -out am-analytics.csr
```

```shell
openssl x509 -req -in am-analytics.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out am-analytics.crt -days 500 -sha256
```

```shell
openssl pkcs12 -export -in am-analytics.crt -inkey am-analytics.key -name "am-analytics" -certfile rootCA.crt -out am-analytics.pfx
```

```shell
keytool -importkeystore -srckeystore am-analytics.pfx -srcstoretype pkcs12 -destkeystore am-analytics.jks -deststoretype JKS
```

Get a copy of the client-truststore.jks file from the <PRODUCT_HOME>/repository/resources/security/ directory.

```shell
keytool -export -alias am-analytics -keystore am-analytics.jks -file am-analytics.pem
```

```shell
keytool -import -alias am-analytics -file am-analytics.pem -keystore client-truststore.jks -storepass wso2carbon
```

```shell
keytool -import -trustcacerts -keystore client-truststore.jks -alias rootCA.platform.local -file rootCA.crt
```

```shell
keytool -storepasswd -keystore client-truststore.jks
```

### Create certicate and keystore for DSS

```shell
openssl genrsa -out dss.key 2048
```

```shell
openssl req -new -sha256 \
    -key dss.key \
    -subj "/C=IT/ST=TN/O=FBK/CN=dss.platform.local" \
    -reqexts SAN \
    -config <(cat /etc/ssl/openssl.cnf \
        <(printf "\n[SAN]\nsubjectAltName=DNS:dss.platform.local")) \
    -out dss.csr
```

```shell
openssl x509 -req -in dss.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out dss.crt -days 500 -sha256
```

```shell
openssl pkcs12 -export -in dss.crt -inkey dss.key -name "dss" -certfile rootCA.crt -out dss.pfx
```

```shell
keytool -importkeystore -srckeystore dss.pfx -srcstoretype pkcs12 -destkeystore dss.jks -deststoretype JKS
```

Get a copy of the client-truststore.jks file from the <PRODUCT_HOME>/repository/resources/security/ directory.

```shell
keytool -export -alias dss -keystore dss.jks -file dss.pem
```

```shell
keytool -import -alias dss -file dss.pem -keystore client-truststore.jks -storepass wso2carbon
```

```shell
keytool -import -trustcacerts -keystore client-truststore.jks -alias rootCA.platform.local -file rootCA.crt
```

```shell
keytool -storepasswd -keystore client-truststore.jks
```

### Create certicate and keystore for Nifi

Download Nifi-Toolkit [Link](https://nifi.apache.org/download.html)

```shell
nifi-toolkit-1.11.4/bin/tls-toolkit.sh standalone -n 'nifi.platform.local' --subjectAlternativeNames 'nifi,nifi.platform.local' --additionalCACertificate rootCA.crt -S 'platform' -P 'platform'
```

```shell
keytool -import -trustcacerts -keystore truststore.jks -alias rootCA.platform.local -file rootCA.crt
```

## Getting Started with DigitalHub Platform on Kubernetes

### Prerequisites

Before beginning with the installation, ensure that you have a 3 nodes Kubernetes cluster with at least 4 CPUs and 8 GB RAM each.

### Create a Kubernetes cluster (Azure)

```shell
az aks create -g kube-test -n platform-test --kubernetes-version 1.17.7 \
--location westeurope --network-plugin azure --network-policy calico --node-count 3 \
--node-vm-size Standard_D8s_v3 --ssh-key-value kube-test.pub --nodepool-name d8sv3 \
--max-pods 250
```

### Install the Kubernetes CLI

```shell
az aks install-cli
```

### Connect to cluster using kubectl

```shell
az aks get-credentials -g kube-test -n platform-test
```

### Install Helm

```shell
curl https://helm.baltorepo.com/organization/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```
Official Documentation [Link](https://helm.sh/docs/intro/install/ "Helm Installation Guide")

### Install Istio

```shell
curl -L https://istio.io/downloadIstio | sh -

cd istio-1.6.5

export PATH=$PWD/bin:$PATH

istioctl install --set profile=demo
```

Official Documentation [Link](https://istio.io/latest/docs/setup/getting-started/ "Istio  Installation Guide")

### Install monitoring components

#### Loki

```shell
kubectl create namespace monitoring

helm repo add loki https://grafana.github.io/loki/charts
helm repo update
helm upgrade --install loki loki/loki-stack --namespace monitoring --version 0.38.1 --values ./helm/monitoring/loki-stack/values-azure-v0.38.1.yaml
```

#### Prometheus Operator

```shell
helm upgrade --install prometheus-operator  stable/prometheus-operator --namespace monitoring --version 8.16.1 --values ./helm/monitoring/prometheus-operator/values-azure-v8.16.1.yaml
```

#### Verify Installation

```shell
kubectl -n monitoring get pods
```

Example output:

```shell
NAME                                                      READY   STATUS    RESTARTS   AGE
alertmanager-prometheus-operator-alertmanager-0           2/2     Running   0          36m
loki-0                                                    1/1     Running   0          48m
loki-promtail-hpp77                                       1/1     Running   0          48m
loki-promtail-wgqnn                                       1/1     Running   0          48m
prometheus-operator-grafana-68b69d65cd-24zz4              2/2     Running   0          36m
prometheus-operator-kube-state-metrics-66b4c95cd9-9729n   1/1     Running   0          36m
prometheus-operator-operator-86d4f4ccf5-h2mt2             2/2     Running   0          36m
prometheus-operator-prometheus-node-exporter-hs72t        1/1     Running   0          36m
prometheus-operator-prometheus-node-exporter-q6zk8        1/1     Running   0          36m
prometheus-prometheus-operator-prometheus-0               3/3     Running   1          36m

```

### Install DigitalHub Platform components

```shell
kubectl create ns databases
kubectl create ns global
```

#### Mysql

Edit credentials using SQL init script under **initializationFiles:** option in values file (*helm/databases/values-azure-v1.6.6.yaml*).

```shell
helm upgrade --install mysql stable/mysql --namespace databases --version 1.6.6 --values helm/databases/values-azure-v1.6.6.yaml  
```

#### AAC

Create kuberentes secrets:

```shell
kubectl -n global create secret generic aac-db-creds --from-literal=username=ac --from-literal=password=ac
kubectl -n global create secret generic aac-admin-creds --from-literal=username=admin --from-literal=password=admin
```

To generate new key please follow the instructions available [Here](https://mkjwk.org/).

```shell
kubectl -n global create secret generic aac-keystore --from-file=helm/aac/config/keystore.jwks
```

Install AAC

```shell
helm upgrade --install  aac ./charts/aac/ --namespace global --values ./helm/aac/aac-values.yaml
```

#### Api-Manager

```shell

```

## Getting Started with DigitalHub Platform on Docker-Compose


```shell
docker network create platform-net

docker-compose -p platform.local -f database.yml up -d

docker-compose -p platform.local -f aac.yml up -d

docker-compose -p platform.local -f apim-analytics.yml up -d

docker-compose -p platform.local -f apim.yml up -d

docker-compose -p platform.local -f dss.yml up -d

docker-compose -p platform.local -f nifi.yml up -d

docker-compose -p platform.local -f cyclotron.yml up -d
```

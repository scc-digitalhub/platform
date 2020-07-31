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
        <(printf "\n[SAN]\nsubjectAltName=DNS:api.platform.local,DNS:gw.platform.local,DNS:api-manager,DNS:api-manager.global.svc.cluster.local")) \
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
        <(printf "\n[SAN]\nsubjectAltName=DNS:am-analytics,DNS:api-manager-analytics,DNS:api-manager-analytics.global.svc.cluster.local")) \
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
        <(printf "\n[SAN]\nsubjectAltName=DNS:dss.platform.local,DNS:dss,DNS:dss-wso2,DNS:dss.global.svc.cluster.local")) \
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
keytool -import -trustcacerts -keystore client-truststore.jks -alias lets-encrypt -file lets-encrypt-x3-cross-signed.pem
```

```shell
keytool -storepasswd -keystore client-truststore.jks
```

### Create certicate and keystore for Nifi

Download Nifi-Toolkit [Link](https://nifi.apache.org/download.html)

Generate Server certs
```shell
nifi-toolkit-1.11.4/bin/tls-toolkit.sh standalone -n 'nifi.platform.local' \
 --subjectAlternativeNames 'nifi,nifi.platform.local,nifi.global.svc.cluster.local' \
 --additionalCACertificate ca/rootCA.crt -S 'platform' -P 'platform' -C 'CN=admin,OU=NIFI'
```

Convert Client certs and key to PEM format
```shell
openssl pkcs12 -clcerts -nokeys -out admin-cert.pem -in CN\=admin_OU\=NIFI.p12
openssl pkcs12 -clcerts -nocerts -nodes -out admin-private-key.pem -in CN\=admin_OU\=NIFI.p12
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

Generate wildcard certificate and create a secret with it.

```shell
kubectl -n istio-system create secret tls wild-card-cert --key=privkey.pem --cert=fullchain.pem
```

```shell
kubectl create ns global
kubectl label namespaces global  istio-injection=enabled
kubectl apply -f helm/istio/global-gateway.yml
```

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

```shell
kubectl apply -f helm/istio/monitoring-virtual-service.yml
```

##### Verify Installation

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
```

#### Mysql

Edit credentials using SQL init script under **initializationFiles:** option in values file (*helm/databases/mysql-values-azure-v1.6.6.yaml*).

```shell
helm upgrade --install mysql stable/mysql --namespace databases --version 1.6.6 --values helm/databases/mysql-values-azure-v1.6.6.yaml  
```

#### MongoDB

Edit credentials using init script under **initializationFiles:** option in values file (*helm/databases/mongo-values-azure-v8.1.5.yaml*).

```shell
helm upgrade --install mongo bitnami/mongodb --version 8.1.5 --namespace databases --values helm/databases/mongo-values-v8.1.5.yaml
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

```shell
kubectl apply -f helm/istio/aac-virtual-service.yml
```

#### Api-Manager

Create kuberentes secrets:

```shell
kubectl -n global create secret generic api-manager-db-creds --from-literal=username=wso2carbon \
 --from-literal=password=wso2carbon

kubectl -n global create secret generic api-manager-aac-creds \
 --from-literal=username=omQ70vxR-XE9P-3cHZ-A0de-1wId-fwCzURkUFou9 \
 --from-literal=password=YZ5v3qLn-3Lkn-D77F-6GJL-c1Bf-TU2bPLKc0oGW

kubectl -n global create secret generic api-manager-admin-creds --from-literal=username=admin \
 --from-literal=password=admin

kubectl -n global create secret generic api-manager-keystore --from-file=apigwself.jks --from-file=client-truststore.jks

kubectl -n global create secret generic api-manager-keystore-pass \
 --from-literal=keystore=platform --from-literal=truststore=platform

kubectl -n global create secret generic api-manager-keystore-analytics \
--from-file=am-analytics.jks \
--from-file=client-truststore.jks

kubectl -n global create secret generic api-manager-analytics-keystore-pass --from-literal=keystore=platform \
--from-literal=truststore=platform
```
Install Api-Manager

```shell
helm upgrade --install api-manager ./charts/api-manager/ --namespace global --values ./helm/api-manager/api-manager-values.yaml
```

```shell
kubectl apply -f helm/istio/api-manager-destination-rule.yaml
```

```shell
kubectl apply -f helm/istio/api-manager-virtualservice.yml
```

#### DSS

Create kuberentes secrets:

```shell
kubectl -n global create secret generic dss-keystore --from-file=dss.jks --from-file=client-truststore.jks

kubectl -n global create secret generic dss-creds --from-literal=username=admin  --from-literal=password=admin

kubectl -n global create secret generic dss-db-creds --from-literal=username=wso2carbon  --from-literal=password=wso2carbon

kubectl -n global create secret generic dss-keystore-creds --from-literal=keystore=platform  --from-literal=truststore=platform

kubectl -n global create secret generic dss-aac-creds --from-literal=username=oppnW6kY-VtZ7-Yyx6-0oAQ-BhN1-TMlpIeM6bvZo --from-literal=password=YGMUkmP5-8swI-d3sG-Ib4d-KXJ2-NjjNDCoiK7VN

```
Install DSS

```shell
helm upgrade --install dss ./charts/dss/ --namespace global --values ./helm/dss/dss-values.yaml
```

```shell
kubectl apply -f helm/istio/dss-destination-rule.yaml
```

```shell
kubectl apply -f helm/istio/dss-virtualservice.yml
```

#### Minio

```shell
kubectl -n global create secret generic minio-creds --from-literal=accesskey=admin  --from-literal=secretkey=admin12345
```

```shell
helm upgrade --install minio stable/minio --namespace global --version 5.0.31 --values helm/minio/minio-values-v5.0.31.yaml
```

```shell
kubectl apply -f helm/istio/minio-virtualservice.yml
```
#### Grafana

```shell
kubectl -n global create secret generic grafana-creds --from-literal=admin-user=grafana  --from-literal=admin-password=grafana
```

Install grafana

```shell
helm upgrade --install grafana stable/grafana --version 5.4.1 --namespace global --values ./helm/grafana/grafana-values.v5.4.1.yaml
```

```shell
kubectl apply -f helm/istio/grafana-virtual-service.yml
```

```shell
TO DO
```

#### Nuclio Sys

```shell
kubectl create ns sys
```

```shell
kubectl label namespaces sys  istio-injection=enabled
```
Create azure container registry:

```shell
az acr create --resource-group kube-test --name sclconfigtest --sku Basic
```
Take note of loginServer in the output, which is the fully qualified registry name (all lowercase).

```shell
az acr update -n sclconfigtest --admin-enabled true

az acr credential show -n sclconfigtest
```

Create kuberentes secrets using azure container registy credentials:

```shell
kubectl -n sys create secret docker-registry registry-credentials --docker-username <username> --docker-password <password1> --docker-server <server> --docker-email <your-email>
```

```shell
kubectl -n sys create secret generic nifi-user-cert-pem --from-file=nifi-cert.pem \
 --from-file=admin-private-key.pem \
 --from-file=admin-cert.pem
```

Install Nuclio Sys

```shell
helm upgrade --install -n sys nuclio-sys charts/nuclio/ --values ./helm/nuclio/nuclio-sys-values.yaml
```

```shell
kubectl apply -f helm/istio/nuclio-internal-virtualservice.yml
```

```shell
TO DO
```

#### Gatekeeper

Genatare random string for Encryption key

```shell
openssl rand -base64 32
```

```shell
kubectl -n global create secret generic gatekeeper-client-creds \
  --from-literal=clientid=Pk1U7ks1-LoM0-MD72-CXY9-Fs2d-Ucju6NeBJ3fg \
  --from-literal=clientsecret=3eWp50TL-ZD8F-P8TE-mH0m-6BcB-KNVGoMuY6sVT \
  --from-literal=encryptionkey=63d9311968fc9a184dbe6b255d1556c0
```

Install Gatekeeper

```shell
helm upgrade --install gatekeeper ./charts/gatekeeper/ --namespace global --values ./helm/gatekeeper/gatekeeper-values.yaml
```

```shell
kubectl apply -f ./helm/istio/gatekeeper-virtualservice.yml
```

```shell
TO DO
```

#### NIFI

```shell
kubectl -n global create secret generic nifi-keystore --from-file=keystore.jks --from-file=truststore.jks

kubectl -n global create secret generic nifi-keystore-creds --from-literal=keystore=platform --from-literal=truststore=platform

kubectl -n global create secret generic nifi-aac-creds \
  --from-literal=username=Ta2hf9zR-Eb5M-JV7T-n7hm-A8m3-KhOzjXUV7R8R \
  --from-literal=password=84OoMfbM-4ULC-7ehI-0Tqy-a0qV-ki9JKrORK4ve
```

Install Nifi

```shell
helm upgrade --install nifi ./charts/nifi/ --namespace global --values ./helm/nifi/nifi-values.yaml
```

```shell
kubectl apply -f ./helm/istio/nifi-destination-rule.yml

kubectl apply -f ./helm/istio/nifi-virtualservice.yml
```

```shell
TO DO
```

#### JupyterHub

```shell
kubectl create ns jhub
```


Install JupyterHub

```shell
helm upgrade --install jhub jupyterhub/jupyterhub --namespace jhub --version=0.9.1 --values helm/jupyterhub/jupyterhub-values-v0.9.1.yml
```

```shell
kubectl apply -f ./helm/istio/jhub-virtualservice.yml
```

```shell
TO DO
```

#### Cyclotron

Install Cyclotron

```shell
helm upgrade --install cyclotron charts/cyclotron/ --values helm/cyclotron/cyclotron-values.yaml --namespace global
```

```shell
kubectl apply -f ./helm/istio/cyclotron-virtualservice.yml
```

```shell
TO DO
```

#### Resource-Manager

Install databases

Clone Zalando Postgres-Operator:

```shell
git clone https://github.com/zalando/postgres-operator.git
cd postgres-operator
```

Install Zalando Postgres-Operator:

```shell
helm install postgres-operator ./charts/postgres-operator --namespace global

kubectl apply -f helm/resource-manager/minimal-postgres-manifest.yaml
```
Install Mysql:

```shell
helm upgrade --install mysql stable/mysql --namespace global --version 1.6.6 --values helm/resource-manager/mysql-values-azure-v1.6.6.yaml  
```

To get your root password run:

```shell
kubectl get secret --namespace global mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode; echo
```
Create new secret with root username and password:

```shell
kubectl -n global create secret generic mysql-creds --from-literal=username=root  --from-literal=password=yvudKY9R9F
kubectl -n global create secret generic rs-db-creds --from-literal=username=rm --from-literal=password=rm
kubectl -n global create secret generic rs-oauth-creds --from-literal=username=cZtSrl7O-m2xO-q2Oj-Abq9-FS4U-omn0M6hQOwui --from-literal=password=cZtSrl7O-m2xO-q2Oj-Abq9-FS4U-omn0M6hQOwui
```
Install resource-manager

```shell
helm upgrade --install rm charts/resource-manager/ --values helm/resource-manager/resource-manager-values.yaml --namespace global
```

```shell
kubectl apply -f ./helm/istio/resource-manager-virtualservice.yml
```

```shell
TO DO
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

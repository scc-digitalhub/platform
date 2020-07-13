# DigitalHub Platform

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
helm upgrade --install loki loki/loki-stack --namespace monitoring --values ./helm/loki-stack/values-azure-v0.38.1.yaml
```

#### Prometheus Operator

```shell
helm upgrade --install prometheus-operator  stable/prometheus-operator --namespace monitoring --values ./helm/monitoring/prometheus-operator/values-azure-v8.16.1.yaml
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

####



```shell

```

## Getting Started with DigitalHub Platform on Docker-Compose


```shell
docker network create platform-net

docker-compose -p platform.local -f database.yml up -d

docker-compose -p platform.local -f aac.yml up -d

docker-compose -p platform.local -f apim.yml up -d

docker-compose -p platform.local -f dss.yml up -d

docker-compose -p platform.local -f nifi.yml up -d

docker-compose -p platform.local -f cyclotron.yml up -d
```

# Copyright 2017 The Nuclio Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

{{- define "nuclio.nuclioName" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "nuclio.controllerName" -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-controller" $name | trunc 63 -}}
{{- end -}}

{{- define "nuclio.scalerName" -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-scaler" $name | trunc 63 -}}
{{- end -}}

{{- define "nuclio.dlxName" -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-dlx" $name | trunc 63 -}}
{{- end -}}

{{- define "nuclio.dashboardName" -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-dashboard" $name | trunc 63 -}}
{{- end -}}

{{- define "nuclio.serviceAccountName" -}}
{{- if .Values.rbac.serviceAccountName -}}
{{- .Values.rbac.serviceAccountName -}}
{{- else -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- $name -}}
{{- end -}}
{{- end -}}

{{- define "nuclio.registryCredentialsName" -}}
{{- if .Values.registry.secretName -}}
{{- .Values.registry.secretName -}}
{{- else if .Values.registry.credentials -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-registry-credentials" $name -}}
{{- else -}}
{{- printf "" -}}
{{- end -}}
{{- end -}}

{{- define "nuclio.registryPushPullUrlName" -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-registry-url" $name -}}
{{- end -}}

{{- define "nuclio.functionDeployerName" -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-function-deployer" $name -}}
{{- end -}}

{{- define "nuclio.crdAdminName" -}}
{{- $name := default .Release.Name .Values.nameOverride -}}
{{- printf "%s-crd-admin" $name -}}
{{- end -}}

{{- define "nuclio.platformName" -}}
{{- printf "platform-config" -}}
{{- end -}}

{{/*
Allow the release namespace to be overridden for multi-namespace deployments in combined charts
*/}}
{{- define "nuclio.namespace" -}}
  {{- if .Values.namespaceOverride -}}
    {{- .Values.namespaceOverride -}}
  {{- else -}}
    {{- .Release.Namespace -}}
  {{- end -}}
{{- end -}}

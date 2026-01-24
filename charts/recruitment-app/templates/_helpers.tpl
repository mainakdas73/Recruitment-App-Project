{{- define "recruitment.name" -}}
{{ .Chart.Name }}
{{- end }}

{{- define "recruitment.labels" -}}
app: {{ include "recruitment.name" . }}
{{- end }}


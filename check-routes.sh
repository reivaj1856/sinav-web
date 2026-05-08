#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://localhost:3000}"
CONNECT_TIMEOUT="${CONNECT_TIMEOUT:-3}"
MAX_TIME="${MAX_TIME:-8}"

COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

# Devuelve: "<status> <location>"
head_status_and_location() {
  local method="$1"
  local url="$2"

  # -I: headers only, NO seguimos redirects
  # -D -: imprime headers a stdout
  # -o /dev/null: descarta body (aunque con -I no hay)
  curl -sS -I -D - -o /dev/null \
    --connect-timeout "$CONNECT_TIMEOUT" \
    --max-time "$MAX_TIME" \
    -X "$method" \
    -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    "$url" | awk '
      BEGIN { status=""; loc="" }
      /^HTTP\// { status=$2 }
      /^[Ll]ocation:/ {
        loc=$0
        sub(/^[Ll]ocation:[[:space:]]*/, "", loc)
        gsub(/\r/, "", loc)
      }
      END { print status, loc }
    '
}

check() {
  local method="$1"
  local path="$2"
  local label="$3"

  echo -n "${method} ${path} (${label}): "

  read -r STATUS LOCATION < <(head_status_and_location "$method" "${BASE}${path}")

  # Si no hay status, algo raro pasó
  if [[ -z "${STATUS:-}" ]]; then
    echo "❌ ERROR (sin respuesta)"
    return
  fi

  # Lógica de seguridad:
  # - 401/403 => seguro
  # - 307/308 y Location contiene /login => seguro (redirect por auth)
  # - 200 => accesible público
  if [[ "$STATUS" == "401" || "$STATUS" == "403" ]]; then
    echo "✅ SEGURO (${STATUS})"
  elif [[ ("$STATUS" == "307" || "$STATUS" == "308") && "$LOCATION" == *"/login"* ]]; then
    echo "✅ SEGURO (${STATUS} -> ${LOCATION})"
  elif [[ "$STATUS" =~ ^2|^3 ]]; then
    # 3xx que NO van a login o 200 directo
    if [[ -n "${LOCATION:-}" ]]; then
      echo "⚠️  ACCESIBLE (${STATUS} -> ${LOCATION})"
    else
      echo "⚠️  ACCESIBLE (${STATUS})"
    fi
  else
    if [[ -n "${LOCATION:-}" ]]; then
      echo "❌ ERROR (${STATUS} -> ${LOCATION})"
    else
      echo "❌ ERROR (${STATUS})"
    fi
  fi
}

echo "BASE=${BASE}"
echo

check GET "/login" "Login (page.tsx)"
check GET "/dashboard" "Dashboard (page.tsx)"
check GET "/dashboard/pacientes" "Pacientes"
check GET "/dashboard/vacunacion" "Vacunación"
check GET "/dashboard/importacion" "Importación"
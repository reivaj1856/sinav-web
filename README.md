## Verificación de rutas (check-routes.sh)

Este proyecto usa un script para **confirmar que las rutas principales responden correctamente** y que las rutas protegidas por autenticación **redirigen al login** cuando no hay sesión.

### Requisitos
- Servidor corriendo (por defecto `http://localhost:3000`)
- `bash` y `curl`
  - En Windows: usar **Git Bash** (recomendado) o WSL

### 1) Crear el archivo

Crea un archivo en la raíz del proyecto llamado `check-routes.sh` con el siguiente contenido:

```bash
#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://localhost:3000}"
CONNECT_TIMEOUT="${CONNECT_TIMEOUT:-3}"
MAX_TIME="${MAX_TIME:-8}"

COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

head_status_and_location() {
  local method="$1"
  local url="$2"

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

  if [[ -z "${STATUS:-}" ]]; then
    echo "❌ ERROR (sin respuesta)"
    return
  fi

  if [[ "$STATUS" == "401" || "$STATUS" == "403" ]]; then
    echo "✅ SEGURO (${STATUS})"
  elif [[ ("$STATUS" == "307" || "$STATUS" == "308") && "$LOCATION" == *"/login"* ]]; then
    echo "✅ SEGURO (${STATUS} -> ${LOCATION})"
  elif [[ "$STATUS" =~ ^2|^3 ]]; then
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
```

### 2) Dar permisos de ejecución

En Git Bash / Linux / macOS:

```bash
chmod +x check-routes.sh
```

### 3) Ejecutar el script

Con el servidor corriendo en `localhost:3000`:

```bash
BASE=http://localhost:3000 ./check-routes.sh
```

Si tu app corre en otro host/puerto:

```bash
BASE=http://localhost:4000 ./check-routes.sh
# o
BASE=http://127.0.0.1:3000 ./check-routes.sh
```

### Interpretación de resultados

- `✅ SEGURO (401/403)`  
  La ruta está protegida y el servidor respondió “no autorizado / prohibido”.

- `✅ SEGURO (307/308 -> /login)`  
  La ruta está protegida y **redirige al login** cuando no hay sesión (comportamiento esperado).

- `⚠️  ACCESIBLE (200)`  
  La ruta es accesible sin autenticación (pública) o no está protegida.

- `❌ ERROR (404/500/...)`  
  La ruta no existe o hay un error interno.

### Nota
El script valida **rutas sin sesión** (anónimo). Para validar rutas “logueado”, se necesitaría un endpoint de login automatizable desde `curl` (no siempre posible cuando el login se implementa con Server Actions).
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

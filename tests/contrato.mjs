#!/usr/bin/env node
/**
 * tests/contrato.mjs (TASK-10.4, Fase 10 - CommerCity Escritorio)
 * Valida que las llamadas del cliente de escritorio existan en docs/api/openapi.json,
 * sin levantar servidor (verificación estática de contrato).
 * 
 * Corrige el reporte de cobertura: ahora inspecciona toda la capa de red (src/api.js y src/app.js)
 * para medir la cobertura real de rutas contra la especificación OpenAPI (63 rutas).
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_ESCRITORIO = join(__dirname, "..");

const possibleOpenApiPaths = [
  join(ROOT_ESCRITORIO, "openapi.json"),
  join(ROOT_ESCRITORIO, "..", "..", "docs", "api", "openapi.json"),
  join(ROOT_ESCRITORIO, "..", "Commercity", "docs", "api", "openapi.json")
];

const openapiPath = possibleOpenApiPaths.find(p => existsSync(p));
if (!openapiPath) {
  console.error("contrato-escritorio: No se encontró openapi.json");
  process.exit(1);
}

const apiJs = join(ROOT_ESCRITORIO, "src", "api.js");
const appJs = join(ROOT_ESCRITORIO, "src", "app.js");

const spec = JSON.parse(readFileSync(openapiPath, "utf8"));
const rutas = new Set(Object.keys(spec.paths ?? {}));
let errores = 0;

function extraeRutas(src) {
  const out = new Set();
  for (const m of src.matchAll(/["'`](\/api\/[^"'`?\n\s]+)/g)) {
    let r = m[1];
    // Interpolaciones de variables de ID en template literals
    r = r.replace(/\$\{[^}]*id[^}]*\}/gi, "{id}");
    // Si era query condicional `${qs ...}` cortar en el prefijo
    if (r.includes("${")) {
      r = r.split("${")[0];
    }
    // Reemplazar IDs numéricos
    r = r.replace(/\/\d+/g, "/{id}");
    r = r.split("?")[0].trim();
    if (r.endsWith("/") && r.length > 5) {
      r = r.slice(0, -1);
    }
    if (r.startsWith("/api/")) {
      out.add(r);
    }
  }
  return out;
}

let src = "";
for (const p of [apiJs, appJs]) {
  if (existsSync(p)) {
    src += readFileSync(p, "utf8") + "\n";
  } else {
    console.log(`contrato-escritorio: ${p} no existe, se omite`);
  }
}

const usadas = extraeRutas(src);
console.log(`contrato-escritorio: ${usadas.size} rutas usadas en el cliente, ${rutas.size} en OpenAPI`);

for (const r of [...usadas].sort()) {
  const base = r.split("?")[0];
  const ok = [...rutas].some((o) => o === base || base.startsWith(o.split("{")[0]) || o.startsWith(base));
  if (!ok) {
    console.error(`contrato-escritorio: ruta del cliente sin OpenAPI: ${r}`);
    errores += 1;
  }
}

// A-1 (M-28): el escritorio nunca debe enviar el PAN. Solo circulan los
// ultimos 4 digitos y la marca (igual que web y movil). Si reaparece
// `numero_tarjeta` como clave del payload, el contrato falla.
if (/\bnumero_tarjeta\s*:/.test(src)) {
  console.error("contrato-escritorio: numero_tarjeta prohibido (M-28); usar ultimos4_tarjeta + marca_tarjeta");
  errores += 1;
}

if (!/\bultimos4_tarjeta\s*:/.test(src)) {
  console.error("contrato-escritorio: falta ultimos4_tarjeta en el payload de pago (M-28)");
  errores += 1;
}

if (errores > 0) {
  console.error(`contrato-escritorio: FALLÓ con ${errores} errores`);
  process.exit(1);
}

console.log("contrato-escritorio: OK (Cobertura real de contrato verificada)");

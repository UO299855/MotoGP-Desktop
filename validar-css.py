import requests
import os
import json

VALIDATOR_URL = "https://jigsaw.w3.org/css-validator/validator"
LOG_DIR = "css-logs"


def validar_css(ruta_archivo):
    with open(ruta_archivo, "rb") as f:
        respuesta = requests.post(
            VALIDATOR_URL,
            files={"file": (os.path.basename(ruta_archivo), f, "text/css")},
            data={
                "output": "json",
                "warning": "2"  # TODAS las advertencias
            }
        )

    return respuesta.json()


def ruta_log_desde_css(ruta_css):
    """
    Convierte:
    ./css/main/style.css
    en:
    ./css-logs/css/main/style.json
    """
    ruta_relativa = os.path.relpath(ruta_css, ".")
    ruta_sin_ext = os.path.splitext(ruta_relativa)[0] + ".json"
    return os.path.join(LOG_DIR, ruta_sin_ext)


def guardar_log(ruta_css, resultado):
    ruta_log = ruta_log_desde_css(ruta_css)
    os.makedirs(os.path.dirname(ruta_log), exist_ok=True)

    with open(ruta_log, "w", encoding="utf-8") as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)


def validar_recursivo(carpeta):
    for raiz, _, archivos in os.walk(carpeta):
        # Evitar validar los propios logs
        if raiz.startswith(f"./{LOG_DIR}") or raiz.startswith(LOG_DIR):
            continue

        for archivo in archivos:
            if archivo.endswith(".css"):
                ruta_css = os.path.join(raiz, archivo)
                print(f"\n🎨 Validando {ruta_css}")

                resultado = validar_css(ruta_css)
                guardar_log(ruta_css, resultado)

                errores = resultado.get("cssvalidation", {}).get("errors", [])
                avisos = resultado.get("cssvalidation", {}).get("warnings", [])

                if errores:
                    print(f"❌ {len(errores)} errores")
                else:
                    print("✅ Sin errores")

                if avisos:
                    print(f"⚠️ {len(avisos)} advertencias")


if __name__ == "__main__":
    validar_recursivo(".")

import requests
import os
import json

VALIDATOR_URL = "https://validator.w3.org/nu/?out=json"
LOG_DIR = "html-logs"


def validar_html(ruta_archivo):
    with open(ruta_archivo, "rb") as f:
        respuesta = requests.post(
            VALIDATOR_URL,
            headers={"Content-Type": "text/html; charset=utf-8"},
            data=f.read()
        )
    return respuesta.json()


def ruta_log_desde_html(ruta_html):
    """
    Convierte:
    ./php/forms/survey.html
    en:
    ./html-logs/php/forms/survey.json
    """
    ruta_relativa = os.path.relpath(ruta_html, ".")
    ruta_sin_ext = os.path.splitext(ruta_relativa)[0] + ".json"
    return os.path.join(LOG_DIR, ruta_sin_ext)


def guardar_log(ruta_html, resultado):
    ruta_log = ruta_log_desde_html(ruta_html)
    os.makedirs(os.path.dirname(ruta_log), exist_ok=True)

    with open(ruta_log, "w", encoding="utf-8") as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)


def validar_recursivo(carpeta):
    for raiz, _, archivos in os.walk(carpeta):
        # Evitar validar los propios logs
        if raiz.startswith(f"./{LOG_DIR}") or raiz.startswith(LOG_DIR):
            continue

        for archivo in archivos:
            if archivo.endswith(".html"):
                ruta_html = os.path.join(raiz, archivo)
                print(f"\n📄 Validando {ruta_html}")

                resultado = validar_html(ruta_html)
                guardar_log(ruta_html, resultado)

                errores = [m for m in resultado["messages"] if m["type"] == "error"]
                avisos = [m for m in resultado["messages"] if m["type"] == "info"]

                if errores:
                    print(f"❌ {len(errores)} errores")
                else:
                    print("✅ Sin errores")

                if avisos:
                    print(f"⚠️ {len(avisos)} avisos")


if __name__ == "__main__":
    validar_recursivo(".")

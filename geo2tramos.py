import json
import xml.etree.ElementTree as ET
from geopy.distance import geodesic
import requests

# Función para obtener altitud (simulada como 1 metro, puedes usar un API real)
def obtener_altitud(lat, lon):
    url = f"https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}"
    r = requests.get(url)
    if r.status_code == 200:
        data = r.json()
        return data['results'][0]['elevation']
    else:
        return 0  # fallback

# Leer el GeoJSON
with open("entrada.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

# Crear el elemento raíz del XML
tramos_root = ET.Element("tramos")

# Iterar sobre cada feature
for feature in data.get("features", []):
    coordinates = feature["geometry"]["coordinates"]  # CORREGIDO: quitar [0]
    for i in range(len(coordinates)-1):
        lon1, lat1 = coordinates[i]
        lon2, lat2 = coordinates[i+1]

        # Calcular distancia en metros
        distancia = geodesic((lat1, lon1), (lat2, lon2)).meters

        # Obtener altitud del primer punto
        altitud = obtener_altitud(lat1, lon1)

        # Crear elemento tramo
        tramo = ET.SubElement(tramos_root, "tramo", sector="S1")
        
        # Crear coordenadas
        coord = ET.SubElement(tramo, "coordenadas")
        lat_elem = ET.SubElement(coord, "latitud", unidades="grados")
        lat_elem.text = f"{lat1}"
        lon_elem = ET.SubElement(coord, "longitud", unidades="grados")
        lon_elem.text = f"{lon1}"
        alt_elem = ET.SubElement(coord, "altitud", unidades="metros")
        alt_elem.text = f"{altitud:.2f}"

        # Agregar distancia
        dist_elem = ET.SubElement(tramo, "distancia", unidades="metros")
        dist_elem.text = f"{distancia:.2f}"

# Guardar XML
tree = ET.ElementTree(tramos_root)
ET.indent(tree)
tree.write("salida.xml", encoding="utf-8", xml_declaration=True)

print("XML generado en 'salida.xml'")

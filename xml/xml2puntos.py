""""
Genera un archivo KML a partir del XML del circuito
"""
import xml.etree.ElementTree as ET
class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    @version 1.1 19/Octumbre/2024
    @author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
    """
    def __init__(self):
        "Crea el elemento raíz y el espacio de nombres"

        self.raiz : ET.Element = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc  : ET.Element = ET.SubElement(self.raiz,"Document")

    def addPlacemark(self,nombre : str, descripcion : str, long : int, lat : int , alt : int, modoAltitud : str):
        "Añade un elemento <Placemark> con puntos <Point>"
        placemark : ET.Element = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(placemark,'name').text = nombre
        ET.SubElement(placemark,'description').text = descripcion
        punto : ET.element = ET.SubElement(placemark,'Point')
        ET.SubElement(punto,'coordinates').text = '{},{},{}'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = modoAltitud

    def addLineString(self,nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
        "Añade un elemento <Placemark> con líneas <LineString>"
        ET.SubElement(self.doc,'name').text = nombre
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = extrude
        ET.SubElement(ls,'tessellation').text = tesela
        ET.SubElement(ls,'coordinates').text = listaCoordenadas
        ET.SubElement(ls,'altitudeMode').text = modoAltitud
        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = color
        ET.SubElement (linea, 'width').text = ancho

    def escribir(self, nombreArchivoKML):
        "Escribe el archivo KML con declaración y codificación"
        arbol = ET.ElementTree(self.raiz)
        """
        Introduce indentacióon y saltos de línea
        para generar XML en modo texto
        """
        ET.indent(arbol)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)


def parse_circuit(circuit_file : str, relative_to_ground : bool = False) -> Kml:
    #Creamos el KML que vamos a manipular
    new_kml : Kml = Kml()

    #Fijamos el diccionario de dominios para hacer más legible el código
    ns_dict = {"ns": "http://www.uniovi.es"}

    #Hallamos la raíz del arbol del esquema del circuito
    circuit_root = ET.parse(circuit_file).getroot()

    i : int = 1
    for tramo in circuit_root.findall(".//ns:tramo", ns_dict) :
        #Según nuestro XML Schema, cada tramo tiene un único valor de latitud, de longitud, y de altitud
        longitud : int = tramo.find("./ns:coordenadas/ns:longitud", ns_dict).text
        latitud : int = tramo.find("./ns:coordenadas/ns:latitud", ns_dict).text
        altitud : int = tramo.find("./ns:coordenadas/ns:altitud", ns_dict).text

        #Ponemos los nodos en KML
        new_kml.addPlacemark(nombre = f"Tramo {i}",
                             descripcion = f"Tramo del sector {tramo.get("sector")}",
                             long = longitud,
                             lat = latitud,
                             alt = 0 if relative_to_ground else altitud,
                             modoAltitud = "relativeToGround" if relative_to_ground else "absolute")
        i+=1
    return new_kml
        

def main():
    parse_circuit("circuitoEsquema.xml").escribir("puntos.kml")

if __name__ == "__main__":
    main()
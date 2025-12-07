import xml.etree.ElementTree as ET
import math

class Svg(object):
    """
    Genera archivos SVG con rectángulos, círculos, líneas, polilíneas y texto
    @version 1.0 18/Octubre/2024
    @author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
    """
    def __init__(self):
        "Crea el elemento raíz, el espacio de nombres y la versión"
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="2.0")

    
    def adjustArea(self, width:str, height:str):
        self.raiz.set("viewBox", f"0 0 {width} {height}")
        self.raiz.set("preserveAspectRatio", "xMidYMid meet")

    def addLine(self,x1,y1,x2,y2,stroke,strokeWidth):
        "Añade un elemento line"
        ET.SubElement(self.raiz,'line',
        x1=x1,
        y1=y1,
        x2=x2,
        y2=y2)

    def addPolyline(self,points, color="red"):
        "Añade un elemento polyline"
        ET.SubElement(self.raiz,'polyline', points=points, fill="none", stroke=color)

    def addText(self,texto,x,y,fontFamily,fontSize,style):
        "Añade un elemento texto"
        ET.SubElement(self.raiz,'text', x=x, y=y).text=texto

    def escribir(self,nombreArchivoSVG):
        """
        Escribe el archivo SVG con declaración y codificación
        Introduce indentación y saltos de línea
        para generar XML en modo texto legible
        """
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)


class CircuitProcessor:
    def find_maximum_height(self, root : ET.Element, ns_dict : dict[str, str]) -> float:
        """
        Encuentra la altura máxima de los tramos del circuito para escalarlo adecuadamente
        """
        h_max : float = 0
        for height_node in root.findall("./ns:tramos/ns:tramo/ns:coordenadas/ns:altitud", ns_dict):
            if (height_value := float(height_node.text)) > h_max:
                h_max = height_value
        return h_max


    def process_point(self, svg : Svg, tramo : ET.Element, h_max : float, ns_dict : dict[str, str], points : str, last_x : float, x_scale : float = 1, y_scale : float = 1):
        dist_tramo : float = x_scale * float(tramo.find("./ns:distancia", ns_dict).text)
        altitud : float =  y_scale * (h_max - float(tramo.find("./ns:coordenadas/ns:altitud", ns_dict).text))
        last_x += dist_tramo
        svg.addText(tramo.get("sector"), str(last_x),str(altitud),'Verdana','1',"none")
        return (points + f"{last_x},{altitud} ", last_x, altitud)
        
    def parse_circuit(self, circuit_file : str, x_scale = 1, y_scale = 1) -> Svg:
        ns_dict : dict[str, str] = {"ns" : "http://www.uniovi.es"}
        circuit_root : ET.Element = ET.parse(circuit_file).getroot()
        h_max : float = self.find_maximum_height(circuit_root, ns_dict)
        new_svg : Svg = Svg()

        #Procesamos el primer tramo fuera del bucle para establecer un punto de partida
        tramos : list[ET.Element] = circuit_root.findall("./ns:tramos/ns:tramo", ns_dict)
        puntos, first_x, first_y = self.process_point(new_svg, tramos[0], h_max, ns_dict, "", 0, x_scale, y_scale)
        last_x : float = first_x #Guardamos el valor X del primer nodo para cerrar la polilínea y lo usaremos también como margen
        
        
        #Procesamos el resto
        for tramo in tramos[1:]:
            puntos, last_x = self.process_point(new_svg, tramo, h_max, ns_dict, puntos, last_x, x_scale, y_scale)[:2]
        
        #Cerramos la polilínea y la incluimos en el SVG
        puntos += f"{last_x},{h_max * y_scale} {first_x},{h_max * y_scale} {first_x}, {first_y}"
        new_svg.addPolyline(puntos)


        #Escala el SVG para que quepa entero
        #Usamos la función "techo" para redondear siempre hacia arriba
        #la componente X ya está escalada
        #h_max en cambio no
        new_svg.adjustArea(str(math.ceil(last_x + first_x)), str(math.ceil(y_scale * h_max))) 
        return new_svg


#TODO revisar rutas de archivo
def main() -> None:
    CircuitProcessor().parse_circuit("circuitoEsquema.xml", 1, 50).escribir("altimetria.svg")

if __name__ == "__main__":
    main()
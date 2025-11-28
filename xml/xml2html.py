import xml.etree.ElementTree as ET

class Html:

    def __create_head(self):
        """
        Crea el elemento "head" con los correspondientes atributos
            Enlaza las hojas de estilos utilizadas
        """
        head : ET.Element = ET.SubElement(self.root, "head")
        ET.SubElement(head, "meta", charset="UTF-8")
        ET.SubElement(head, "title").text="MotoGP-Información-Circuito"
        ET.SubElement(head, "meta", name="author", content="Javier Ortín Rodenas")
        ET.SubElement(head, "meta", name="description", content="Información sobre el circuito guardada en un html auxiliar")
        ET.SubElement(head, "meta", name="keywords", content="circuito,moto,información")
        ET.SubElement(head, "meta", name="viewport", content="width=device-width, initial-scale=1.0")
        ET.SubElement(head, "link", rel="stylesheet", type="text/css", href="../estilo/estilo.css")
        ET.SubElement(head, "link", rel="stylesheet", type="text/css", href="../estilo/layout.css")
        ET.SubElement(head, "link", rel="icon", type="image/ico", href="../multimedia/favicon.ico")

    def __create_body(self):
        self.body : ET.Element = ET.SubElement(self.root, "body")
        ET.SubElement(self.body, "h1").text = "Información sobre el circuito"


    def __init__(self):
        self.root : ET.Element = ET.Element("html", lang="es")
        self.__create_head()
        self.__create_body()


    def write(self, output_file : str):
        """
        Escribe el archivo destino siguiendo el formato HTML
        Utiliza indentación para hacerlo más legible
        """
        arbol = ET.ElementTree(self.root)
        ET.indent(arbol)
        arbol.write(output_file, method="html", encoding="utf-8")


class CircuitProcessor:

    def __format_node_tag(self, tag : str):
        """
        Formatea el tag de un nodo para hacerlo más legible
        Le quita el prefijo, lo separa por espacios en blanco y le pone la primera letra en mayúsculas
        """
        tag_name : str = tag.split("}")[1] if "}" in tag else tag #quitamos el prefijo en caso de haberlo
        return tag_name.replace("-", " ").strip().capitalize()


    def process_main_info(self, circuit_root : ET.Element, html : Html):
        section : ET.Element = ET.SubElement(html.body, "section")
        ET.SubElement(section, "h2").text="Características generales"
        u_list : ET.Element = ET.SubElement(section, "ul")
        for node in circuit_root.findall("./*"):
            #Saltamos los nodos sin texto
            #ET no soporta todas las expresiones xPath, luego hemos de hacerlo así
            if not node.text or node.text.strip() == "":
                continue
            li_content : str = f"{self.__format_node_tag(node.tag)}: {node.text}"
            if node.get("unidades"):
                li_content += f" {node.get("unidades")}"
            ET.SubElement(u_list, "li").text = li_content
        


    def main(self, input_file : str, output_file : str):
        circuit_root : ET.Element = ET.parse(input_file).getroot()
        html : Html = Html()
        self.process_main_info(circuit_root, html)
        html.write(output_file)


if __name__ == "__main__":
    CircuitProcessor().main("circuitoEsquema.xml", "infoCircuito.html")
import xml.etree.ElementTree as ET

# Namespaces XMI standard
NAMESPACES = {
    'uml': 'http://www.omg.org/spec/UML/20110701',
    'xmi': 'http://www.omg.org/spec/XMI/20110701'
}

class UMLAttribute:
    def __init__(self, name, type_, visibility):
        self.name = name
        self.type = type_
        self.visibility = visibility

    def to_dict(self):
        return {
            'name': self.name,
            'type': self.type,
            'visibility': self.visibility
        }

class UMLMethod:
    def __init__(self, name, visibility, return_type='void'):
        self.name = name
        self.visibility = visibility
        self.return_type = return_type

    def to_dict(self):
        return {
            'name': self.name,
            'visibility': self.visibility,
            'return_type': self.return_type
        }

class UMLClass:
    def __init__(self, name, parent=None):
        self.name = name
        self.parent = parent
        self.attributes = []
        self.methods = []

    def add_attribute(self, attr):
        self.attributes.append(attr)

    def add_method(self, method):
        self.methods.append(method)

    def to_dict(self):
        return {
            'name': self.name,
            'parent': self.parent,
            'attributes': [a.to_dict() for a in self.attributes],
            'methods': [m.to_dict() for m in self.methods]
        }

class XMIParser:
    def __init__(self, file_path):
        self.file_path = file_path
        self.classes = []

    def parse(self):
        try:
            tree = ET.parse(self.file_path)
            root = tree.getroot()
            self._extract_classes(root)
            return [c.to_dict() for c in self.classes]
        except Exception as e:
            raise Exception(f"Erreur parsing XMI : {str(e)}")

    def _extract_classes(self, root):
        # Chercher toutes les classes dans le document
        for elem in root.iter():
            tag = elem.get('{http://www.omg.org/spec/XMI/20110701}type', '')
            if tag == 'uml:Class':
                name = elem.get('name', 'UnknownClass')
                uml_class = UMLClass(name=name)

                # Héritage
                for gen in elem.findall('generalization'):
                    parent_id = gen.get('general', '')
                    parent = self._find_class_by_id(root, parent_id)
                    if parent:
                        uml_class.parent = parent

                # Attributs
                for attr in elem.findall('ownedAttribute'):
                    attr_name = attr.get('name', '')
                    visibility = attr.get('visibility', 'public')
                    attr_type = 'String'
                    type_elem = attr.find('type')
                    if type_elem is not None:
                        href = type_elem.get('href', '')
                        attr_type = href.split('/')[-1] if href else 'String'
                    if attr_name:
                        uml_class.add_attribute(
                            UMLAttribute(attr_name, attr_type, visibility)
                        )

                # Méthodes
                for op in elem.findall('ownedOperation'):
                    op_name = op.get('name', '')
                    visibility = op.get('visibility', 'public')
                    if op_name:
                        uml_class.add_method(
                            UMLMethod(op_name, visibility)
                        )

                self.classes.append(uml_class)

    def _find_class_by_id(self, root, xmi_id):
        for elem in root.iter():
            if elem.get('{http://www.omg.org/spec/XMI/20110701}id') == xmi_id:
                return elem.get('name')
        return None


# ── TEST RAPIDE ──
if __name__ == '__main__':
    import json
    import sys

    if len(sys.argv) > 1:
        parser = XMIParser(sys.argv[1])
        classes = parser.parse()
        print(json.dumps(classes, indent=2, ensure_ascii=False))
    else:
        print("Usage : python xmi_parser.py fichier.xmi")
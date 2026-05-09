from generator.base_generator import BaseGenerator

class PHPGenerator(BaseGenerator):
    def __init__(self, classes):
        super().__init__(classes)

    def generate(self):
        code = "<?php\n\n"
        for cls in self.classes:
            code += self.generate_class(cls)
            code += "\n\n"
        code += "?>"
        return code.strip()

    def generate_class(self, cls):
        name = cls['name']
        parent = cls.get('parent')
        attributes = cls.get('attributes', [])
        methods = cls.get('methods', [])

        # Déclaration classe
        if parent:
            code = f"class {name} extends {parent} {{\n"
        else:
            code = f"class {name} {{\n"

        # Attributs
        for attr in attributes:
            visibility = attr.get('visibility', 'public')
            attr_name = attr['name']
            code += f"    {visibility} ${attr_name};\n"

        code += "\n"

        # Constructeur
        code += "    public function __construct() {\n"
        if parent:
            code += "        parent::__construct();\n"
        for attr in attributes:
            attr_name = attr['name']
            attr_type = attr.get('type', 'String')
            default = self._default_value(attr_type)
            code += f"        $this->{attr_name} = {default};\n"
        if not attributes:
            code += "        // constructeur vide\n"
        code += "    }\n\n"

        # Getters et Setters
        for attr in attributes:
            visibility = attr.get('visibility', 'public')
            attr_name = attr['name']
            name_cap = attr_name.capitalize()
            if visibility == 'private':
                # Getter
                code += f"    public function get{name_cap}() {{\n"
                code += f"        return $this->{attr_name};\n"
                code += "    }\n\n"
                # Setter
                code += f"    public function set{name_cap}(${attr_name}) {{\n"
                code += f"        $this->{attr_name} = ${attr_name};\n"
                code += "    }\n\n"

        # Méthodes
        for method in methods:
            method_name = method['name']
            visibility = method.get('visibility', 'public')
            code += f"    {visibility} function {method_name}() {{\n"
            code += f"        // TODO : implémenter {method_name}\n"
            code += "    }\n\n"

        code += "}"
        return code

    def _default_value(self, attr_type):
        defaults = {
            'String': '""',
            'str': '""',
            'int': '0',
            'Integer': '0',
            'float': '0.0',
            'Float': '0.0',
            'bool': 'false',
            'Boolean': 'false',
            'List': '[]',
            'Array': '[]',
        }
        return defaults.get(attr_type, 'null')
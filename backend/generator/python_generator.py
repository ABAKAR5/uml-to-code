from generator.base_generator import BaseGenerator

class PythonGenerator(BaseGenerator):
    def __init__(self, classes):
        super().__init__(classes)

    def generate(self):
        code = ""
        for cls in self.classes:
            code += self.generate_class(cls)
            code += "\n\n"
        return code.strip()

    def generate_class(self, cls):
        name = cls['name']
        parent = cls.get('parent')
        attributes = cls.get('attributes', [])
        methods = cls.get('methods', [])

        # Déclaration classe
        if parent:
            code = f"class {name}({parent}):\n"
        else:
            code = f"class {name}:\n"

        # Docstring
        code += f'    """{name} class"""\n\n'

        # __init__
        code += "    def __init__(self):\n"
        if parent:
            code += "        super().__init__()\n"

        if attributes:
            for attr in attributes:
                visibility = attr.get('visibility', 'public')
                attr_name = attr['name']
                attr_type = attr.get('type', 'String')

                # Valeur par défaut selon le type
                default = self._default_value(attr_type)

                # Préfixe visibilité
                if visibility == 'private':
                    code += f"        self.__{attr_name} = {default}\n"
                elif visibility == 'protected':
                    code += f"        self._{attr_name} = {default}\n"
                else:
                    code += f"        self.{attr_name} = {default}\n"
        else:
            code += "        pass\n"

        code += "\n"

        # Getters et Setters pour attributs privés
        for attr in attributes:
            visibility = attr.get('visibility', 'public')
            attr_name = attr['name']
            if visibility == 'private':
                # Getter
                code += f"    def get_{attr_name}(self):\n"
                code += f"        return self.__{attr_name}\n\n"
                # Setter
                code += f"    def set_{attr_name}(self, {attr_name}):\n"
                code += f"        self.__{attr_name} = {attr_name}\n\n"

        # Méthodes
        for method in methods:
            method_name = method['name']
            visibility = method.get('visibility', 'public')
            if visibility == 'private':
                code += f"    def __{method_name}(self):\n"
            elif visibility == 'protected':
                code += f"    def _{method_name}(self):\n"
            else:
                code += f"    def {method_name}(self):\n"
            code += f"        pass\n\n"

        return code

    def _default_value(self, attr_type):
        defaults = {
            'String': '""',
            'str': '""',
            'int': '0',
            'Integer': '0',
            'float': '0.0',
            'Float': '0.0',
            'bool': 'False',
            'Boolean': 'False',
            'List': '[]',
            'Dict': '{}',
        }
        return defaults.get(attr_type, 'None')
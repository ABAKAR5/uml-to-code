class FlaskServerGenerator:
    def __init__(self, classes):
        self.classes = classes

    def generate(self):
        code = "from flask import Flask, jsonify, request\n\n"
        code += "app = Flask(__name__)\n\n"

        # Données en mémoire pour chaque classe
        for cls in self.classes:
            name = cls['name'].lower()
            code += f"# Stockage en mémoire pour {cls['name']}\n"
            code += f"{name}_list = []\n"
            code += f"{name}_counter = 1\n\n"

        # Routes pour chaque classe
        for cls in self.classes:
            code += self._generate_routes(cls)

        code += "\nif __name__ == '__main__':\n"
        code += "    app.run(debug=True, port=5001)\n"
        return code

    def _generate_routes(self, cls):
        name = cls['name']
        name_lower = name.lower()
        code = f"# ── Routes pour {name} ──\n\n"

        # GET ALL
        code += f"@app.route('/{name_lower}s', methods=['GET'])\n"
        code += f"def get_{name_lower}s():\n"
        code += f"    return jsonify({name_lower}_list), 200\n\n"

        # GET BY ID
        code += f"@app.route('/{name_lower}s/<int:id>', methods=['GET'])\n"
        code += f"def get_{name_lower}(id):\n"
        code += f"    item = next((x for x in {name_lower}_list if x['id'] == id), None)\n"
        code += f"    if item:\n"
        code += f"        return jsonify(item), 200\n"
        code += f"    return jsonify({{'error': '{name} non trouvé'}}), 404\n\n"

        # POST
        code += f"@app.route('/{name_lower}s', methods=['POST'])\n"
        code += f"def create_{name_lower}():\n"
        code += f"    global {name_lower}_counter\n"
        code += f"    data = request.get_json()\n"
        code += f"    data['id'] = {name_lower}_counter\n"
        code += f"    {name_lower}_counter += 1\n"
        code += f"    {name_lower}_list.append(data)\n"
        code += f"    return jsonify(data), 201\n\n"

        # PUT
        code += f"@app.route('/{name_lower}s/<int:id>', methods=['PUT'])\n"
        code += f"def update_{name_lower}(id):\n"
        code += f"    data = request.get_json()\n"
        code += f"    for i, item in enumerate({name_lower}_list):\n"
        code += f"        if item['id'] == id:\n"
        code += f"            {name_lower}_list[i].update(data)\n"
        code += f"            return jsonify({name_lower}_list[i]), 200\n"
        code += f"    return jsonify({{'error': '{name} non trouvé'}}), 404\n\n"

        # DELETE
        code += f"@app.route('/{name_lower}s/<int:id>', methods=['DELETE'])\n"
        code += f"def delete_{name_lower}(id):\n"
        code += f"    global {name_lower}_list\n"
        code += f"    {name_lower}_list = [x for x in {name_lower}_list if x['id'] != id]\n"
        code += f"    return jsonify({{'message': '{name} supprimé'}}), 200\n\n"

        return code
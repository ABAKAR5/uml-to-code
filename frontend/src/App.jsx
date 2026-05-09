import { useState } from "react"
import axios from "axios"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import "./App.css"

function App() {
  const [file, setFile] = useState(null)
  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [classesFound, setClassesFound] = useState(0)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError("")
    setCode("")
  }

  const handleGenerate = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier !")
      return
    }

    setLoading(true)
    setError("")
    setCode("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("language", language)

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      setCode(response.data.code)
      setClassesFound(response.data.classes_found || 0)
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la génération")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert("Code copié !")
  }

  const handleDownload = () => {
    const ext = language === "python" ? "py" : "php"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated_code.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <h1>🔄 UML-to-Code</h1>
        <p>Convertissez vos diagrammes UML en code grâce à l'IA</p>
      </header>

      {/* MAIN */}
      <main className="main">
        {/* UPLOAD ZONE */}
        <div className="card">
          <h2>📂 Charger un diagramme UML</h2>

          <div className="upload-zone">
            <input
              type="file"
              accept=".xmi,.png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
              id="file-input"
            />
            <label htmlFor="file-input">
              {file ? `✅ ${file.name}` : "Cliquez ou glissez un fichier XMI, Image ou PDF"}
            </label>
          </div>

          <div className="options">
            <label>Langage cible :</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="python">🐍 Python</option>
              <option value="php">🐘 PHP</option>
            </select>
          </div>

          <button
            className="btn-generate"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "⏳ Génération en cours..." : "⚡ Générer le code"}
          </button>

          {error && <div className="error">❌ {error}</div>}
        </div>

        {/* CODE VIEWER */}
        {code && (
          <div className="card">
            <div className="code-header">
              <h2>
                💻 Code généré
                {classesFound > 0 && (
                  <span className="badge">{classesFound} classe(s)</span>
                )}
              </h2>
              <div className="toolbar">
                <button className="btn-copy" onClick={handleCopy}>
                  📋 Copier
                </button>
                <button className="btn-download" onClick={handleDownload}>
                  💾 Télécharger
                </button>
              </div>
            </div>
            <SyntaxHighlighter
              language={language === "python" ? "python" : "php"}
              style={atomOneDark}
              showLineNumbers={true}
              customStyle={{ borderRadius: "8px", fontSize: "14px" }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>UML-to-Code — Projet GL3 INSTA Abéché 2026 — Abakar</p>
      </footer>
    </div>
  )
}

export default App
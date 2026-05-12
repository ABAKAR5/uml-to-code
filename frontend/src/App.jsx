import { useState, useRef } from "react"
import axios from "axios"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import "./App.css"


function App() {
  const [file, setFile] = useState(null)
  const [language, setLanguage] = useState("python")
  const [useAi, setUseAi] = useState(false)
  const [code, setCode] = useState("")
  const [serverCode, setServerCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [classesFound, setClassesFound] = useState(0)
  const [activeTab, setActiveTab] = useState("code")
  const [dragOver, setDragOver] = useState(false)
  const [aiUsed, setAiUsed] = useState(false)
  const fileInputRef = useRef(null)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [preview, setPreview] = useState(null)
  const [genTime, setGenTime] = useState(0)
  const [methodsFound, setMethodsFound] = useState(0)
  

  const handleFileChange = (e) => {
  const f = e.target.files[0]
  if (f) {
    setFile(f); setError(""); setCode(""); setServerCode("")
    // Aperçu pour images
    const ext = f.name.split(".").pop().toLowerCase()
    if (["png", "jpg", "jpeg"].includes(ext)) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }
}

  const handleDrop = (e) => {
  e.preventDefault()
  setDragOver(false)
  const f = e.dataTransfer.files[0]
  if (f) {
    setFile(f); setError(""); setCode(""); setServerCode("")
    const ext = f.name.split(".").pop().toLowerCase()
    if (["png", "jpg", "jpeg"].includes(ext)) {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }
}
  const handleGenerate = async () => {
    if (!file) { setError("Veuillez sélectionner un fichier !"); return }
    
    const startTime = Date.now()
    setLoading(true); setError(""); setCode(""); setServerCode("")
    setCurrentStep(0)

    const stepsConfig = [
      { label: "📤 Upload du fichier...", duration: 500 },
      { label: "🔍 Détection du format...", duration: 800 },
      { label: file.name.endsWith('.xmi') ? "⚙️ Parsing XMI..." : "🖼️ Analyse visuelle IA...", duration: 1000 },
      { label: "🧠 Extraction des classes...", duration: 800 },
      { label: "✨ Génération du code...", duration: 1200 },
      { label: "🌐 Création du serveur Flask...", duration: 600 },
      { label: "✅ Finalisation...", duration: 400 },
    ]
    setSteps(stepsConfig)

    for (let i = 0; i < stepsConfig.length - 1; i++) {
      setCurrentStep(i)
      await new Promise(r => setTimeout(r, stepsConfig[i].duration))
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("language", language)
    formData.append("use_ai", useAi.toString())

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setCurrentStep(stepsConfig.length - 1)
      await new Promise(r => setTimeout(r, 400))
      setCode(res.data.code || "")
      setServerCode(res.data.server_code || "")
      setClassesFound(res.data.classes_found || 0)
      setAiUsed(res.data.ai_used || false)
      setGenTime(((Date.now() - startTime) / 1000).toFixed(1))
      const codeText = res.data.code || ""
      const methods = (codeText.match(/def |function /g) || []).length
      setMethodsFound(methods)
      setActiveTab("code")
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la génération")
    } finally {
      setLoading(false)
      setCurrentStep(-1)
      setSteps([])
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    // Flash effect handled by CSS
  }

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }
  const handleDownloadZip = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/download-zip",
        { code, server_code: serverCode, language },
        { responseType: 'blob' }
      )
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a")
      a.href = url
      a.download = `uml_project_${language}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError("Erreur lors de la création du ZIP")
    }
  }

  const getFileIcon = () => {
    if (!file) return "📁"
    const ext = file.name.split(".").pop().toLowerCase()
    if (ext === "xmi") return "🗂️"
    if (["png", "jpg", "jpeg"].includes(ext)) return "🖼️"
    if (ext === "pdf") return "📄"
    return "📁"
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="app">
      {/* ── NAVBAR ── */}
      {/* ── NAVBAR ── */}
<nav className="navbar">
  <div className="nav-brand">
    <img src="/logo.png" alt="UML-to-Code" className="nav-logo"
      onError={(e) => { e.target.style.display = 'none' }} />
    <span className="nav-title">UML<span className="accent">to</span>Code</span>
  </div>

  <div className="nav-menu">
    <a href="#home" className="nav-item">🏠 Home</a>
    <a href="#features" className="nav-item">⚡ Features</a>
    <a href="#app" className="nav-item">🚀 Demo</a>
    <a href="#docs" className="nav-item">📚 Docs</a>
    <a href="#about" className="nav-item">👤 About</a>
  </div>

  <div className="nav-links">
    <a href="https://github.com/ABAKAR5/uml-to-code" target="_blank" className="nav-link">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      GitHub
    </a>
    <span className="nav-badge">v1.0</span>
    <a href="#app" className="nav-try">🚀 Try Now</a>
  </div>
</nav>

    

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">✨ Propulsé par Groq AI · Llama 3.3</div>
          <h1 className="hero-title">
            Transformez vos <span className="gradient-text">diagrammes UML</span>
            <br />en code fonctionnel
          </h1>
          <p className="hero-desc">
            Uploadez un fichier XMI, une image ou un PDF — notre IA analyse votre
            diagramme de classes et génère instantanément du code Python ou PHP
            prêt à l'emploi, avec un serveur Flask automatique.
          </p>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">3</span><span className="stat-label">Formats supportés</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">2</span><span className="stat-label">Langages générés</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Open Source</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-preview">
            <div className="code-preview-header">
              <span className="dot red"/><span className="dot yellow"/><span className="dot green"/>
              <span className="code-preview-title">generated_code.py</span>
            </div>
            <pre className="code-preview-body">{`class Etudiant:
  def __init__(self):
    self.__nom = ""
    self.__age = 0

  def get_nom(self):
    return self.__nom

  def set_nom(self, nom):
    self.__nom = nom`}</pre>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🗂️</div>
          <h3>XMI / StarUML</h3>
          <p>Parsing intelligent des fichiers XMI avec extraction des classes, attributs, méthodes et relations d'héritage.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🖼️</div>
          <h3>Image PNG/JPG</h3>
          <p>Vision IA avancée — analysez vos captures d'écran de diagrammes UML directement sans export.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Fichier PDF</h3>
          <p>Extraction automatique de la première page PDF, conversion et analyse par l'IA en une seule étape.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Serveur Flask Auto</h3>
          <p>En plus du code des classes, l'outil génère automatiquement un serveur Flask avec toutes les routes CRUD.</p>
        </div>
      </section>

      {/* ── DOCS SECTION ── */}
<section className="docs-section" id="docs">
  <div className="docs-content">
    <h2>📚 Documentation</h2>
    <p>Tout ce que vous devez savoir pour utiliser UML-to-Code</p>
    <div className="docs-grid">
      <div className="doc-card">
        <h3>🗂️ Formats supportés</h3>
        <ul>
          <li><span className="badge-blue">XMI</span> Export StarUML — parsing complet</li>
          <li><span className="badge-blue">PNG/JPG</span> Image diagramme — vision IA</li>
          <li><span className="badge-blue">PDF</span> Document PDF — extraction auto</li>
        </ul>
      </div>
      <div className="doc-card">
        <h3>⚙️ Modes de génération</h3>
        <ul>
          <li><span className="badge-green">Algorithmique</span> Parsing XMI déterministe</li>
          <li><span className="badge-purple">IA Groq</span> Llama 3.3 — code intelligent</li>
        </ul>
      </div>
      <div className="doc-card">
        <h3>💻 Langages générés</h3>
        <ul>
          <li><span className="badge-blue">Python</span> Classes + getters/setters</li>
          <li><span className="badge-purple">PHP</span> Classes + constructeur</li>
          <li><span className="badge-green">Flask</span> Serveur API + routes CRUD</li>
        </ul>
      </div>
      <div className="doc-card">
        <h3>🚀 Workflow</h3>
        <ol>
          <li>Uploadez votre diagramme UML</li>
          <li>Choisissez le langage cible</li>
          <li>Sélectionnez le mode de génération</li>
          <li>Cliquez sur Générer</li>
          <li>Téléchargez le ZIP complet</li>
        </ol>
      </div>
    </div>
  </div>
</section>

      {/* ── MAIN APP ── */}
      <section className="main-app" id="app">
        <div className="main-app-header">
          <h2>🚀 Générer votre code</h2>
          <p>Chargez votre diagramme et obtenez le code en quelques secondes</p>
        </div>

        <div className="app-layout">
          {/* ── PANNEAU GAUCHE ── */}
          <div className="left-panel">
            <div className="panel-card">
              <h3 className="panel-title">📂 Fichier d'entrée</h3>

              {/* Upload Zone */}
             <div
                  className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xmi,.png,.jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-input-main"
                  />
                  {file ? (
                    <div className="file-info">
                      <div className="file-icon-big">{getFileIcon()}</div>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                      <button className="file-remove" onClick={(e) => {
                        e.stopPropagation()
                        setFile(null); setCode(""); setServerCode("")
                      }}>✕</button>
                    </div>
                  ) : (
                    <label htmlFor="file-input-main" style={{cursor:'pointer', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}>
                      <div className="upload-icon">⬆️</div>
                      <p className="upload-text">Glissez-déposez votre fichier ici</p>
                      <p className="upload-hint">ou cliquez pour parcourir</p>
                      <div className="upload-formats">
                        <span className="format-badge">XMI</span>
                        <span className="format-badge">PNG</span>
                        <span className="format-badge">JPG</span>
                        <span className="format-badge">PDF</span>
                      </div>
                    </label>
                  )}
                </div>

                                {/* Aperçu du diagramme */}
            {preview && (
              <div className="preview-container">
                <div className="preview-header">
                  <span>👁️ Aperçu du diagramme</span>
                  <button className="preview-close" onClick={() => setPreview(null)}>✕</button>
                </div>
                <img src={preview} alt="Aperçu diagramme" className="preview-img" />
              </div>
            )}

              {/* Options */}
              <div className="options-grid">
                <div className="option-group">
                  <label className="option-label">🎯 Langage cible</label>
                  <div className="option-buttons">
                    <button
                      className={`opt-btn ${language === 'python' ? 'active' : ''}`}
                      onClick={() => setLanguage('python')}
                    >🐍 Python</button>
                    <button
                      className={`opt-btn ${language === 'php' ? 'active' : ''}`}
                      onClick={() => setLanguage('php')}
                    >🐘 PHP</button>
                  </div>
                </div>

                <div className="option-group">
                  <label className="option-label">🤖 Mode de génération</label>
                  <div className="option-buttons">
                    <button
                      className={`opt-btn ${!useAi ? 'active' : ''}`}
                      onClick={() => setUseAi(false)}
                    >⚙️ Algorithmique</button>
                    <button
                      className={`opt-btn ${useAi ? 'active ai' : ''}`}
                      onClick={() => setUseAi(true)}
                    >✨ IA Groq</button>
                  </div>
                </div>
              </div>

              {/* Mode description */}
              <div className="mode-info">
                {useAi ? (
                  <p>✨ <strong>Mode IA :</strong> Groq Llama 3.3 analyse votre diagramme et génère un code intelligent et contextuel.</p>
                ) : (
                  <p>⚙️ <strong>Mode Algorithmique :</strong> Parsing XMI déterministe, rapide et précis — idéal pour les fichiers XMI.</p>
                )}
              </div>
                {/* Barre de progression */}
{loading && steps.length > 0 && (
  <div className="progress-container">
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      />
    </div>
    <div className="progress-steps">
      {steps.map((step, i) => (
        <div key={i} className={`progress-step ${i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending'}`}>
          <span className="step-icon">{i < currentStep ? '✅' : i === currentStep ? '⏳' : '⬜'}</span>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  </div>
)}
              {/* Generate Button */}
              <button
                className={`btn-generate ${loading ? 'loading' : ''}`}
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner"/>{useAi ? "L'IA analyse votre diagramme..." : "Génération en cours..."}</>
                ) : (
                  <>⚡ Générer le code</>
                )}
              </button>

              {error && (
                <div className="error-box">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Info box */}
              {!code && !loading && (
                <div className="info-box">
                  <p>💡 <strong>Conseil :</strong> Pour de meilleurs résultats avec le mode IA, utilisez des images claires de diagrammes UML avec des classes bien visibles.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── PANNEAU DROITE ── */}
          <div className="right-panel">
            {code ? (
              <div className="panel-card result-card">
                {/* Tabs */}
                <div className="result-header">
                  <div className="tabs">
                    <button
                      className={`tab ${activeTab === 'code' ? 'active' : ''}`}
                      onClick={() => setActiveTab('code')}
                    >
                      💻 Code {language === 'python' ? 'Python' : 'PHP'}
                      {classesFound > 0 && <span className="tab-badge">{classesFound}</span>}
                    </button>
                    {serverCode && (
                      <button
                        className={`tab ${activeTab === 'server' ? 'active' : ''}`}
                        onClick={() => setActiveTab('server')}
                      >
                        🌐 Serveur Flask
                      </button>
                    )}
                  </div>
                  <div className="result-actions">
                    {aiUsed && <span className="ai-badge">✨ IA</span>}
                    <button className="action-btn copy-btn" onClick={() => handleCopy(activeTab === 'code' ? code : serverCode)}>
                      📋 Copier
                    </button>
                    <button className="action-btn zip-btn" onClick={handleDownloadZip}>
                      📦 Télécharger ZIP
                      </button>
                    <button className="action-btn download-btn" onClick={() => {
                      const ext = activeTab === 'server' ? 'py' : language === 'python' ? 'py' : 'php'
                      const name = activeTab === 'server' ? 'server.py' : `generated.${ext}`
                      handleDownload(activeTab === 'code' ? code : serverCode, name)
                    }}>
                      💾 Télécharger
                    </button>
                  </div>
                </div>

                {/* Code display */}
                <div className="code-container">
                <pre className="code-block">
                <code>{activeTab === 'code' ? code : serverCode}</code>
                </pre>
                </div>

                {/* Stats */}
                            <div className="code-stats">
              <span>📏 {(activeTab === 'code' ? code : serverCode).split('\n').length} lignes</span>
              <span>📦 {(activeTab === 'code' ? code : serverCode).length} caractères</span>
              {classesFound > 0 && <span>🏗️ {classesFound} classe(s)</span>}
              {methodsFound > 0 && <span>⚙️ {methodsFound} méthode(s)</span>}
              {genTime > 0 && <span>⚡ {genTime}s</span>}
              {aiUsed && <span>🤖 IA Groq</span>}
            </div>
              </div>
            ) : (
              <div className="panel-card empty-panel">
                <div className="empty-content">
                  <div className="empty-icon">🔄</div>
                  <h3>Votre code apparaîtra ici</h3>
                  <p>Chargez un diagramme UML et cliquez sur <strong>Générer le code</strong> pour commencer.</p>
                  <div className="empty-steps">
                    <div className="step"><span className="step-num">1</span><span>Uploadez votre fichier XMI, image ou PDF</span></div>
                    <div className="step"><span className="step-num">2</span><span>Choisissez le langage et le mode</span></div>
                    <div className="step"><span className="step-num">3</span><span>Cliquez sur Générer et obtenez votre code</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


{/* About — ajoute cette section avant le footer */}
<section className="about-section" id="about">
  <div className="about-content">
    <h2>👤 À propos du projet</h2>
    <p>UML-to-Code est un projet académique développé dans le cadre de la formation en Génie Logiciel à l'INSTA Abéché, Tchad.</p>
    <div className="about-grid">
      <div className="about-card">
        <span className="about-icon">🎓</span>
        <h3>Contexte académique</h3>
        <p>Projet Personnelle et Professionelle  — GL3 — INSTA Abéché 2026</p>
      </div>
      <div className="about-card">
        <span className="about-icon">🛠️</span>
        <h3>Technologies</h3>
        <p>React.js · Python Flask · Groq AI · Llama 3.3</p>
      </div>
      <div className="about-card">
        <span className="about-icon">🎯</span>
        <h3>Objectif</h3>
        <p>Automatiser la transformation de diagrammes UML en code fonctionnel grâce à l'IA</p>
      </div>
      <div className="about-card">
        <span className="about-icon">👨‍💻</span>
        <h3>Développeur</h3>
        <p>Abakar Mahamat Brahim <strong>(ABVIP)</strong>— Étudiant GL3 INSTA Abéché</p>
      </div>
    </div>
  </div>
</section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-title">UML-to-Code</span>
            <span className="footer-sub">Projet GL3 — INSTA Abéché 2026</span>
          </div>
          <div className="footer-info">
            <span>Développé par <strong>Abakar</strong></span>
            <span>•</span>
            <span>Génie Logiciel 3ème année</span>
            <span>•</span>
            <a href="https://github.com/ABAKAR5/uml-to-code" target="_blank">GitHub</a>
          </div>
          <div className="footer-tech">
            <span className="tech-tag">React</span>
            <span className="tech-tag">Flask</span>
            <span className="tech-tag">Groq AI</span>
            <span className="tech-tag">Python</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

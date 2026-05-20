import { useState, useRef, useEffect, useCallback } from "react"
import axios from "axios"
import Editor from "@monaco-editor/react"
import "./App.css"

import {
  FaHome, FaBolt, FaListUl, FaRocket, FaUserCircle,
  FaCloudUploadAlt, FaCog, FaBrain, FaCube, FaDownload,
  FaCopy, FaChevronRight, FaInfoCircle, FaCheckCircle,
  FaExclamationCircle, FaImage, FaFileAlt, FaBook,
  FaCode, FaTerminal, FaFolder, FaChartBar, FaThLarge,
  FaGithub, FaPython, FaPhp, FaRobot, FaTimes, FaGraduationCap,
  FaTools, FaMagic, FaMousePointer, FaCubes
} from "react-icons/fa";

// ── TOAST SYSTEM ──
let _toastId = 0
function useToast() {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = "success") => {
    const id = ++_toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])
  return { toasts, addToast }
}
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === "success" ? <FaCheckCircle size={20} /> : t.type === "error" ? <FaExclamationCircle size={20} /> : <FaInfoCircle size={20} />}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const { toasts, addToast } = useToast()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('uml_history')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('uml_history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const saveToHistory = (codeData) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      filename: file ? file.name : "Diagramme",
      language: language,
      code: codeData.code,
      server: codeData.server,
      classes: codeData.classes,
      methods: codeData.methods,
      useAi: useAi
    }
    setHistory(prev => [newEntry, ...prev].slice(0, 10))
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
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

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
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
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setCurrentStep(stepsConfig.length - 1)
      await new Promise(r => setTimeout(r, 400))

      const data = res.data
      setCode(data.code || "")
      setServerCode(data.server_code || "")
      setClassesFound(data.classes_found || 0)
      setAiUsed(data.ai_used || false)
      setGenTime(((Date.now() - startTime) / 1000).toFixed(1))

      const codeText = data.code || ""
      const methods = (codeText.match(/def |function /g) || []).length
      setMethodsFound(methods)
      setActiveTab("code")

      saveToHistory({
        code: data.code,
        server: data.server_code,
        classes: data.classes_found,
        methods: methods
      })

      addToast("Code généré avec succès !", "success")
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la génération")
    } finally {
      setLoading(false); setCurrentStep(-1); setSteps([])
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    addToast("Code copié dans le presse-papier !", "success")
  }

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
    addToast(`Fichier ${filename} téléchargé !`, "success")
  }

  const handleDownloadZip = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/download-zip`,
        { code, server_code: serverCode, language },
        { responseType: "blob" }
      )
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a")
      a.href = url; a.download = `uml_project_${Date.now()}.zip`; a.click()
      URL.revokeObjectURL(url)
      addToast("Projet ZIP téléchargé !", "success")
    } catch (err) {
      addToast("Erreur lors du téléchargement ZIP", "error")
    }
  }

  const getFileIcon = () => {
    if (!file) return <FaFolder />
    const ext = file.name.split(".").pop().toLowerCase()
    if (ext === "xmi") return <FaCode />
    if (["png", "jpg", "jpeg"].includes(ext)) return <FaImage />
    if (ext === "pdf") return <FaFileAlt />
    return <FaFolder />
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="app">
      <ToastContainer toasts={toasts} />

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <div className="nav-logo-icon"><FaCubes /></div>
          <span className="nav-title">UML TO <span className="accent">CODE</span></span>
        </div>
        <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" className="nav-item" onClick={() => setMobileMenuOpen(false)}><FaHome className="nav-icon" /> Home</a>
          <a href="#features" className="nav-item" onClick={() => setMobileMenuOpen(false)}><FaBolt className="nav-icon" /> Features</a>
          <a href="#how" className="nav-item" onClick={() => setMobileMenuOpen(false)}><FaListUl className="nav-icon" /> Workflow</a>
          <a href="#demo" className="nav-item" onClick={() => setMobileMenuOpen(false)}><FaRocket className="nav-icon" /> Demo</a>
          <a href="#about" className="nav-item" onClick={() => setMobileMenuOpen(false)}><FaUserCircle className="nav-icon" /> About</a>
        </div>
        <div className="nav-links">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer de thème">
            {theme === 'dark' ? <FaMagic /> : <FaBolt />}
          </button>
          <a href="https://github.com/ABAKAR5/uml-to-code" target="_blank" className="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="github-text">GitHub</span>
          </a>
          <span className="nav-badge">v1.0</span>
          <a href="#demo" className="nav-try">🚀 Try Now</a>
          <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className={`ham-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`ham-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`ham-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-orb orb-1"></div>
        <div className="hero-orb orb-2"></div>
        <div className="hero-orb orb-3"></div>
        <div className="hero-content">
          <div className="hero-tag">
            <span className="tag-dot"></span>
            <FaMagic /> Propulsé par Groq AI · Llama 3.3-70b
          </div>
          <h1 className="hero-title">
            Transformez vos <span className="gradient-text">diagrammes UML</span>
            <br />en code fonctionnel
          </h1>
          <p className="hero-desc">
            Uploadez un fichier XMI, une image ou un PDF — notre IA analyse votre
            diagramme de classes et génère instantanément du code Python ou PHP
            prêt à l'emploi, avec un serveur Flask automatique.
          </p>
          <div className="hero-cta">
            <a href="#demo" className="cta-primary"><FaBolt /> Générer maintenant</a>
            <a href="https://github.com/ABAKAR5/uml-to-code" target="_blank" className="cta-secondary"><FaRocket /> GitHub</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">3</span><span className="stat-label">Formats supportés</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">2</span><span className="stat-label">Langages générés</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Open Source</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-preview">
            <div className="code-preview-header">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span className="code-preview-title">generated_code.py</span>
              <span className="code-preview-lang">Python</span>
            </div>
            <pre className="code-preview-body">{`class Etudiant:
    """Etudiant class"""
    def __init__(self):
        self.__nom = ""
        self.__age = 0

    def get_nom(self):
        return self.__nom

    def set_nom(self, nom):
        self.__nom = nom`}</pre>
          </div>
          <div className="hero-badge-float">
            <span><FaRobot /></span>
            <div>
              <div className="hbf-title">IA Groq Llama 3.3</div>
              <div className="hbf-sub">Génération en ~2s</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="section-header">
          <div className="section-tag">⚡ Capacités</div>
          <h2>Tout ce dont vous avez besoin</h2>
          <p>Une solution complète pour transformer vos diagrammes UML en code prêt à déployer</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <span className="feature-icon"><FaCode /></span>
            </div>
            <h3>XMI / StarUML</h3>
            <p>Parsing intelligent des fichiers XMI avec extraction complète des classes, attributs et relations.</p>
            <div className="feature-tag">Parsing déterministe</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <span className="feature-icon"><FaImage /></span>
            </div>
            <h3>Image PNG/JPG</h3>
            <p>Vision IA avancée — analysez vos diagrammes depuis une simple capture d'écran.</p>
            <div className="feature-tag">Vision IA</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <span className="feature-icon"><FaFileAlt /></span>
            </div>
            <h3>Fichier PDF</h3>
            <p>Extraction automatique et analyse par l'IA en une seule étape depuis vos documents PDF.</p>
            <div className="feature-tag">Auto-extraction</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="feature-icon"><FaBolt /></span>
            </div>
            <h3>Serveur Flask Auto</h3>
            <p>Génère automatiquement un serveur Flask complet avec toutes les routes CRUD.</p>
            <div className="feature-tag">Routes CRUD</div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div className="how-content">
          <div className="section-header">
            <div className="section-tag">📋 Workflow</div>
            <h2>Comment ça marche ?</h2>
            <p>4 étapes simples pour transformer votre diagramme en code fonctionnel</p>
          </div>
          <div className="how-steps">
            <div className="how-step">
              <div className="how-num">01</div>
              <div className="how-icon"><FaCloudUploadAlt /></div>
              <h3>Uploadez</h3>
              <p>Glissez-déposez votre fichier XMI, image ou PDF dans la zone d'upload.</p>
              <div className="how-arrow"><FaChevronRight /></div>
            </div>
            <div className="how-step">
              <div className="how-num">02</div>
              <div className="how-icon"><FaCog /></div>
              <h3>Choisissez</h3>
              <p>Sélectionnez Python ou PHP et optez pour le mode Algorithmique ou IA.</p>
              <div className="how-arrow"><FaChevronRight /></div>
            </div>
            <div className="how-step">
              <div className="how-num">03</div>
              <div className="how-icon"><FaBrain /></div>
              <h3>Analysez</h3>
              <p>Notre système génère le code source complet avec toutes les classes.</p>
              <div className="how-arrow"><FaChevronRight /></div>
            </div>
            <div className="how-step">
              <div className="how-num">04</div>
              <div className="how-icon"><FaCube /></div>
              <h3>Téléchargez</h3>
              <p>Récupérez le code et le serveur Flask en archive ZIP prête à l'emploi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCS SECTION ── */}
      <section className="docs-section" id="docs">
        <div className="docs-content">
          <h2><FaBook /> Documentation</h2>
          <div className="docs-grid">
            <div className="doc-card">
              <h3><FaCode /> Formats</h3>
              <ul>
                <li><span className="badge-blue">XMI</span> Export StarUML</li>
                <li><span className="badge-blue">PNG/JPG</span> Image vision</li>
                <li><span className="badge-blue">PDF</span> Document PDF</li>
              </ul>
            </div>
            <div className="doc-card">
              <h3><FaCog /> Modes</h3>
              <ul>
                <li><span className="badge-green">Algorithmique</span> Rapide</li>
                <li><span className="badge-purple">IA Groq</span> Intelligent</li>
              </ul>
            </div>
            <div className="doc-card">
              <h3><FaCode /> Langages</h3>
              <ul>
                <li><span className="badge-blue">Python</span> Classes POO</li>
                <li><span className="badge-purple">PHP</span> Classes POO</li>
                <li><span className="badge-green">Flask</span> API REST</li>
              </ul>
            </div>
            <div className="doc-card">
              <h3><FaRocket /> Workflow</h3>
              <ol>
                <li>Upload UML</li>
                <li>Choix Langage</li>
                <li>Génération</li>
                <li>Download ZIP</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN APP ── */}
      <section className="main-app" id="demo">
        <div className="main-app-header">
          <h2><FaRocket /> Générer votre code</h2>
          <p>Chargez votre diagramme et obtenez le code en quelques secondes</p>
        </div>

        <div className="app-layout">
          <div className="left-panel">
            <div className="panel-card">
              <h3 className="panel-title">📂 Fichier d'entrée</h3>
              <div className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}>
                <input ref={fileInputRef} type="file" accept=".xmi,.png,.jpg,.jpeg,.pdf" onChange={handleFileChange} style={{ display: 'none' }} id="f-in" />
                {file ? (
                  <div className="file-info">
                    <div className="file-icon-big">{getFileIcon()}</div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button className="file-remove" onClick={() => { setFile(null); setCode(""); setServerCode(""); setPreview(null) }}>✕</button>
                  </div>
                ) : (
                  <label htmlFor="f-in" style={{ cursor: 'pointer', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="upload-icon"><FaCloudUploadAlt /></div>
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

              {preview && (
                <div className="preview-container">
                  <div className="preview-header">
                    <span><FaMousePointer /> Aperçu du diagramme</span>
                    <button className="preview-close" onClick={() => setPreview(null)}><FaTimes /></button>
                  </div>
                  <img src={preview} alt="Aperçu" className="preview-img" />
                </div>
              )}

              <div className="options-grid">
                <div className="option-group">
                  <label className="option-label"><FaTerminal /> Langage cible</label>
                  <div className="option-buttons">
                    <button className={`opt-btn ${language === 'python' ? 'active' : ''}`} onClick={() => setLanguage('python')}><FaPython /> Python</button>
                    <button className={`opt-btn ${language === 'php' ? 'active' : ''}`} onClick={() => setLanguage('php')}><FaPhp /> PHP</button>
                  </div>
                </div>
                <div className="option-group">
                  <label className="option-label"><FaCog /> Mode de génération</label>
                  <div className="option-buttons">
                    <button className={`opt-btn ${!useAi ? 'active' : ''}`} onClick={() => setUseAi(false)}><FaCog /> Algo</button>
                    <button className={`opt-btn ${useAi ? 'active ai' : ''}`} onClick={() => setUseAi(true)}><FaMagic /> IA Groq</button>
                  </div>
                </div>
              </div>

              <div className="mode-info">
                {useAi ? (
                  <p>✨ <strong>Mode IA :</strong> Groq Llama 3.3 analyse votre diagramme intelligemment.</p>
                ) : (
                  <p>⚙️ <strong>Mode Algo :</strong> Parsing XMI déterministe et précis.</p>
                )}
              </div>

              {loading && steps.length > 0 && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
                  </div>
                  <div className="current-step-label">
                    <span className="spinner-small" /> {steps[currentStep]?.label}
                  </div>
                </div>
              )}

              <button className={`btn-generate ${loading ? 'loading' : ''}`} onClick={handleGenerate} disabled={loading}>
                {loading ? <span className="spinner" /> : <><FaBolt /> Générer le code</>}
              </button>
              {error && <div className="error-box"><FaExclamationCircle /> {error}</div>}
            </div>
          </div>

          <div className="right-panel">
            {code ? (
              <div className="panel-card result-card">
                <div className="result-header">
                  <div className="tabs">
                    <button className={`tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>
                      <FaCode /> Code {language.toUpperCase()}
                      {classesFound > 0 && <span className="tab-badge">{classesFound}</span>}
                    </button>
                    {serverCode && (
                      <button className={`tab ${activeTab === 'server' ? 'active' : ''}`} onClick={() => setActiveTab('server')}>
                        <FaThLarge /> Serveur Flask
                      </button>
                    )}
                  </div>
                  <div className="result-actions">
                    <button className="action-btn" onClick={() => handleCopy(activeTab === 'code' ? code : serverCode)}><FaCopy /> Copier</button>
                    <button className="action-btn" onClick={handleDownloadZip}><FaCube /> ZIP</button>
                    <button className="action-btn" onClick={() => {
                      const ext = activeTab === 'server' ? 'py' : language === 'python' ? 'py' : 'php'
                      handleDownload(activeTab === 'code' ? code : serverCode, `generated.${ext}`)
                    }}><FaDownload /> Télécharger</button>
                  </div>
                </div>
                <div className="editor-container-main" style={{ borderRadius: '0 0 16px 16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <Editor
                    height="500px"
                    language={activeTab === 'server' ? 'python' : language}
                    theme="vs-dark"
                    value={activeTab === 'code' ? code : serverCode}
                    options={{ minimap: { enabled: true }, fontSize: 14, automaticLayout: true, padding: { top: 20, bottom: 20 } }}
                    onChange={(val) => activeTab === 'code' ? setCode(val) : setServerCode(val)}
                  />
                </div>
                <div className="code-stats">
                  <span>📏 {(activeTab === 'code' ? code : serverCode).split('\n').length} Lignes</span>
                  <span><FaThLarge /> {classesFound} Classes</span>
                  <span><FaBolt /> {genTime}s</span>
                  {aiUsed && <span className="ai-stat-badge"><FaRobot /> IA Groq</span>}
                </div>
              </div>
            ) : (
              <div className="panel-card empty-panel">
                <div className="empty-content">
                  <div className="empty-icon"><FaRocket /></div>
                  <h3>Votre code apparaîtra ici</h3>
                  <p>Uploadez un diagramme UML pour commencer.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {history.length > 0 && (
        <section className="history-section" id="history">
          <div className="history-content">
            <div className="section-header">
              <span className="section-tag"><FaListUl /> Archivage</span>
              <h2>Historique récent</h2>
            </div>
            <div className="history-grid">
              {history.map(item => (
                <div key={item.id} className="history-card" onClick={() => {
                  setCode(item.code); setServerCode(item.server); setLanguage(item.language);
                  setClassesFound(item.classes); setMethodsFound(item.methods); setAiUsed(item.useAi);
                  setGenTime("Archivé");
                  addToast("Projet chargé !", "info");
                  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
                }}>
                  <div className="h-card-header">
                    <span className="h-date">{item.date}</span>
                    <span className={`h-badge ${item.useAi ? 'ai' : 'algo'}`}>{item.useAi ? 'IA' : 'Algo'}</span>
                  </div>
                  <h4>{item.filename}</h4>
                  <div className="h-stats">
                    <span>{item.language.toUpperCase()}</span>
                    <span>{item.classes} Classes</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button className="clear-history" onClick={() => setHistory([])}>Effacer l'historique</button>
            </div>
          </div>
        </section>
      )}

      <section className="about-section" id="about">
        <div className="about-content">
          <h2><FaUserCircle /> À propos du projet</h2>
          <p>UML-to-Code est un projet académique développé à l'INSTA Abéché, Tchad.</p>
          <div className="about-grid">
            <div className="about-card">
              <span className="about-icon"><FaGraduationCap /></span>
              <h3>Formation</h3>
              <p>Génie Logiciel GL3 — INSTA 2026</p>
            </div>
            <div className="about-card">
              <span className="about-icon"><FaTools /></span>
              <h3>Technologies</h3>
              <p>React · Flask · Groq · Llama 3.3</p>
            </div>
            <div className="about-card">
              <span className="about-icon"><FaRocket /></span>
              <h3>Objectif</h3>
              <p>Automatisation UML vers Code</p>
            </div>
            <div className="about-card">
              <span className="about-icon"><FaUserCircle /></span>
              <h3>Développeur</h3>
              <p>Abakar Mahamat Brahim (ABVIP)</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">UML TO CODE</div>
          <p>© 2026 Tous droits réservés — ABVIP</p>
        </div>
      </footer>
    </div>
  )
}

export default App

import React, { useState, useEffect, useRef } from 'react'
import '../index.css'

// ─── LOCALIZATION ─────────────────────────────────────────────────
const translations = {
  en: {
    title: "Financial Workspace",
    netWorth: "NET WORTH", gopay: "GOPAY", cash: "CASH",
    income: "Income", expense: "Expense",
    budgetTracker: "MONTHLY BUDGET", limit: "Limit:", spent: "spent",
    overBudget: "Over Budget!", history: "Last 5 Transactions",
    addTransaction: "Add Transaction", txType: "Type",
    expenseOpt: "Expense", incomeOpt: "Income",
    description: "Description", placeholderDesc: "e.g. GoFood Nasi Goreng…",
    amount: "Amount", category: "Category", paymentSource: "Source",
    addBtn: "Add Transaction",
    detailedLogs: "Transaction Logs",
    thDate: "Date", thDesc: "Description", thCat: "Category",
    thSource: "Source", thAmount: "Amount", thAction: "",
    noRecords: "No transactions yet.",
    analytics: "Expense Analytics", chartTitle: "BY CATEGORY",
    noChartData: "Add expense records to see your spending breakdown.",
    totalOutflow: "Total Outflow:",
    savingsTitle: "Savings Goal", progressTitle: "PROGRESS",
    saved: "saved", completed: "Complete",
    setTarget: "Savings Target", currentSavings: "Current Savings",
    alertFill: "Please fill in description and amount.",
    navDashboard: "📊 Dashboard", navDetails: "📑 Logs",
    navCharts: "🍕 Analytics", navSavings: "💰 Savings",
    catFood: "Food & Drink", catTransport: "Transport",
    catBills: "Bills", catShopping: "Shopping",
    catSalary: "Income", catOthers: "Others"
  },
  id: {
    title: "Ruang Kerja Keuangan",
    netWorth: "KEKAYAAN BERSIH", gopay: "GOPAY", cash: "TUNAI",
    income: "Pemasukan", expense: "Pengeluaran",
    budgetTracker: "ANGGARAN BULANAN", limit: "Batas:", spent: "terpakai",
    overBudget: "Melebihi Anggaran!", history: "5 Transaksi Terakhir",
    addTransaction: "Tambah Transaksi", txType: "Jenis",
    expenseOpt: "Pengeluaran", incomeOpt: "Pemasukan",
    description: "Deskripsi", placeholderDesc: "mis. GoFood Nasi Goreng…",
    amount: "Jumlah", category: "Kategori", paymentSource: "Sumber",
    addBtn: "Tambah Transaksi",
    detailedLogs: "Log Transaksi",
    thDate: "Tanggal", thDesc: "Deskripsi", thCat: "Kategori",
    thSource: "Sumber", thAmount: "Jumlah", thAction: "",
    noRecords: "Belum ada transaksi.",
    analytics: "Analitik Pengeluaran", chartTitle: "PER KATEGORI",
    noChartData: "Tambahkan pengeluaran untuk melihat rincian keuangan.",
    totalOutflow: "Total Keluar:",
    savingsTitle: "Target Tabungan", progressTitle: "PROGRES",
    saved: "ditabung", completed: "Selesai",
    setTarget: "Target Tabungan", currentSavings: "Tabungan Sekarang",
    alertFill: "Silahkan isi deskripsi dan nominal uang.",
    navDashboard: "📊 Dasbor", navDetails: "📑 Log Detail",
    navCharts: "🍕 Analitik", navSavings: "💰 Target",
    catFood: "Makanan & Minum", catTransport: "Transportasi",
    catBills: "Tagihan", catShopping: "Belanja",
    catSalary: "Pemasukan", catOthers: "Lainnya"
  },
  fr: {
    title: "Espace Financier",
    netWorth: "VALEUR NETTE", gopay: "GOPAY", cash: "ESPÈCES",
    income: "Revenu", expense: "Dépense",
    budgetTracker: "BUDGET MENSUEL", limit: "Limite :", spent: "dépensé",
    overBudget: "Dépassement !", history: "5 Dernières Transactions",
    addTransaction: "Ajouter Transaction", txType: "Type",
    expenseOpt: "Dépense", incomeOpt: "Revenu",
    description: "Description", placeholderDesc: "ex. GoFood Nasi Goreng…",
    amount: "Montant", category: "Catégorie", paymentSource: "Source",
    addBtn: "Ajouter",
    detailedLogs: "Journal des Transactions",
    thDate: "Date", thDesc: "Description", thCat: "Catégorie",
    thSource: "Source", thAmount: "Montant", thAction: "",
    noRecords: "Aucune transaction.",
    analytics: "Analyse des Dépenses", chartTitle: "PAR CATÉGORIE",
    noChartData: "Ajoutez des dépenses pour voir votre répartition.",
    totalOutflow: "Total Sortant :",
    savingsTitle: "Objectif d'Épargne", progressTitle: "PROGRESSION",
    saved: "épargné", completed: "Complété",
    setTarget: "Objectif d'Épargne", currentSavings: "Épargne Actuelle",
    alertFill: "Veuillez remplir la description et le montant.",
    navDashboard: "📊 Tableau", navDetails: "📑 Journaux",
    navCharts: "🍕 Analyses", navSavings: "💰 Épargne",
    catFood: "Nourriture", catTransport: "Transport",
    catBills: "Factures", catShopping: "Shopping",
    catSalary: "Revenu", catOthers: "Autres"
  }
}

const LANG_META = {
  en: { flag: '🇬🇧', label: 'English' },
  id: { flag: '🇮🇩', label: 'Indonesia' },
  fr: { flag: '🇫🇷', label: 'Français' }
}

const CATEGORY_COLORS = {
  'Food & Beverage': '#e74c3c',
  'Transport / Ojol': '#3498db',
  'Bills & Utilities': '#f1c40f',
  'Shopping': '#9b59b6',
  'Salary / Income': '#2ecc71',
  'Others': '#95a5a6'
}

// ─── HELPERS ──────────────────────────────────────────────────────
const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(num)

const TRANSFER_KEYWORDS = ['top up','transfer','isi ulang','recharge']
const isTransfer = (text) =>
  TRANSFER_KEYWORDS.some(k => text.toLowerCase().includes(k))

// ─── COMPONENT ────────────────────────────────────────────────────
function App() {
  // form state
  const [text, setText]           = useState('')
  const [amount, setAmount]       = useState('')
  const [source, setSource]       = useState('Cash')
  const [category, setCategory]   = useState('Food & Beverage')
  const [txType, setTxType]       = useState('expense')

  // nav
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuOpen, setMenuOpen]   = useState(false)
  const [langOpen, setLangOpen]   = useState(false)

  // refs for outside-click detection
  const menuRef = useRef(null)
  const langRef = useRef(null)

  // persisted state
  const [lang, setLang] = useState(() => localStorage.getItem('language') || 'en')
  const [darkMode, setDarkMode] = useState(() => {
    const s = localStorage.getItem('darkMode')
    return s ? JSON.parse(s) : false
  })
  const [budgetLimit, setBudgetLimit] = useState(() => {
    const s = localStorage.getItem('budgetLimit')
    return s ? parseFloat(s) : 2000000
  })
  const [transactions, setTransactions] = useState(() => {
    const s = localStorage.getItem('transactions')
    return s ? JSON.parse(s) : []
  })
  const [savingsTarget, setSavingsTarget] = useState(() => {
    const s = localStorage.getItem('savingsTarget')
    return s ? parseFloat(s) : 5000000
  })
  const [currentSavings, setCurrentSavings] = useState(() => {
    const s = localStorage.getItem('currentSavings')
    return s ? parseFloat(s) : 0
  })

  // ── persistence effects
  useEffect(() => { localStorage.setItem('transactions', JSON.stringify(transactions)) }, [transactions])
  useEffect(() => { localStorage.setItem('budgetLimit', budgetLimit.toString()) }, [budgetLimit])
  useEffect(() => { localStorage.setItem('darkMode', JSON.stringify(darkMode)) }, [darkMode])
  useEffect(() => { localStorage.setItem('savingsTarget', savingsTarget.toString()) }, [savingsTarget])
  useEffect(() => { localStorage.setItem('currentSavings', currentSavings.toString()) }, [currentSavings])
  useEffect(() => { localStorage.setItem('language', lang) }, [lang])

  // ── apply dark class to body for CSS mesh bg
  useEffect(() => {
    document.body.classList.toggle('dark-body', darkMode)
  }, [darkMode])

  // ── close dropdowns on outside click
  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const t = translations[lang]

  // ── derived financials
  const allAmounts    = transactions.map(tx => tx.amount)
  const total         = allAmounts.reduce((a, b) => a + b, 0)
  const income        = allAmounts.filter(a => a > 0).reduce((a, b) => a + b, 0)
  const expense       = transactions
    .filter(tx => tx.amount < 0 && !isTransfer(tx.text))
    .reduce((a, tx) => a + Math.abs(tx.amount), 0)
  const goPayBalance  = transactions.filter(tx => tx.source === 'GoPay').reduce((a, tx) => a + tx.amount, 0)
  const cashBalance   = transactions.filter(tx => tx.source === 'Cash').reduce((a, tx) => a + tx.amount, 0)

  const categoryExpenses = transactions
    .filter(tx => tx.amount < 0 && !isTransfer(tx.text))
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount)
      return acc
    }, {})

  const totalExpenseForChart = Object.values(categoryExpenses).reduce((a, b) => a + b, 0)

  const getCategoryLabel = (key) => {
    const map = {
      'Food & Beverage': t.catFood,
      'Transport / Ojol': t.catTransport,
      'Bills & Utilities': t.catBills,
      'Shopping': t.catShopping,
      'Salary / Income': t.catSalary
    }
    return map[key] || t.catOthers
  }

  // ── actions
  const deleteTransaction = (id) =>
    setTransactions(transactions.filter(tx => tx.id !== id))

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || !amount.trim()) { alert(t.alertFill); return }
    const raw = parseFloat(amount)
    const finalAmount = txType === 'expense' ? -Math.abs(raw) : Math.abs(raw)
    const now = new Date()
    const date = now.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })
      + ' ' + now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
    setTransactions([...transactions, {
      id: Math.floor(Math.random() * 1e8),
      text, amount: finalAmount, source, category, date
    }])
    setText(''); setAmount('')
  }

  const navigateTo = (tab) => { setActiveTab(tab); setMenuOpen(false) }

  // ── theme values passed as inline styles where CSS vars can't reach
  const glassCard = {
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--glass-shadow)',
    borderRadius: 'var(--radius-md)',
  }

  const textColor    = darkMode ? '#e8e8f8' : '#1a1a2e'
  const subColor     = darkMode ? '#b0b0d0' : '#4a4a6a'
  const mutedColor   = darkMode ? '#6666aa' : '#8888aa'
  const borderColor  = darkMode ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.35)'
  const inputStyle   = {
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--glass-border)',
    color: textColor,
  }

  // ─── RENDER ───────────────────────────────────────────────────────
  return (
    <div className={`container${darkMode ? ' dark' : ''}`} style={{ color: textColor }}>

      {/* ── TOP BAR ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>

        {/* Nav burger */}
        <div ref={menuRef} style={{ position:'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Navigation menu"
            style={{
              background:'var(--glass-bg)', backdropFilter:'var(--glass-blur)',
              WebkitBackdropFilter:'var(--glass-blur)',
              border:'1px solid var(--glass-border)', borderRadius:10,
              padding:'10px 12px', cursor:'pointer', display:'flex',
              flexDirection:'column', gap:5.5, alignItems:'center',
              transition:'background 0.25s',
              boxShadow: menuOpen ? '0 0 0 3px rgba(124,92,252,0.2)' : 'none'
            }}
            className={menuOpen ? 'burger-open' : ''}
          >
            <span className="burger-bar" style={{ backgroundColor: textColor }}></span>
            <span className="burger-bar" style={{ backgroundColor: textColor }}></span>
            <span className="burger-bar" style={{ backgroundColor: textColor }}></span>
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              {[
                ['dashboard', t.navDashboard],
                ['details',   t.navDetails],
                ['charts',    t.navCharts],
                ['savings',   t.navSavings],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => navigateTo(id)}
                  className={`dropdown-item${activeTab === id ? ' active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h2 style={{ fontSize:18, textAlign:'center', flex:1 }}>{t.title}</h2>

        {/* Controls: lang + theme */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>

          {/* Language dropdown burger */}
          <div ref={langRef} style={{ position:'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              className="ctrl-btn"
              aria-label="Language selector"
              style={{ gap:6, boxShadow: langOpen ? '0 0 0 3px rgba(124,92,252,0.2)' : 'none' }}
            >
              <span style={{ fontSize:14 }}>{LANG_META[lang].flag}</span>
              <span>{lang.toUpperCase()}</span>
              <span style={{
                fontSize:9, marginLeft:1, opacity:0.6,
                transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition:'transform 0.25s',
                display:'inline-block'
              }}>▼</span>
            </button>

            {langOpen && (
              <div className="dropdown-menu lang-dropdown">
                {Object.entries(LANG_META).map(([code, meta]) => (
                  <button
                    key={code}
                    onClick={() => { setLang(code); setLangOpen(false) }}
                    className={`dropdown-item${lang === code ? ' active' : ''}`}
                  >
                    <span style={{ fontSize:15 }}>{meta.flag}</span>
                    <span>{meta.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className="ctrl-btn"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* ── BALANCE GRID ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:4 }}>
        {/* Net worth */}
        <div className="balance-card" style={{ ...glassCard }}>
          <h4 style={{ color: mutedColor }}>{t.netWorth}</h4>
          <div className="amount" style={{ color: textColor }}>{formatIDR(total)}</div>
        </div>
        {/* GoPay */}
        <div className="balance-card" style={{
          ...glassCard,
          borderLeft: '3px solid #00b14f',
          background: darkMode ? 'rgba(0,177,79,0.12)' : 'rgba(0,177,79,0.08)'
        }}>
          <h4 style={{ color:'#00b14f' }}>{t.gopay}</h4>
          <div className="amount" style={{ color:'#00b14f' }}>{formatIDR(goPayBalance)}</div>
        </div>
        {/* Cash */}
        <div className="balance-card" style={{
          ...glassCard,
          borderLeft: '3px solid #fbc02d',
          background: darkMode ? 'rgba(251,192,45,0.12)' : 'rgba(251,192,45,0.08)'
        }}>
          <h4 style={{ color:'#fbc02d' }}>{t.cash}</h4>
          <div className="amount" style={{ color:'#fbc02d' }}>{formatIDR(cashBalance)}</div>
        </div>
      </div>

      {/* ── INCOME / EXPENSE ── */}
      <div className="inc-exp-container">
        <div>
          <h4 style={{ color: mutedColor }}>{t.income}</h4>
          <p className="money plus">{formatIDR(income)}</p>
        </div>
        <div>
          <h4 style={{ color: mutedColor }}>{t.expense}</h4>
          <p className="money minus">{formatIDR(expense)}</p>
        </div>
      </div>

      {/* ── BUDGET TRACKER ── */}
      <div style={{ ...glassCard, padding:'16px', marginBottom:8 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <h4 style={{ color: mutedColor }}>{t.budgetTracker}</h4>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:11, color: mutedColor }}>{t.limit}</span>
            <input
              type="number" value={budgetLimit || ''}
              placeholder="0"
              onChange={e => setBudgetLimit(parseFloat(e.target.value) || 0)}
              style={{ ...inputStyle, width:110, padding:'4px 8px', fontSize:11, borderRadius:6 }}
            />
          </div>
        </div>
        <div style={{
          fontSize:14, fontWeight:600, marginBottom:8,
          color: expense > budgetLimit ? '#e74c3c' : textColor
        }}>
          {formatIDR(expense)} / {formatIDR(budgetLimit)} {t.spent}
          {expense > budgetLimit && (
            <span style={{ fontSize:11, color:'#e74c3c', marginLeft:8, fontWeight:400 }}>
              ⚠ {t.overBudget}
            </span>
          )}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${Math.min((expense / (budgetLimit || 1)) * 100, 100)}%`,
            background: expense > budgetLimit
              ? 'linear-gradient(90deg,#e74c3c,#c0392b)'
              : 'linear-gradient(90deg,var(--accent-violet),#5b8def)'
          }} />
        </div>
      </div>

      {/* ══════ TABS ══════════════════════════════════════════════════ */}

      {/* ── DASHBOARD ── */}
      {activeTab === 'dashboard' && (
        <>
          <h3>{t.history}</h3>
          <ul className="list">
            {transactions.slice(-5).reverse().map(tx => (
              <li key={tx.id} style={{
                ...glassCard,
                borderRight: `4px solid ${tx.amount < 0 ? '#e74c3c' : '#2ecc71'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px 10px 36px',
              }}>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="del-btn"
                  style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)',
                    borderRadius:'0 4px 4px 0', padding:'6px 7px' }}
                >×</button>
                <div>
                  <strong style={{ fontSize:13, color: textColor }}>{tx.text}</strong>
                  <small style={{ display:'block', color: mutedColor, fontSize:10, marginTop:2 }}>
                    {getCategoryLabel(tx.category)} · {tx.source}
                  </small>
                </div>
                <span style={{
                  fontFamily:"'DM Mono', monospace", fontSize:13, fontWeight:600,
                  color: tx.amount < 0 ? '#e74c3c' : '#2ecc71'
                }}>
                  {tx.amount < 0 ? '−' : '+'}{formatIDR(Math.abs(tx.amount))}
                </span>
              </li>
            ))}
            {transactions.length === 0 && (
              <li style={{ ...glassCard, padding:20, textAlign:'center', color: mutedColor, fontSize:13 }}>
                {t.noRecords}
              </li>
            )}
          </ul>

          <h3>{t.addTransaction}</h3>
          <form onSubmit={handleFormSubmit}>
            {/* Type toggle */}
            <div style={{ marginBottom:14 }}>
              <label style={{ color: subColor }}>{t.txType}</label>
              <div style={{ display:'flex', gap:8, marginTop:4 }}>
                {[['expense', t.expenseOpt, '#e74c3c'], ['income', t.incomeOpt, '#2ecc71']].map(([val, label, color]) => (
                  <button key={val} type="button"
                    onClick={() => setTxType(val)}
                    style={{
                      flex:1, padding:'10px', cursor:'pointer',
                      borderRadius:'var(--radius-sm)', fontFamily:"'DM Sans',sans-serif",
                      fontSize:13, fontWeight:600, border:'1px solid',
                      borderColor: txType === val ? color : 'var(--glass-border)',
                      background: txType === val
                        ? `${color}22`
                        : 'var(--glass-bg)',
                      color: txType === val ? color : subColor,
                      backdropFilter:'var(--glass-blur)',
                      transition:'all 0.2s'
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ color: subColor }}>{t.description}</label>
              <input type="text" value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t.placeholderDesc}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ color: subColor }}>{t.amount}</label>
              <input type="number" value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 25000"
                style={inputStyle} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <label style={{ color: subColor }}>{t.category}</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                  <option value="Food & Beverage">{t.catFood}</option>
                  <option value="Transport / Ojol">{t.catTransport}</option>
                  <option value="Bills & Utilities">{t.catBills}</option>
                  <option value="Shopping">{t.catShopping}</option>
                  <option value="Salary / Income">{t.catSalary}</option>
                  <option value="Others">{t.catOthers}</option>
                </select>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ color: subColor }}>{t.paymentSource}</label>
                <select value={source} onChange={e => setSource(e.target.value)} style={inputStyle}>
                  <option value="Cash">Cash / Tunai</option>
                  <option value="GoPay">GoPay</option>
                </select>
              </div>
            </div>
            <button className="btn" type="submit" style={{ marginTop:16 }}>{t.addBtn}</button>
          </form>
        </>
      )}

      {/* ── DETAILED LOGS ── */}
      {activeTab === 'details' && (
        <>
          <h3>{t.detailedLogs}</h3>
          <div style={{ ...glassCard, overflowX:'auto', padding:0 }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th>{t.thDate}</th>
                  <th>{t.thDesc}</th>
                  <th>{t.thCat}</th>
                  <th>{t.thSource}</th>
                  <th>{t.thAmount}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding:24, textAlign:'center', color: mutedColor }}>{t.noRecords}</td></tr>
                ) : (
                  transactions.slice().reverse().map(tx => (
                    <tr key={tx.id}>
                      <td style={{ color: mutedColor, whiteSpace:'nowrap', fontSize:11 }}>{tx.date}</td>
                      <td style={{ fontWeight:600, color: textColor }}>{tx.text}</td>
                      <td><span className="badge">{getCategoryLabel(tx.category)}</span></td>
                      <td style={{ color: tx.source === 'GoPay' ? '#00b14f' : '#fbc02d', fontWeight:500 }}>{tx.source}</td>
                      <td style={{
                        fontFamily:"'DM Mono',monospace", fontWeight:700,
                        color: tx.amount < 0 ? '#e74c3c' : '#2ecc71', whiteSpace:'nowrap'
                      }}>
                        {tx.amount < 0 ? '−' : '+'}{formatIDR(Math.abs(tx.amount))}
                      </td>
                      <td>
                        <button className="del-btn" onClick={() => deleteTransaction(tx.id)}>✕</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── ANALYTICS ── */}
      {activeTab === 'charts' && (
        <>
          <h3>{t.analytics}</h3>
          <div style={{ ...glassCard, padding:20 }}>
            {totalExpenseForChart === 0 ? (
              <p style={{ textAlign:'center', color: mutedColor, padding:'20px 0', fontSize:13 }}>
                {t.noChartData}
              </p>
            ) : (
              <>
                <h4 style={{ color: mutedColor, marginBottom:16 }}>{t.chartTitle}</h4>
                {Object.entries(categoryExpenses).map(([cat, val]) => {
                  const pct = ((val / totalExpenseForChart) * 100).toFixed(1)
                  const color = CATEGORY_COLORS[cat] || '#95a5a6'
                  return (
                    <div key={cat} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13 }}>
                        <span style={{ fontWeight:500, color: textColor, display:'flex', alignItems:'center', gap:7 }}>
                          <span style={{ width:9, height:9, borderRadius:'50%', background:color, display:'inline-block' }} />
                          {getCategoryLabel(cat)}
                        </span>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontWeight:600, color: textColor }}>
                          {formatIDR(val)} <span style={{ color: mutedColor, fontWeight:400 }}>({pct}%)</span>
                        </span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width:`${pct}%`, background:color }} />
                      </div>
                    </div>
                  )
                })}
                <hr style={{ border:'none', borderTop:'1px solid var(--glass-border)', margin:'16px 0 8px' }} />
                <div style={{ fontSize:12, color: mutedColor, textAlign:'center' }}>
                  {t.totalOutflow} <strong style={{ color: textColor, fontFamily:"'DM Mono',monospace" }}>{formatIDR(totalExpenseForChart)}</strong>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ── SAVINGS ── */}
      {activeTab === 'savings' && (
        <>
          <h3>{t.savingsTitle}</h3>
          <div style={{ ...glassCard, padding:20 }}>
            <h4 style={{ color: mutedColor, marginBottom:12 }}>{t.progressTitle}</h4>
            <div style={{ fontSize:18, fontWeight:700, color: textColor, marginBottom:8, fontFamily:"'DM Mono',monospace" }}>
              {formatIDR(currentSavings)} / {formatIDR(savingsTarget)}
            </div>
            <div className="progress-track" style={{ height:12, marginBottom:6 }}>
              <div className="progress-fill" style={{
                width:`${Math.min((currentSavings / (savingsTarget || 1)) * 100, 100)}%`,
                background:'linear-gradient(90deg,#2ecc71,#27ae60)'
              }} />
            </div>
            <span style={{ fontSize:12, color: mutedColor, fontWeight:600 }}>
              {((currentSavings / (savingsTarget || 1)) * 100).toFixed(1)}% {t.completed}
            </span>

            <hr style={{ border:'none', borderTop:'1px solid var(--glass-border)', margin:'20px 0' }} />

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ color: subColor }}>{t.setTarget}</label>
                <input type="number"
                  value={savingsTarget || ''}
                  placeholder="e.g. 5000000"
                  onChange={e => setSavingsTarget(parseFloat(e.target.value) || 0)}
                  style={{ ...inputStyle, marginTop:4 }} />
              </div>
              <div>
                <label style={{ color: subColor }}>{t.currentSavings}</label>
                <input type="number"
                  value={currentSavings || ''}
                  placeholder="e.g. 1000000"
                  onChange={e => setCurrentSavings(parseFloat(e.target.value) || 0)}
                  style={{ ...inputStyle, marginTop:4 }} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App

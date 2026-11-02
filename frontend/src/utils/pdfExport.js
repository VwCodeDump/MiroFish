import html2pdf from 'html2pdf.js'

/**
 * Clean a string for use in a file name
 */
function sanitizeFilename(name) {
  if (!name) return 'Prediction_Report'
  return name
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 80)
}

/**
 * Format date for PDF header
 */
function formatDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

/**
 * Default robust markdown renderer for report sections
 */
export function defaultRenderMarkdown(content) {
  if (!content) return ''
  
  // Remove leading duplicate heading if present
  let html = content.replace(/^##\s+.+\n+/, '')

  // Escape HTML entities in raw content except our generated tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // Headings
  html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')

  // Blockquotes
  html = html.replace(/^&gt;\s*(.+)$/gm, '<blockquote class="md-quote">$1</blockquote>')

  // Lists
  html = html.replace(/^(\s*)- (.+)$/gm, '<li class="md-li">$2</li>')
  html = html.replace(/^(\s*)\d+\. (.+)$/gm, '<li class="md-oli">$2</li>')
  html = html.replace(/(<li class="md-li">.*?<\/li>\s*)+/g, '<ul class="md-ul">$&</ul>')
  html = html.replace(/(<li class="md-oli">.*?<\/li>\s*)+/g, '<ol class="md-ol">$&</ol>')

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="md-hr">')

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p class="md-p">')
  html = html.replace(/\n/g, '<br>')
  html = '<p class="md-p">' + html + '</p>'

  // Clean empty paragraphs and invalid wrappers
  html = html.replace(/<p class="md-p">\s*<\/p>/g, '')
  html = html.replace(/<p class="md-p">(<(h[1-4]|ul|ol|blockquote|pre|hr))/g, '$1')
  html = html.replace(/(<\/(h[1-4]|ul|ol|blockquote|pre|hr)>)<\/p>/g, '$1')
  html = html.replace(/<br>\s*(<ul|<ol|<blockquote|<pre|<hr)/g, '$1')
  html = html.replace(/(<\/ul>|<\/ol>|<\/blockquote>|<\/pre>)\s*<br>/g, '$1')

  return html
}

/**
 * Builds standalone HTML representation of report for print or PDF export
 */
export function buildReportDocumentHtml({
  reportId,
  reportOutline,
  generatedSections = {},
  renderMarkdown = defaultRenderMarkdown
}) {
  const title = reportOutline?.title || 'Prediction Report'
  const summary = reportOutline?.summary || ''
  const sections = reportOutline?.sections || []

  let sectionsHtml = ''
  if (sections.length > 0) {
    sections.forEach((sec, idx) => {
      const secNum = String(idx + 1).padStart(2, '0')
      const secTitle = sec.title || `Section ${idx + 1}`
      // Check both generatedSections[idx+1], generatedSections[idx], and sec.content
      const rawContent = generatedSections[idx + 1] || generatedSections[idx] || sec.content || ''
      const bodyHtml = rawContent
        ? renderMarkdown(rawContent)
        : '<p style="color:#9CA3AF; font-style:italic;">[Section content pending]</p>'

      sectionsHtml += `
        <article class="report-section-block">
          <header class="section-title-row">
            <span class="section-badge">${secNum}</span>
            <h2 class="section-heading">${secTitle}</h2>
          </header>
          <div class="section-content">
            ${bodyHtml}
          </div>
        </article>
      `
    })
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 16mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #FFFFFF !important;
      color: #111827 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Helvetica, Arial, sans-serif;
      font-size: 13.5px;
      line-height: 1.65;
      padding: 0;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    .report-sheet {
      width: 100%;
      max-width: 794px;
      margin: 0 auto;
      padding: 24px 32px;
      background: #FFFFFF;
    }
    .report-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 2px solid #111827;
      margin-bottom: 20px;
    }
    .brand-tag {
      background: #111827;
      color: #FFFFFF;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 8px;
      border-radius: 2px;
    }
    .meta-tag {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      color: #4B5563;
    }
    .report-header {
      margin-bottom: 28px;
      page-break-after: avoid;
      break-after: avoid;
    }
    .report-main-title {
      font-size: 26px;
      font-weight: 700;
      color: #111827;
      line-height: 1.25;
      margin: 0 0 10px 0;
      font-family: Georgia, "Times New Roman", Times, serif;
    }
    .report-summary {
      font-size: 14px;
      color: #4B5563;
      font-style: italic;
      line-height: 1.6;
      border-left: 3px solid #10B981;
      padding: 8px 14px;
      background: #F9FAFB;
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .sections-container {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .report-section-block {
      page-break-inside: auto;
      break-inside: auto;
      margin-bottom: 20px;
      border-bottom: 1px solid #E5E7EB;
      padding-bottom: 18px;
    }
    .section-title-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 10px;
      page-break-after: avoid;
      break-after: avoid;
    }
    .section-badge {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      font-weight: 700;
      color: #111827;
    }
    .section-heading {
      font-size: 17px;
      font-weight: 700;
      color: #111827;
      margin: 0;
      font-family: Georgia, "Times New Roman", Times, serif;
    }
    .section-content {
      font-size: 13.5px;
      color: #1F2937;
      line-height: 1.65;
    }
    .section-content p, .md-p {
      margin: 0 0 10px 0;
      text-align: justify;
    }
    .section-content blockquote, .md-quote {
      border-left: 3px solid #10B981;
      margin: 12px 0;
      padding: 8px 14px;
      background: #F9FAFB;
      color: #374151;
      font-style: italic;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section-content ul, .section-content ol, .md-ul, .md-ol {
      margin: 8px 0 12px 0;
      padding-left: 22px;
    }
    .section-content li, .md-li, .md-oli {
      margin-bottom: 4px;
    }
    .section-content code, .inline-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11.5px;
      background: #F3F4F6;
      padding: 1px 5px;
      border-radius: 3px;
      color: #1F2937;
    }
    .section-content pre, .code-block {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 4px;
      padding: 10px 14px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      line-height: 1.45;
      margin: 10px 0;
      white-space: pre-wrap;
      word-break: break-all;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section-content h3, .md-h3 {
      font-size: 15px;
      font-weight: 700;
      margin: 14px 0 6px 0;
      color: #111827;
      page-break-after: avoid;
      break-after: avoid;
    }
    .section-content h4, .md-h4 {
      font-size: 13.5px;
      font-weight: 600;
      margin: 10px 0 4px 0;
      color: #374151;
      page-break-after: avoid;
      break-after: avoid;
    }
    .section-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section-content th, .section-content td {
      border: 1px solid #D1D5DB;
      padding: 6px 10px;
    }
    .section-content th {
      background: #F9FAFB;
      font-weight: 600;
    }
    .report-footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #E5E7EB;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: #9CA3AF;
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="report-sheet">
    <div class="report-top-bar">
      <span class="brand-tag">MiroFish Prediction Report</span>
      <span class="meta-tag">ID: ${reportId || 'N/A'} • ${formatDate()}</span>
    </div>
    <header class="report-header">
      <h1 class="report-main-title">${title}</h1>
      ${summary ? `<div class="report-summary">${summary}</div>` : ''}
    </header>
    <div class="sections-container">
      ${sectionsHtml}
    </div>
    <footer class="report-footer">
      <span>MiroFish Multi-Agent Swarm Intelligence Prediction Engine</span>
      <span>Confidential & Proprietary</span>
    </footer>
  </div>
</body>
</html>`
}

/**
 * Triggers native browser print with an isolated, perfectly formatted document.
 * This guarantees zero interference from application layout, overflow:hidden, or navigation headers.
 * In Chrome/Edge/Safari/Firefox, users can click "Print" or select "Save as PDF" to generate
 * an ultra-crisp, searchable vector PDF with accurate multi-page pagination.
 */
export function printReport({
  reportId,
  reportOutline,
  generatedSections = {},
  renderMarkdown = defaultRenderMarkdown
} = {}) {
  // If reportOutline is provided, use an isolated iframe for 100% clean vector print
  if (reportOutline) {
    const docHtml = buildReportDocumentHtml({
      reportId,
      reportOutline,
      generatedSections,
      renderMarkdown
    })

    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.visibility = 'hidden'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentWindow.document
    iframeDoc.open()
    iframeDoc.write(docHtml)
    iframeDoc.close()

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus()
          iframe.contentWindow.print()
        } catch (e) {
          console.warn('Iframe print failed, falling back to window.print():', e)
          window.print()
        } finally {
          setTimeout(() => {
            if (iframe && iframe.parentNode) {
              iframe.parentNode.removeChild(iframe)
            }
          }, 2000)
        }
      }, 250)
    }
    return
  }

  // Fallback to window.print() (styled by global @media print in App.vue)
  window.print()
}

/**
 * Exports the prediction report as a downloadable PDF file via html2pdf.js.
 * Renders in-bounds with an active progress overlay to ensure html2canvas
 * captures every pixel accurately without clipping or blank pages.
 */
export async function exportReportToPdf({
  reportId,
  reportOutline,
  generatedSections = {},
  renderMarkdown = defaultRenderMarkdown
}) {
  if (!reportOutline) {
    throw new Error('No report content available to export')
  }

  const title = reportOutline?.title || 'Prediction Report'
  const filename = `${sanitizeFilename(title)}_${reportId || 'report'}.pdf`

  // 1. Create friendly progress overlay
  const overlay = document.createElement('div')
  overlay.className = 'mirofish-export-overlay'
  overlay.style.position = 'fixed'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100vw'
  overlay.style.height = '100vh'
  overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'
  overlay.style.backdropFilter = 'blur(4px)'
  overlay.style.zIndex = '999999'
  overlay.style.display = 'flex'
  overlay.style.flexDirection = 'column'
  overlay.style.alignItems = 'center'
  overlay.style.justifyContent = 'center'
  overlay.style.color = '#FFFFFF'
  overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  overlay.innerHTML = `
    <div style="background: #1E293B; border: 1px solid #334155; padding: 28px 36px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); text-align: center; max-width: 380px;">
      <div style="width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #38BDF8; border-radius: 50%; margin: 0 auto 16px auto; animation: mirofish-spin 0.8s linear infinite;"></div>
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #F8FAFC;">Generating PDF...</h3>
      <p style="margin: 0; font-size: 13px; color: #94A3B8; line-height: 1.5;">Rendering report typography and calculating page breaks...</p>
    </div>
    <style>
      @keyframes mirofish-spin { to { transform: rotate(360deg); } }
    </style>
  `
  document.body.appendChild(overlay)

  // 2. Create pristine in-bounds render container (x=0, y=0) so html2canvas captures full content
  const container = document.createElement('div')
  container.className = 'mirofish-pdf-export-container'
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.width = '794px' // A4 width at 96 DPI
  container.style.backgroundColor = '#FFFFFF'
  container.style.color = '#111827'
  container.style.zIndex = '999990' // underneath overlay
  container.style.boxSizing = 'border-box'
  container.style.padding = '36px 44px'
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  container.style.fontSize = '13.5px'
  container.style.lineHeight = '1.65'

  // Extract inner body content from buildReportDocumentHtml
  const fullHtml = buildReportDocumentHtml({
    reportId,
    reportOutline,
    generatedSections,
    renderMarkdown
  })
  
  // Extract body innerHTML
  const match = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  container.innerHTML = match ? match[1] : fullHtml

  document.body.appendChild(container)

  try {
    const opt = {
      margin: [10, 10, 12, 10], // mm: top, left, bottom, right
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }
    }

    await html2pdf().set(opt).from(container).save()
    return true
  } finally {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay)
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }
}

/**
 * Downloads the report as raw markdown file.
 */
export function downloadMarkdown({ reportId, reportOutline, generatedSections = {} }) {
  const title = reportOutline?.title || 'Prediction Report'
  const summary = reportOutline?.summary || ''
  const filename = `${sanitizeFilename(title)}_${reportId || 'report'}.md`

  let content = `# ${title}\n\n`
  if (summary) {
    content += `> ${summary}\n\n---\n\n`
  }

  const sections = reportOutline?.sections || []
  sections.forEach((sec, idx) => {
    const secNum = String(idx + 1).padStart(2, '0')
    const secTitle = sec.title || `Section ${idx + 1}`
    const secContent = generatedSections[idx + 1] || generatedSections[idx] || sec.content || ''

    content += `## ${secNum} ${secTitle}\n\n`
    if (secContent) {
      const cleaned = secContent.replace(/^##\s+.+\n+/, '').trim()
      content += `${cleaned}\n\n`
    } else {
      content += `*(Pending generation)*\n\n`
    }
  })

  content += `\n---\n*Generated by MiroFish Swarm Intelligence Prediction Engine*\n`

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

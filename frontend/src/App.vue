<template>
  <router-view />
</template>

<script setup>
// 使用 Vue Router 来管理页面
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'JetBrains Mono', 'Space Grotesk', 'Noto Sans SC', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  background-color: #ffffff;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #000000;
}

::-webkit-scrollbar-thumb:hover {
  background: #333333;
}

/* 全局按钮样式 */
button {
  font-family: inherit;
}

/* ==========================================================================
   GLOBAL PRINT STYLESHEET
   Unlocks viewport locks (100vh / overflow:hidden), hides app chrome & sidebars,
   and formats MiroFish prediction reports for flawless multi-page printing & PDF.
   ========================================================================== */
@media print {
  @page {
    size: A4 portrait;
    margin: 15mm 12mm 15mm 12mm;
  }

  /* 1. Unlock all parent containers from overflow:hidden and 100vh height */
  html, body, #app,
  .main-view,
  .content-area,
  .panel-wrapper,
  .panel-wrapper.right,
  .report-panel,
  .interaction-panel,
  .main-split-layout {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    position: static !important;
    display: block !important;
    background: #FFFFFF !important;
    color: #111827 !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    box-shadow: none !important;
    transform: none !important;
  }

  /* 2. Hide all app navigation, headers, side panels, toolbars and modals */
  .app-header,
  .panel-wrapper.left,
  .right-panel,
  .view-switcher,
  .header-left,
  .header-center,
  .header-right,
  .console-logs,
  .report-export-toolbar,
  .next-step-btn,
  .complete-action-group,
  .collapse-icon,
  .waiting-placeholder,
  .action-bar,
  .action-row,
  .interaction-chat-area,
  .modal-overlay,
  .history-modal,
  .toast,
  .status-indicator,
  .step-divider,
  .step-num,
  .step-name,
  .brand,
  .save-pdf-btn-complete {
    display: none !important;
  }

  /* 3. Report panel formatting for print */
  .left-panel.report-style {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    height: auto !important;
    display: block !important;
    position: static !important;
  }

  .report-content-wrapper {
    max-width: 100% !important;
    margin: 0 !important;
    width: 100% !important;
    padding: 0 !important;
  }

  .report-header-block {
    margin-bottom: 24pt;
    page-break-after: avoid;
    break-after: avoid;
  }

  .main-title {
    font-size: 24pt !important;
    line-height: 1.25 !important;
    color: #111827 !important;
    margin-bottom: 12pt !important;
    page-break-after: avoid;
    break-after: avoid;
  }

  .sub-title {
    font-size: 11pt !important;
    color: #4B5563 !important;
    line-height: 1.5 !important;
    margin-bottom: 14pt !important;
  }

  /* 4. Ensure all sections are un-collapsed and printed in full */
  .section-body {
    display: block !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    opacity: 1 !important;
  }

  .report-section-item {
    page-break-inside: auto;
    break-inside: auto;
    margin-bottom: 20pt !important;
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 16pt;
  }

  .section-header-row {
    page-break-after: avoid;
    break-after: avoid;
    background: transparent !important;
    cursor: default !important;
    padding: 0 0 6pt 0 !important;
  }

  .section-title {
    font-size: 14pt !important;
    font-weight: 700 !important;
    color: #111827 !important;
  }

  /* 5. Markdown elements styling */
  .generated-content p, .md-p {
    margin-bottom: 8pt !important;
    font-size: 10.5pt !important;
    line-height: 1.6 !important;
    color: #1F2937 !important;
  }

  .md-quote, blockquote {
    page-break-inside: avoid;
    break-inside: avoid;
    border-left: 3px solid #10B981 !important;
    background: #F9FAFB !important;
    padding: 6pt 10pt !important;
    margin: 8pt 0 !important;
    font-style: italic !important;
    color: #374151 !important;
  }

  .code-block, pre {
    page-break-inside: avoid;
    break-inside: avoid;
    white-space: pre-wrap !important;
    word-break: break-all !important;
    background: #F3F4F6 !important;
    border: 1px solid #E5E7EB !important;
    padding: 8pt !important;
    font-size: 9pt !important;
  }

  table {
    page-break-inside: avoid;
    break-inside: avoid;
    width: 100% !important;
    border-collapse: collapse !important;
  }

  th, td {
    border: 1px solid #D1D5DB !important;
    padding: 4pt 6pt !important;
    font-size: 9pt !important;
  }
}
</style>

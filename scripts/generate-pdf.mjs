import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'

async function generate() {
  console.log('--- Starting Resume PDF Generation ---')
  
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  // Use the built static file from the 'out' directory
  const htmlPath = path.join(process.cwd(), 'out', 'resume.html')
  
  if (!fs.existsSync(htmlPath)) {
    // Fallback to resume/index.html if needed
    const altPath = path.join(process.cwd(), 'out', 'resume', 'index.html')
    if (fs.existsSync(altPath)) {
      var finalPath = altPath
    } else {
      console.error(`❌ Error: Build file not found at ${htmlPath}`)
      process.exit(1)
    }
  } else {
    var finalPath = htmlPath
  }

  const url = `file://${finalPath}`
  console.log(`Loading build at: ${url}`)
  
  await page.goto(url, { waitUntil: 'networkidle' })

  // Inject print-specific styles to ensure the PDF looks like a professional resume
  // and hides navigation/footer/UI elements.
  await page.addStyleTag({
    content: `
      @page {
        size: letter;
        margin: 0;
      }
      
      /* Hide web-only elements */
      header, footer, nav, .eyebrow, .LlmMarkdown, 
      .rounded-full, .panel, .project-glass-panel,
      button, [aria-label*="Scroll"] { 
        display: none !important; 
      }

      /* Force light mode colors for printing */
      :root {
        --bg: #ffffff !important;
        --text: #000000 !important;
        --text-muted: #444444 !important;
      }

      body { 
        background: white !important; 
        color: black !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .container-wide { 
        padding: 0.5in !important; 
        width: 100% !important; 
        max-width: 100% !important; 
        margin: 0 !important;
      }

      /* Ensure resume sections stack and look clean */
      h1 { font-size: 28pt !important; margin-bottom: 4pt !important; }
      p { font-size: 11pt !important; line-height: 1.4 !important; }
      
      /* Hide the iframe container if it exists */
      iframe, .iframe-container { display: none !important; }
    `
  })

  const pdfPath = path.join(process.cwd(), 'public', 'files', 'resume.pdf')
  
  await page.pdf({
    path: pdfPath,
    format: 'letter',
    printBackground: true,
    margin: {
      top: '0.4in',
      right: '0.4in',
      bottom: '0.4in',
      left: '0.4in'
    }
  })

  console.log(`✅ Success: PDF generated and saved to ${pdfPath}`)
  
  // Ensure it's in the 'out' directory for deployment
  const outPdfPath = path.join(process.cwd(), 'out', 'files', 'resume.pdf')
  if (fs.existsSync(path.dirname(outPdfPath))) {
    fs.copyFileSync(pdfPath, outPdfPath)
    console.log(`✅ Success: PDF copied to deployment folder ${outPdfPath}`)
  } else {
    // If directory doesn't exist, create it
    fs.mkdirSync(path.dirname(outPdfPath), { recursive: true })
    fs.copyFileSync(pdfPath, outPdfPath)
    console.log(`✅ Success: PDF copied to newly created deployment folder ${outPdfPath}`)
  }

  // Also copy to root files directory for redundancy if it exists
  const rootFilesPath = path.join(process.cwd(), 'files', 'resume.pdf')
  if (fs.existsSync(path.dirname(rootFilesPath))) {
    fs.copyFileSync(pdfPath, rootFilesPath)
    console.log(`✅ Success: PDF copied to ${rootFilesPath}`)
  }

  await browser.close()
}

generate().catch(err => {
  console.error('❌ PDF Generation Failed:', err)
  process.exit(1)
})

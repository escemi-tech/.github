#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Import the theme
const themePath = path.join(__dirname, '../../../resume/themes/escemi');
const theme = require(themePath);

// Read the resume JSON
const resumePath = process.argv[2] || path.join(__dirname, '../resume/resume.en.json');
const outputPath = process.argv[3] || '/tmp/test-resume.pdf';

console.log(`Generating PDF from: ${resumePath}`);
console.log(`Output will be saved to: ${outputPath}`);

async function generatePDF() {
  try {
    // Load resume data
    const resumeData = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
    
    // Render HTML using theme
    const html = theme.render(resumeData);
    
    // Launch browser and generate PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    console.log(`✅ PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

generatePDF();

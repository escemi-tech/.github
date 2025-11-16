#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Import the theme
const themePath = path.join(__dirname, '../../../resume/themes/escemi');
const theme = require(themePath);

// Read the resume JSON
const resumePath = process.argv[2] || path.join(__dirname, '../../../resume/resume.en.json');
const outputPath = process.argv[3] || '/tmp/resume-preview.png';

console.log(`Generating preview from: ${resumePath}`);
console.log(`Output will be saved to: ${outputPath}`);

async function generatePreview() {
  try {
    // Load resume data
    const resumeData = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
    
    // Render HTML using theme
    const html = theme.render(resumeData);
    
    // Launch browser and generate screenshot
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1.5 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await page.screenshot({
      path: outputPath,
      fullPage: false
    });
    
    await browser.close();
    
    console.log(`✅ Preview generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating preview:', error);
    process.exit(1);
  }
}

generatePreview();

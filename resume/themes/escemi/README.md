# ESCEMI JSON Resume Theme

A professional JSON Resume theme optimized for senior technical profiles (CTO, Lead Developer, Architect, Engineering Manager) following CV Coach best practices.

## Features

### Visual Design
- **Two-column layout**: Contact info and skills on the left, professional experience on the right
- **ESCEMI branding**: Source Sans Pro font with official ESCEMI colors (dark blue #1c3144, gold #ecb807)
- **Professional color scheme**: Matches ESCEMI brand identity
- **Proper hierarchy**: Clear visual distinction between sections, positions, and details
- **Icon integration**: Visual markers for quick section identification
- **Optimized spacing**: Adequate whitespace for readability and scannability

### Content Optimization
- **6-second scannability**: Recruiter can instantly see key information
- **ATS-friendly**: Simple formatting without tables or complex layouts
- **Metric emphasis**: Highlights achievements and quantifiable results
- **Action-oriented language**: Focus on results and impact
- **Professional sections**: 
  - Contact information
  - Professional links (LinkedIn, GitHub, etc.)
  - Core technical skills
  - Languages
  - Education & Certifications
  - Professional experience with highlights
  - Projects (optional)
  - Volunteer work (optional)

### Technical Features
- **Print-optimized**: A4 page format with proper margins
- **Page break control**: Prevents awkward splits in content
- **Semantic HTML**: Proper structure for accessibility and parsing
- **Responsive CSS**: Works in different rendering contexts

## Installation

### As a local theme

1. Install the theme in your project:

```bash
npm install --save /path/to/resume/themes/escemi
```

2. Generate your resume:

```bash
resume export resume.pdf --theme escemi
```

### For development

From the theme directory:

```bash
npm install
```

## Usage with JSON Resume

The theme expects a standard JSON Resume format. Here's how to structure your data for optimal results:

### Skills Section

Organize skills into categories for better visual hierarchy:

```json
"skills": [
  {
    "name": "Core Tech",
    "keywords": ["Node.js (NestJS)", "PHP (Symfony, Laravel)", "JavaScript", "TypeScript"]
  },
  {
    "name": "DevOps & Cloud",
    "keywords": ["Docker", "Kubernetes", "AWS", "GitHub Actions", "GitLab CI"]
  },
  {
    "name": "Methods & Leadership",
    "keywords": ["Clean Code", "TDD", "SOLID", "DevX", "Mentoring"]
  }
]
```

### Work Experience

Use the `highlights` array for achievements with metrics:

```json
"work": [
  {
    "name": "Company Name",
    "position": "CTO / Lead Developer",
    "startDate": "2020-01",
    "endDate": "",
    "location": "City, Country",
    "summary": "Brief context about the role and company",
    "highlights": [
      "Coached 15+ teams, reducing bug rate by 40% and accelerating velocity by 30-50%",
      "Migrated to cloud-native architecture, cutting costs by €120K/year (-35%)"
    ]
  }
]
```

### Label (Professional Title)

Use a comprehensive label that includes your expertise:

```json
"basics": {
  "label": "On-Demand CTO & Senior Lead Developer | Node.js & PHP Expert | Clean Code, Autonomous Teams, Scalable Products"
}
```

### Summary

Include your signature numbers and positioning:

```json
"basics": {
  "summary": "16 years of experience · 15+ teams mentored · 20+ projects delivered\n\nOn-demand CTO and Senior Lead Dev, I work on projects that need structure and velocity. I combine technical coaching, DevX excellence, and cloud-native modernization to transform product quality and velocity."
}
```

## Design Principles

This theme follows the CV Coach methodology for senior technical profiles:

1. **Clarity above all**: Non-tech people must understand the business impact
2. **Measurable value**: 90% of lines should include metrics or tangible impact
3. **Action → Result**: Always link what was done to its effect
4. **No empty jargon**: Avoid buzzwords without proof
5. **Honest metrics**: Never invent figures; use '~' for estimates

## Customization

The theme uses ESCEMI's official branding colors. You can customize colors by editing the CSS variables in `style.css`:

```css
:root {
  --primary-color: #1c3144; /* ESCEMI Main - Dark blue */
  --secondary-color: #ecb807; /* ESCEMI Secondary - Gold */
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --text-light: #6b7280;
}
```

## License

MIT

## Credits

Created by ESCEMI following CV Coach best practices for technical CVs.

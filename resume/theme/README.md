# ESCEMI JSON Resume Theme

A professional JSON Resume theme optimized for senior technical profiles (CTO, Lead Developer, Architect, Engineering Manager) following **CV Coach best practices**.

## Features

### CV Coach Optimization (NEW)

This theme now incorporates the CV Coach methodology for transforming senior technical CVs into compelling documents:

- **Automatic baseline extraction**: Signature numbers (e.g., "16 years · 15+ teams · 20+ projects") are automatically extracted and visually emphasized
- **Metric highlighting**: Numbers, percentages, and quantifiable results are automatically emphasized in highlights
- **Visual hierarchy**: Clear distinction between challenges, actions, and results
- **6-second scannability**: Visual design optimized for recruiters to quickly grasp key information
- **Impact-focused**: Emphasis on measurable business outcomes and technical achievements

### Visual Design

- **Tailwind-powered system**: The theme ships with a bundled Tailwind CSS build for predictable styling and easy maintenance
- **First page grid layout**: The opening page is forced into a two-column grid (brand sidebar + main content) while every following page automatically switches to a single-column reading experience
- **A4-perfect printing**: Global styles enforce 12mm × 15mm margins, color preservation, and `break-after: page` rules to keep PDF exports clean
- **ESCEMI branding**: Source Sans Pro font with official ESCEMI colors (dark blue #1c3144 primary, gold #ecb807 as accents only)
- **Professional color scheme**: Matches ESCEMI brand identity without using the secondary color for text
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
npm install --save /path/to/resume/theme
```

2. Generate your resume:

```bash
resume export resume.pdf --theme escemi
```

### For development

From the `resume/theme` directory:

```bash
npm install
npm run dev     # launch the Vite-powered preview using resume.en.json
npm run test    # execute the Vitest suite
npm run build   # emit dist/ with CJS+ESM bundles and type definitions
```

The Vite dev server hot-reloads React components, Tailwind styles, and the JSON fixture. `npm run build` compiles the library in dual module formats and ships inline Tailwind styles, so no extra bundling step is required when publishing to npm or using `resume-cli`.

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

### Highlights with Metrics

The theme automatically emphasizes quantifiable results in your highlights. Use metrics and percentages for maximum impact:

```json
"highlights": [
  "Coached 15+ teams, reducing bug rate by 40% and accelerating velocity by 30-50%",
  "Migrated to cloud-native architecture, cutting costs by €120K/year (-35%)",
  "Reduced deployment time from 2-4 hours to 15-30 minutes (75% reduction)"
]
```

The theme will automatically:

- **Bold** numbers with context (15+, 120K, etc.)
- **Emphasize** percentages and improvements (+40%, -35%)
- **Highlight** time comparisons (2-4 hours → 15-30 minutes)

### Label (Professional Title)

Use a comprehensive label that includes your expertise:

```json
"basics": {
  "label": "On-Demand CTO & Senior Lead Developer | Node.js & PHP Expert | Clean Code, Autonomous Teams, Scalable Products"
}
```

### Summary with Baseline

Structure your summary to include signature numbers on the first line, followed by your positioning and value proposition:

```json
"basics": {
  "summary": "16 years of experience · 15+ teams mentored · 20+ projects delivered\n\nOn-demand CTO and Senior Lead Dev, I work on projects that need structure and velocity. I combine technical coaching, DevX excellence, and cloud-native modernization to transform product quality and velocity.\n\nNode.js and PHP expert with deep mastery of NestJS, Symfony, and Laravel frameworks."
}
```

The theme will automatically:

- Extract and visually emphasize the first line if it contains signature numbers
- Display remaining content as the main summary
- Apply proper formatting and visual hierarchy

## CV Coach Methodology

This theme follows the CV Coach methodology for senior technical profiles, designed to generate interviews within 48 hours:

### Core Principles

1. **Clarity above all**: Non-tech people must understand the business impact
2. **Measurable value**: 90% of lines should include metrics or tangible impact
3. **Action → Result**: Always link what was done to its effect
4. **No empty jargon**: Avoid buzzwords without proof
5. **Honest metrics**: Never invent figures; use '~' for estimates
6. **6-second scannability**: Visual hierarchy allows instant comprehension

### Visual Elements

The theme uses a strategic color system for maximum impact:

- **Baseline/Signature**: Highlighted with gold border for immediate visibility
- **Metrics & Results**: Automatically emphasized in green for quick scanning
- **Numbers & Percentages**: Bolded and highlighted for instant recognition
- **Professional Sections**: Clear visual hierarchy with icons and spacing

### Automatic Optimizations

The theme automatically enhances your resume:

- **Baseline Extraction**: First line with signature numbers (e.g., "16 years · 15+ teams") is extracted and displayed prominently
- **Metric Emphasis**: Numbers, percentages (+40%, -35%), and time comparisons (2h → 30min) are visually emphasized
- **ATS Compatibility**: Clean, semantic HTML structure for automated screening systems
- **Print Perfect**: Optimized A4 rendering with proper page breaks and color preservation

## Customization

### Component-level styling

Every domain component now owns its bespoke CSS next to the React files (for example `src/components/hero/hero.css` or `src/components/continuation/continuation.css`). The main `src/styles.css` simply imports those partials, so you can:

1. Add or tweak styles inside the component-level file.
2. Re-run `npm run build` so Tailwind/PostCSS bundles the updated rules.

When creating a new section, drop a `<domain>.css` file beside the component, wrap selectors in `@layer components { ... }`, and add the component folder to the existing imports list inside `src/styles.css`.

### Colors

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

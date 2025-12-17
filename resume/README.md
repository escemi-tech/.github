# Resume as Code

This directory contains the professional resume managed as code using the [JSON Resume](https://jsonresume.org/) format.

## Overview

The resume is stored in a structured JSON format that serves as the single source of truth for professional information across multiple platforms.

## Structure

### Files

The repository supports multiple resume variants optimized for different positions or roles:

#### File Naming Convention

- **`resume.<lang>.json`** - Default resume (e.g., `resume.en.json`, `resume.fr.json`)
- **`resume.<lang>.<position>.json`** - Position-specific resume (e.g., `resume.en.cto.json`, `resume.fr.lead-dev.json`)

#### Current Files

- **`resume.en.json`** - English version of the resume
- **`resume.fr.json`** - French version of the resume
- **`pdf/`** - Directory containing generated PDF versions
  - PDFs are auto-generated for each resume file
  - Position-specific resumes generate PDFs like `resume.en.cto.pdf`
  - See [pdf/README.md](pdf/README.md) for more details

### Position-Specific Resumes

You can create multiple resume variants optimized for different positions (CTO, Lead Developer, Engineering Manager, etc.). Each variant can:

- Emphasize different aspects of the same experience
- Highlight role-specific skills and achievements
- Tailor the content for specific job applications

**Example:**

- `resume.en.cto.json` - CTO-focused version emphasizing leadership and strategy
- `resume.en.lead-dev.json` - Technical leadership version emphasizing hands-on development
- `resume.en.staff-engineer.json` - Staff engineer version emphasizing technical expertise

All resume files are automatically discovered and processed by the CI/CD pipeline.

## Format

The resume follows the standard [JSON Resume schema v1.0.0](https://jsonresume.org/schema/) without any custom extensions.

### Supported Languages

We support bilingual resumes with the following language codes:

- **`en`** - English
- **`fr`** - French (Français)

Both base and position-specific files follow the exact same schema structure from [jsonresume.org/schema](https://jsonresume.org/schema/).

## Updating the Resume

### For All Resume Files

1. Edit your resume JSON files (e.g., `resume.en.json`, `resume.fr.lead-dev.json`)
2. Run `make humanize-resume` to normalize punctuation and whitespace with `humanize-ai-lib`
3. Keep the structure consistent between language variants of the same position
4. Commit the changes to trigger automated updates

### Creating a New Position-Specific Resume

1. Copy an existing resume file (e.g., `resume.en.json`)
2. Rename it following the pattern `resume.<lang>.<position>.json` (e.g., `resume.en.cto.json`)
3. Edit the content to emphasize the specific position
4. Run `make validate-resume` to ensure the file is valid
5. Run `make generate-pdfs` to generate the PDF locally
6. Commit the new file - the CI/CD pipeline will automatically discover and process it

**Supported position slugs:** Use lowercase with hyphens for multi-word positions (e.g., `cto`, `lead-dev`, `staff-engineer`, `engineering-manager`)

### Cleanup automation

To keep the content recruiter-friendly, we automatically strip smart quotes, non-breaking spaces, em dashes, and other AI artifacts using [`humanize-ai-lib`](https://github.com/Nordth/humanize-ai-lib).

Run the cleanup before validating or generating PDFs:

```sh
make humanize-resume
```

The command runs the script in `resume/scripts/humanize-resume`. Pass custom files or limit output to ASCII characters with:

```sh
cd resume/scripts/humanize-resume
npm run humanize -- --keyboard-only ../../resume.en.json ../../resume.fr.json
```

The script rewrites the JSON files only when changes are detected and prints a short summary of normalized symbols.

## Validation

The resume data follows the JSON Resume schema v1.0.0. You can validate it using:

```bash
npm install -g resume-cli
resume validate resume.en.json
resume validate resume.fr.json
```

Or simply validate JSON structure with `jq`:

```bash
jq empty resume.en.json && echo "✅ Valid"
jq empty resume.fr.json && echo "✅ Valid"
```

## LinkedIn Synchronization

**Important Note:** LinkedIn's Profile Edit API is restricted to approved LinkedIn Partner Program applications. Direct automated profile updates require special partnership approval from LinkedIn.

### Current Limitations

- LinkedIn API does not allow general developers to programmatically update profile details (headline, summary, etc.)
- Only approved partners can use the Profile Edit API
- Most automation tools can only post content, not edit profile information

### Recommended Approach

Until LinkedIn API access is granted:

1. **Manual Updates:** Use the resume files as a reference when updating LinkedIn profile manually
2. **Apply for Partnership:** If automated updates are critical, apply for the [LinkedIn Partner Program](https://www.linkedin.com/help/linkedin/answer/a545236)
3. **Alternative Automation:** Consider using the workflow as a reminder/notification system when resume files change

### Workflows

The repository uses a modular CI/CD workflow structure:

**Main Workflows:**

- `main-ci.yml` - Runs on push to main branch
  - Validates resumes using composite actions
  - Generates PDFs
  - Commits PDFs to repository
  - Creates LinkedIn update reminder issue

- `pull-request-ci.yml` - Runs on pull requests
  - Validates resumes
  - Generates PDF previews as artifacts
  - Comments on PR with download link

- `shared-ci.yml` - Reusable workflow for common CI tasks
  - Validates both resume files
  - Generates PDFs

**Composite Actions:**

- `.github/actions/validate-resume` - Validates JSON Resume files
- `.github/actions/generate-resume-pdf` - Generates PDFs from JSON Resume

**Additional Workflows:**

- `greetings.yml` - Welcomes new contributors
- `semantic-pull-request.yml` - Enforces semantic PR titles
- `stale.yml` - Manages stale issues and PRs

For future enhancement when API access is available, the workflow can be extended to use the LinkedIn API directly.

## PDF Generation

PDFs are automatically generated from the JSON Resume files using a custom **ESCEMI theme** that follows CV Coach best practices for senior technical profiles.

### Theme Features

The custom theme (`jsonresume-theme-escemi`) is optimized for:

- **Two-column layout**: Contact info and skills on the left, professional experience on the right
- **Visual hierarchy**: Clear distinction between sections, positions, and achievements
- **ATS-friendly**: Simple formatting that passes automated screening systems
- **ESCEMI branding**: Source Sans Pro font with official ESCEMI colors (dark blue #1c3144, gold #ecb807)
- **Metric emphasis**: Highlights quantifiable achievements and business impact
- **6-second scannability**: Recruiters can instantly identify key information

See [themes/escemi/README.md](themes/escemi/README.md) for complete theme documentation.

### Automatic Generation

- **On main branch:** PDFs are generated and committed to `resume/pdf/` directory
- **On pull requests:** PDFs are generated as artifacts for preview before merging

### Manual Generation

To generate PDFs locally using the custom theme:

```sh
make generate-pdfs
```

See [pdf/README.md](pdf/README.md) for more details.

## Schema Reference

The resume uses the following main sections from JSON Resume schema:

- **basics** - Personal information, contact details, profiles
- **work** - Work experience
- **education** - Educational background
- **skills** - Technical and professional skills
- **languages** - Language proficiencies
- **projects** - Notable projects (optional)

## Example Usage

### Reading Resume Data

```bash
# Pretty print the English resume
cat resume.en.json | jq .

# Pretty print the French resume
cat resume.fr.json | jq .

# Extract English summary
cat resume.en.json | jq -r '.basics.summary'

# Extract French label
cat resume.fr.json | jq -r '.basics.label'

# List all skills from English resume
cat resume.en.json | jq -r '.skills[].name'

# Compare names in both files (should be the same)
echo "English: $(jq -r '.basics.name' resume.en.json)"
echo "French: $(jq -r '.basics.name' resume.fr.json)"
```

## References

- [JSON Resume Official Site](https://jsonresume.org/)
- [JSON Resume Schema](https://jsonresume.org/schema/)
- [JSON Resume Documentation](https://docs.jsonresume.org/)
- [LinkedIn Developer Documentation](https://learn.microsoft.com/en-us/linkedin/)

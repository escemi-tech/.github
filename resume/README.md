# Resume as Code

This directory contains the professional resume managed as code using the [JSON Resume](https://jsonresume.org/) format.

## Overview

The resume is stored in a structured JSON format that serves as the single source of truth for professional information across multiple platforms.

## Structure

### Files

- **`resume.en.json`** - English version of the resume following the standard JSON Resume schema
- **`resume.fr.json`** - French version of the resume following the standard JSON Resume schema
- **`pdf/`** - Directory containing generated PDF versions of the resumes
  - `resume.en.pdf` - English PDF (auto-generated)
  - `resume.fr.pdf` - French PDF (auto-generated)
  - See [pdf/README.md](pdf/README.md) for more details

## Format

The resume follows the standard [JSON Resume schema v1.0.0](https://jsonresume.org/schema/) without any custom extensions.

### Supported Languages

We maintain two separate files for bilingual support:

- **resume.en.json** - English (English)
- **resume.fr.json** - French (Français)

Both files follow the exact same schema structure from [jsonresume.org/schema](https://jsonresume.org/schema/).

## Updating the Resume

1. Edit both `resume.en.json` and `resume.fr.json` files
2. Keep the structure consistent between both files
3. Commit the changes to trigger automated updates

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

PDFs are automatically generated from the JSON Resume files using `resume-cli` with the `elegant` theme.

### Automatic Generation

- **On main branch:** PDFs are generated and committed to `resume/pdf/` directory
- **On pull requests:** PDFs are generated as artifacts for preview before merging

### Manual Generation

To generate PDFs locally:

```bash
# Install tools
npm install -g resume-cli jsonresume-theme-elegant

# Generate PDFs
resume export resume/pdf/resume.en.pdf --resume resume/resume.en.json --format pdf --theme elegant
resume export resume/pdf/resume.fr.pdf --resume resume/resume.fr.json --format pdf --theme elegant
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

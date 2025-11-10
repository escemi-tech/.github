# Resume as Code

This directory contains the professional resume managed as code using the [JSON Resume](https://jsonresume.org/) format.

## Overview

The resume is stored in a structured JSON format that serves as the single source of truth for professional information across multiple platforms.

## Structure

### Files

- **`resume.json`** - Main resume data file in JSON Resume format with bilingual support (English/French)

## Format

The resume follows the [JSON Resume schema](https://jsonresume.org/schema/) with extensions for multi-language support:

### Bilingual Fields

Fields that support multiple languages use an object with language codes:

```json
{
  "label": {
    "en": "English text",
    "fr": "Texte français"
  }
}
```

### Supported Languages

- **en** - English
- **fr** - French (Français)

## Updating the Resume

1. Edit `resume.json` directly
2. Ensure both English (`en`) and French (`fr`) translations are provided for all bilingual fields
3. Commit the changes to trigger automated updates

## Validation

The resume data follows the JSON Resume schema v1.0.0. You can validate it using:

```bash
npm install -g resume-cli
resume validate resume.json
```

## LinkedIn Synchronization

**Important Note:** LinkedIn's Profile Edit API is restricted to approved LinkedIn Partner Program applications. Direct automated profile updates require special partnership approval from LinkedIn.

### Current Limitations

- LinkedIn API does not allow general developers to programmatically update profile details (headline, summary, etc.)
- Only approved partners can use the Profile Edit API
- Most automation tools can only post content, not edit profile information

### Recommended Approach

Until LinkedIn API access is granted:

1. **Manual Updates:** Use the resume.json as a reference when updating LinkedIn profile manually
2. **Apply for Partnership:** If automated updates are critical, apply for the [LinkedIn Partner Program](https://www.linkedin.com/help/linkedin/answer/a545236)
3. **Alternative Automation:** Consider using the workflow as a reminder/notification system when resume.json changes

### Workflow

The GitHub Actions workflow (`.github/workflows/sync-resume.yml`) is set up to:

1. Detect changes to `resume.json`
2. Validate the JSON structure
3. Create an issue or notification reminding to update LinkedIn profile manually

For future enhancement when API access is available, the workflow can be extended to use the LinkedIn API directly.

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
# Pretty print the resume
cat resume.json | jq .

# Extract English summary
cat resume.json | jq -r '.basics.summary.en'

# Extract French label
cat resume.json | jq -r '.basics.label.fr'

# List all skills
cat resume.json | jq -r '.skills[].name'
```

## References

- [JSON Resume Official Site](https://jsonresume.org/)
- [JSON Resume Schema](https://jsonresume.org/schema/)
- [JSON Resume Documentation](https://docs.jsonresume.org/)
- [LinkedIn Developer Documentation](https://learn.microsoft.com/en-us/linkedin/)

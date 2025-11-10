# Resume as Code

This directory contains the professional resume managed as code using the [JSON Resume](https://jsonresume.org/) format.

## Overview

The resume is stored in a structured JSON format that serves as the single source of truth for professional information across multiple platforms.

## Structure

### Files

- **`resume.en.json`** - English version of the resume following the standard JSON Resume schema
- **`resume.fr.json`** - French version of the resume following the standard JSON Resume schema

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

### Workflow

The GitHub Actions workflow (`.github/workflows/sync-resume.yml`) is set up to:

1. Detect changes to `resume.en.json` or `resume.fr.json`
2. Validate both files using `resume-cli validate` command
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

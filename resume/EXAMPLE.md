# Resume Update Example

This document shows examples of how to update the resume data.

## Important: Update Both Files

When making changes, always update **both** `resume.en.json` and `resume.fr.json` to keep them in sync. The only differences should be the language-specific text content.

## Updating Basic Information

### Changing the Professional Title/Headline

Edit both files and update the `label` field:

**resume.en.json:**
```json
"label": "Your New English Title"
```

**resume.fr.json:**
```json
"label": "Votre Nouveau Titre Français"
```

### Updating the Professional Summary

Edit the summary in both files:

**resume.en.json:**
```json
"summary": "Your new English summary..."
```

**resume.fr.json:**
```json
"summary": "Votre nouveau résumé en français..."
```

## Adding Work Experience

Add a new entry to the `work` array in both files:

**resume.en.json:**
```json
{
  "name": "Company Name",
  "position": "Position in English",
  "url": "https://company.com",
  "startDate": "2023-01",
  "endDate": "2024-12",
  "summary": "Brief description in English",
  "highlights": [
    "Achievement 1",
    "Achievement 2"
  ]
}
```

**resume.fr.json:**
```json
{
  "name": "Company Name",
  "position": "Poste en Français",
  "url": "https://company.com",
  "startDate": "2023-01",
  "endDate": "2024-12",
  "summary": "Brève description en français",
  "highlights": [
    "Réalisation 1",
    "Réalisation 2"
  ]
}
```

## Adding Skills

Add to the `skills` array in both files (skills can be the same or translated):

```json
{
  "name": "Skill Category Name",
  "level": "Master",
  "keywords": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ]
}
```

## After Making Changes

1. Validate both JSON files:
   ```bash
   jq empty resume.en.json && echo "✅ English valid"
   jq empty resume.fr.json && echo "✅ French valid"
   ```

2. Commit the changes:
   ```bash
   git add resume.en.json resume.fr.json
   git commit -m "Update resume: [describe your changes]"
   git push
   ```

3. The GitHub Actions workflow will automatically:
   - Validate both JSON files structure
   - Check that all required fields are present
   - Create an issue reminding you to update LinkedIn

4. Manually update your LinkedIn profile with the new information

## Tips

- Always update both English and French files
- Keep the structure identical between files
- Only text content should differ based on language
- Use consistent formatting and professional language
- Keep summaries concise but informative
- Test your JSON with `jq` before committing
- Validate using the official JSON Resume validator if available

## Quick Validation Script

Create this script to quickly validate both files:

```bash
#!/bin/bash
echo "Validating resume files..."
jq empty resume.en.json && echo "✅ resume.en.json valid" || echo "❌ resume.en.json invalid"
jq empty resume.fr.json && echo "✅ resume.fr.json valid" || echo "❌ resume.fr.json invalid"
```

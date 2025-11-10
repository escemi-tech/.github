# Resume Update Example

This document shows examples of how to update the resume data.

## Updating Basic Information

### Changing the Professional Title/Headline

Edit `resume.json` and update both English and French versions:

```json
"label": {
  "en": "Your New English Title",
  "fr": "Votre Nouveau Titre Français"
}
```

### Updating the Professional Summary

Edit the summary in both languages:

```json
"summary": {
  "en": "Your new English summary...",
  "fr": "Votre nouveau résumé en français..."
}
```

## Adding Work Experience

Add a new entry to the `work` array:

```json
{
  "name": "Company Name",
  "position": {
    "en": "Position in English",
    "fr": "Poste en Français"
  },
  "url": "https://company.com",
  "startDate": "2023-01",
  "endDate": "2024-12",
  "summary": {
    "en": "Brief description in English",
    "fr": "Brève description en français"
  },
  "highlights": [
    "Achievement 1",
    "Achievement 2"
  ]
}
```

## Adding Skills

Add to the `skills` array:

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

1. Validate the JSON:
   ```bash
   jq empty resume/resume.json
   ```

2. Commit the changes:
   ```bash
   git add resume/resume.json
   git commit -m "Update resume: [describe your changes]"
   git push
   ```

3. The GitHub Actions workflow will automatically:
   - Validate the JSON structure
   - Check that all bilingual fields are present
   - Create an issue reminding you to update LinkedIn

4. Manually update your LinkedIn profile with the new information

## Tips

- Always provide both English (`en`) and French (`fr`) versions for text fields
- Use consistent formatting and professional language
- Keep summaries concise but informative
- Update the `meta.lastModified` field when making significant changes
- Test your JSON with `jq` before committing

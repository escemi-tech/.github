# Custom Agents

This directory contains custom agent configurations for GitHub Copilot.

## Available Agents

### CV Coach (`cv-coach`)

An expert CV coach specializing in senior technical profiles: CTO, Lead Dev,
Architect, and Engineering Manager positions.

**Specializations:**

- Resume optimization
- Job letters
- LinkedIn profile optimization
- Job board optimization
- Portfolio generation

**Target Audience:**
Professionals with 15-20 years of experience in Lead/Expert/CTO positions,
seeking permanent contracts or freelance/part-time assignments.

**Key Features:**

- Transforms technical content into business-understandable language
- Focuses on measurable impacts and concrete metrics
- Optimizes content for ATS (Applicant Tracking Systems)
- Ensures content is scannable and readable in 6 seconds
- Integrates humanize-ai-lib for natural-sounding content

**Usage Example:** Ask the CV coach to review your resume, optimize a specific
section, or help craft job-specific content:

- "Review my CTO resume and suggest improvements"
- "Help me write a LinkedIn summary for a senior engineering role"
- "Transform my technical achievements into business impact statements"

## How Custom Agents Work

Custom agents are specialized AI assistants with domain-specific knowledge and
instructions. They appear as tools that you can interact with when using
GitHub Copilot in this repository.

## Adding New Custom Agents

To add a new custom agent:

1. Create a new YAML file in this directory
2. Define the agent's name, description, and instructions
3. Follow the YAML schema expected by GitHub Copilot
4. Validate the YAML syntax with `yamllint`
5. Document the agent in this readme

## YAML Structure

```yaml
---
name: agent-name
description: >-
  Brief description of the agent's purpose and capabilities.

instructions: |
  Detailed instructions for the agent, including:
  - Its role and expertise
  - Rules and guidelines to follow
  - Examples of good/bad outputs
  - Any specific methodologies or frameworks to use
```

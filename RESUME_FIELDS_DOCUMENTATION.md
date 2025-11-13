# JSON Resume - Unpopulated Fields Documentation

This document lists all fields from the JSON Resume Schema v1.0.0 that were **not populated** in the current resume files, along with suggestions on how to populate them.

## Currently Unpopulated Fields

### 1. Basics Section

#### Contact Information (Optional but Recommended for Public Resumes)

**`basics.email`** - Email address

- **Type**: string
- **Format**: Must be valid email format
- **Example**: `"emilien.escalle@example.com"`
- **Suggestion**: Add professional email address if you want to be contacted via the resume
- **Privacy Note**: May be omitted for privacy reasons

**`basics.phone`** - Phone number

- **Type**: string
- **Format**: Include country code (recommended)
- **Example**: `"+33 6 XX XX XX XX"`
- **Suggestion**: Add professional phone number with country code
- **Privacy Note**: May be omitted for privacy reasons

**`basics.image`** - Profile image URL

- **Status**: ✅ Populated with `https://raw.githubusercontent.com/escemi-tech/.github/main/headshots/primary.jpg`. An alternate framing is available at `headshots/secondary.jpg` if future templates need variety.
- **Technical Note**: Both files live under `headshots/` so PDF generators and static sites can embed them directly via raw GitHub URLs.

#### Location Details (Optional)

**`basics.location.address`** - Street address

- **Type**: string
- **Format**: Multi-line addresses use `\n`
- **Example**: `"123 Rue de la République"`
- **Suggestion**: Usually omitted for privacy; only add if necessary for legal/administrative reasons
- **Privacy Note**: Highly recommended to omit

**`basics.location.postalCode`** - Postal/ZIP code

- **Type**: string
- **Example**: `"13100"`
- **Suggestion**: Can be added if you want to specify your general area without giving exact address
- **Privacy Note**: Consider omitting or using just the first part (e.g., "13" for Bouches-du-Rhône)

> ✅ `basics.location.city` and `basics.location.region` are now populated (`Aix-en-Provence`, `Provence-Alpes-Côte d'Azur`). Only address/postal code remain optional.

### 2. Work Section

#### Company URLs (Recommended, where available)

**`work[].url`** - Company site URL

- **Type**: string
- **Format**: Valid URI
- **Status**: All active companies now link to the correct sites. **Ouistiti** and **Multiwizz** no longer operate, so there is no authoritative site to reference and their `url` field is intentionally omitted.
- **Suggestion**: If successor pages or archival content ever becomes available, feel free to add the corresponding URLs; otherwise the current omission is acceptable and documented here for clarity.

### 3. Volunteer Section

> ✅ Organization URLs are now added for both Cloud Native Aix-Marseille and Aix-Marseille Université. No remaining gaps in this section.

### 4. Education Section

> ✅ Institution URLs have been added for Université Aix-Marseille III and IUT GEA Gap.

**`education[].score`** - GPA or grades

- **Type**: string
- **Format**: Free text (e.g., "3.8/4.0", "Mention Bien", "First Class Honours")
- **Example**: `"Mention Bien"` (Good honours) or `"Mention Très Bien"` (High honours)
- **Suggestion**: Add if you graduated with honours/distinction
- **Note**: Optional and often omitted for experienced professionals

**`education[].courses`** - Notable courses

- **Type**: array of strings
- **Examples**:
  ```json
  [
    "Software Architecture and Design Patterns",
    "Distributed Systems",
    "Database Management",
    "Project Management",
    "Enterprise Resource Planning"
  ]
  ```
- **Suggestion**: Add key courses relevant to your technical expertise
- **Note**: More relevant for recent graduates; experienced professionals often omit this

### 5. Awards Section (Currently Empty)

**`awards[]`** - Professional awards and recognitions

- **Type**: array of objects
- **Required Fields**: `title`
- **Optional Fields**: `date`, `awarder`, `summary`
- **Structure**:
  ```json
  {
    "title": "Award title",
    "date": "YYYY-MM-DD",
    "awarder": "Organization name",
    "summary": "Brief description of the award"
  }
  ```
- **Suggestions**:
  - Professional certifications achievements
  - Company/team performance awards
  - Innovation or technical excellence awards
  - Speaking/presentation awards at conferences
  - Open source contribution recognition
- **When to Add**: If you have received any professional recognition or awards

### 6. Certificates Section (Partially Populated)

**`certificates[]`** - Professional certifications

- **Type**: array of objects
- **Required Fields**: `name`
- **Optional Fields**: `date`, `issuer`, `url`
- **Structure**:
  ```json
  {
    "name": "Certification name",
    "date": "YYYY-MM-DD",
    "issuer": "Issuing organization",
    "url": "Verification URL"
  }
  ```
- **Now Added**: `LFC102: Inclusive Open Source Community Orientation (The Linux Foundation, 2024-11-01)` with verification link. This demonstrates inclusive leadership commitments in community spaces.
- **Highly Relevant Suggestions Based on Your Profile**:

  **Cloud Certifications**:
  - AWS Certified Solutions Architect (if you have it)
  - AWS Certified DevOps Engineer
  - Google Cloud Professional Cloud Architect
  - Azure Solutions Architect Expert

  **Kubernetes & Cloud Native**:
  - Certified Kubernetes Administrator (CKA)
  - Certified Kubernetes Application Developer (CKAD)
  - Certified Kubernetes Security Specialist (CKS)

  **DevOps & Automation**:
  - HashiCorp Terraform Associate/Professional
  - Docker Certified Associate

  **Methodology**:
  - Certified Scrum Master (CSM)
  - SAFe certifications
  - Lean/Agile certifications

  **Security**:
  - CISSP or related security certifications

- **When to Add**: If you hold any of these certifications, adding them strengthens your profile significantly

### 7. Publications Section (Currently Empty)

**`publications[]`** - Technical articles, blog posts, papers

- **Type**: array of objects
- **Required Fields**: `name`
- **Optional Fields**: `publisher`, `releaseDate`, `url`, `summary`
- **Structure**:
  ```json
  {
    "name": "Publication title",
    "publisher": "Publisher/Platform name",
    "releaseDate": "YYYY-MM-DD",
    "url": "Publication URL",
    "summary": "Brief description"
  }
  ```
- **Suggestions**:
  - Technical blog posts on Medium, Dev.to, or personal blog
  - Articles on LinkedIn
  - Technical documentation you've authored
  - Conference presentation materials
  - White papers or technical guides
  - Community contributions (tutorials, how-to guides)
- **Examples**:
  ```json
  {
    "name": "Building Scalable Microservices with Node.js",
    "publisher": "Medium",
    "releaseDate": "2023-05-15",
    "url": "https://medium.com/@username/article-slug",
    "summary": "A comprehensive guide to microservices architecture patterns"
  }
  ```
- **When to Add**: If you've written any technical content publicly

### 8. Skills Section - Additional Details

While skills are populated, you could consider adding:

**More Specific Technologies**:

- Specific frameworks: Express.js, NestJS, Laravel, Symfony
- Databases: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
- Message queues: RabbitMQ, Kafka, SQS
- Container orchestration: Kubernetes, Docker Swarm, ECS
- Cloud platforms: AWS, GCP, Azure (specific services)
- Monitoring: Prometheus, Grafana, ELK Stack
- Testing: Jest, PHPUnit, Selenium, Cypress

### 9. Interests Section (Now Populated)

> ✅ Completed: six curated interest blocks now describe Cloud Native, DevX, architecture, open source, education, and Lean/Agile topics.

### 10. References Section (Currently Empty)

**`references[]`** - Professional references

- **Type**: array of objects
- **Required Fields**: `name`
- **Optional Fields**: `reference`
- **Structure**:
  ```json
  {
    "name": "Reference name and title",
    "reference": "Reference statement or 'Available upon request'"
  }
  ```
- **Common Approach**:
  ```json
  [
    {
      "name": "Professional References",
      "reference": "Available upon request"
    }
  ]
  ```
- **When to Add**:
  - Standard practice is to omit or use "Available upon request"
  - Only add specific references if they've given explicit permission
  - More common in academic or certain corporate contexts

### 11. Projects Section (Now Populated)

> ✅ Completed: Featured projects now highlight `twbs-helper-module`, `php-css-lint`, and `ubuntu-config` with descriptions, highlights, and roles.

### 12. Meta Section (Now Present)

> ✅ Added: Both resume files now expose `meta.canonical`, `meta.version`, and `meta.lastModified` for traceability.

## Priority Recommendations

### High Priority (Immediate Impact)

1. **Contact channel** - Add a professional `basics.email` and/or `basics.phone` (plus an optional profile image) if you're comfortable being contacted directly from the resume.

### Medium Priority (Enhanced Professionalism)

1. **`certificates[]`** - Expand beyond LFC102 with other cloud, Kubernetes, DevOps, or agile credentials (CKA, AWS SA, Terraform, etc.).
2. **`publications[]`** - Capture talks, blog posts, or white papers you authored.
3. **`education[].score` / `education[].courses`** - Mention honours or flagship coursework to add academic color.
4. **`references[]`** - Add either "Available upon request" or named references with permission.

### Low Priority (Optional)

1. **`basics.location.address` / `postalCode`** - Only if administrative precision is needed; otherwise it's fine to omit.
2. **`awards[]`** - Document recognitions or distinctions when available.

## Summary Statistics

- **Total Schema Fields**: ~35 distinct field types
- **Currently Populated**: ~28 fields (~80%)
- **Required but Missing**: 0 (all required fields present)
- **Recommended but Missing**: ~4 high-value fields (contact channel, additional certifications, publications, references)
- **Optional Missing**: ~4 low-priority fields (address/postal code granularity, awards, other nice to have extras)

## Validation Status

✅ Both resume files are **valid** against JSON Resume Schema v1.0.0
✅ All dates use ISO 8601 format
✅ All required fields are present
✅ No structural errors

## Next Steps

1. Decide whether to share a professional email/phone/image for outbound contact and privacy expectations.
2. Gather additional certification details (name, issuer, date, verification URL) to expand the `certificates[]` section beyond LFC102.
3. List any talks, articles, or white papers you can reference inside `publications[]`.
4. If available, note honours/courses or add a "References available upon request" entry.

---

**Note**: All missing fields are **optional** according to the JSON Resume specification. The current resume is complete and valid with all essential information populated.

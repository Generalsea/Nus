# ADR-0003 — Client Core Domain

Status: Accepted for Phase 11 Milestone 2
Date: 2026-10-03

## Decision

NUS represents a client as a tenant-owned operational record, not as a full CRM contact object.

### Stored fields

- organization_id
- created_by_user_id
- full_name
- phone
- email
- preferred_contact_method
- status (active / archived)
- lead_source
- timestamps

Notes are separate records in client_notes and belong to the same organization and client.

### Rationale

The model supports the daily operating assistant without prematurely adding CRM complexity. lead_source is retained because later commercial analysis needs acquisition-source evidence; it does not represent customer value by itself.

### Security

Every client and note is tenant-scoped through RLS.

Normal client update grants expose only mutable business fields. Organization and authorship keys are not writable through normal Data API updates.

Client lifecycle activity is written transactionally by database triggers into the existing activity_events stream.

### Non-decisions

No tags, scoring, pipeline stages, custom fields, lead/opportunity objects, or automated segmentation are introduced in this milestone.

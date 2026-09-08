# EduHostel OS

> **Policy-Driven Hostel Allocation Engine with Roommate Compatibility Matching**  
> *Academic Session 2026–2027 Residential Housing Management Platform*

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Overview

**EduHostel OS** is a university residential housing management system designed to replace opaque spreadsheets with an auditable, constraint-based allocation and roommate compatibility engine.

Bed-level allocation enforces university policy automatically, matches student lifestyles using consented encrypted responses, and provides wardens with visual floor maps, override logging, and cryptographic QR allotment letters.

---

## Key Modules & Features

- **M1: Hierarchical Inventory Model**: Full campus hierarchy (`Hostel` → `Block` → `Floor` → `Room` → `Bed`) with attributes (AC/Non-AC, Attached Washroom, PwD Ground-Floor Accessibility). Supports bulk JSON/CSV import/export.
- **M2 & M3: Policy & Eligibility Rules Engine**: Automated checks for tuition clearance, academic probation (CGPA >= 5.00), disciplinary records, and distance priority (outstation prioritized over local students <= 25km). Each check produces human-readable pass/fail reasons.
- **M4 & M5: Consented Lifestyle Matching & Privacy**: Encrypted at rest lifestyle preferences (sleep schedule, study habits, cleanliness, guest frequency) with 0–100% pairwise roommate compatibility scoring.
- **M6: Seeded Deterministic PRNG Allocation Engine**: 100% reproducible allocation using seeded pseudo-random heuristics with zero hard-constraint violations (Gender separation, Room capacity, PwD accessibility guarantee) and per-assignment explainability traces.
- **M7: Visual Warden Bed Map & Manual Reassignment**: Floor-by-floor interactive bed map with drag-and-drop reassignment, mandatory audit reason requirement, and audit logging.
- **M8: Administrative Governance**: Strict state machine: `Draft` allocations cannot be published or viewed as official letters until signed off by the hostel warden.
- **M9: Printable Allotment Letter & QR Verification**: Generates printable allotment letters with verification QR codes linked to the public verification portal (`/verify`). Includes Dean of Student Welfare (DSW) analytics with CSV export.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deterministic PRNG**: `seedrandom`
- **QR Codes**: `qrcode`
- **Testing**: `tsx` test suites with negative tests

---

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YashCoder-svg/EduHostel.git
cd EduHostel

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Test Suite

Verify all 6 verification test suites (encryption, rule engines, PRNG reproducibility, zero hard-constraint violations, warden governance negative tests, override enforcement):

```bash
npm test
```

### Building for Production

```bash
npm run build
npm run start
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Public Landing Page with live telemetry & policy guidelines |
| `/student` | Student Portal (Eligibility verification, ranked preferences, lifestyle matching) |
| `/warden` | Warden Review Console & Interactive Visual Bed Map |
| `/admin` | Inventory Management, CSV/JSON Importer, and PRNG Allocation Engine |
| `/analytics` | DSW Executive Analytics Dashboard & CSV Exporter |
| `/verify` | Public Allotment Letter QR Cryptographic Verifier |

---

## License

This project is licensed under the MIT License.

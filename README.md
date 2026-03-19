# Mock EMR Risk Adjustment

Mock EMR Risk Adjustment is a browser-based training and demonstration app for explaining **medical coding**, **risk adjustment thinking**, and **chart review workflow** in a hands-on way.

It presents a realistic-looking mock chart with generated patients, encounters, problem lists, medications, labs, vitals, imaging, and past medical history. Users can review the chart, highlight supporting documentation, and build a printable coding worksheet from the evidence they find.

## Why this app exists

This project was created to make medical coding easier to explain to people who are curious about it, unfamiliar with it, or considering learning it.

It is especially useful for:

- **Explaining what medical coders do** using an interactive chart instead of an abstract description.
- **Demonstrating risk-adjustment chart review concepts** in a safe, mock environment.
- **Helping newer coders practice** identifying diagnoses, support, contradictions, and documentation gaps.
- **Creating printable worksheets** that can be used for self-study, training discussions, or guided review exercises.

In short, this app is part explainer, part simulator, and part lightweight training tool.

## What the app does

The application generates a mock patient chart from predefined clinical scenarios and lets the user review that chart the way a coder or auditor might.

Core capabilities include:

- **Generated mock patient scenarios** with chronic-condition-driven chart content.
- **Tabbed chart review** across encounters, problem list, past medical history, medications, labs, vitals, and imaging.
- **Search across the chart** to quickly locate diagnoses, evidence, and related documentation.
- **Highlight-to-capture workflow** so users can pull diagnosis text and supporting evidence directly from the chart into a worksheet.
- **Coding worksheet management** with annotation types such as Supported, Contradictory, Not Supported, Query Needed, Suspect Condition, and General Note.
- **Printable output** for either the full chart or the worksheet plus referenced chart sections.
- **Session persistence in the browser** so the current chart, tab, and annotations remain available between refreshes.
- **Dark mode support** for readability and preference.

## Intended audiences

This app can be useful for several kinds of users:

### 1. People who want to understand medical coding
If someone asks what medical coding is or what a coding review looks like, this app gives you a practical, visual example. Instead of describing the process in theory, you can show how a reviewer moves through chart sections, finds diagnoses, and checks whether the documentation supports them.

### 2. New coders and trainees
The app works well as an introductory practice environment. A learner can:

- read a chart,
- identify possible coded conditions,
- capture supporting documentation,
- notice contradictions or weak support,
- and organize findings into a worksheet.

Because the chart is mock data, it is safer and simpler for training than using real records.

### 3. Trainers, mentors, and educators
The printable worksheets and chart outputs make the app useful for informal teaching, one-on-one instruction, or small-group walkthroughs. It can support exercises such as:

- “Find the best-supported diagnosis.”
- “What documentation contradicts the assessment?”
- “What would need a provider query?”
- “Which conditions appear chronic, active, or risk-adjustment relevant?”

## How the workflow feels in the app

A typical review session looks like this:

1. Generate or open a mock patient chart.
2. Review chart sections such as encounters, labs, medications, and imaging.
3. Search for relevant terms or conditions.
4. Highlight diagnosis text or supporting evidence directly in the chart.
5. Add that information to the coding worksheet.
6. Mark the annotation type based on whether the condition is supported, contradictory, incomplete, or needs follow-up.
7. Print the worksheet or the full supporting chart for training or discussion.

## Example scenarios included

The generated mock charts are based on predefined condition-driven scenarios. Examples in the codebase include combinations such as:

- Diabetes with chronic kidney disease
- Congestive heart failure
- Rheumatoid arthritis with lung disease
- Cirrhosis

These scenarios are designed to create realistic review situations with chronic conditions, supporting evidence, and occasional contradictions that are useful for teaching chart interpretation.

## Important note

This app uses **mock/generated data** for education and demonstration. It is **not** intended for real patient care, production coding, billing, compliance decisions, or official clinical documentation use.

## Tech stack

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Radix UI** primitives

## Getting started

### Prerequisites

- **Node.js 18+** recommended
- **npm**

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in your terminal.

### Build

```bash
npm run build
```

### Build for GitHub Pages

```bash
npm run build:pages
```

### Build docs output

```bash
npm run build:docs
```

## Project structure

```text
src/
  App.tsx                    Main application shell and workflow
  components/
    chart-sections.tsx       Chart viewer tabs and record display
    worksheet.tsx            Annotation and print workflow
  lib/
    generatePatient.ts       Mock patient/scenario generation
    chart-search.ts          Cross-chart search
    print.ts                 Printable worksheet/chart output
  types/
    patient.ts               Core domain types
```

## Summary

If you need a simple way to **show what medical coding work looks like**, or you want a **beginner-friendly chart review practice tool**, this app is built for that purpose.

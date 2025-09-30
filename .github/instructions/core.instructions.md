---
applyTo: "**"
description: "開発の方針と対話に関して基本的なルールを設定します。"
---

# Development Rules

Follow the KISS principle.

- Safety > Convenience: Prioritize bug prevention above all
- Readability > Performance: Prioritize ease of understanding

# Dialogue Rules

- Always ask questions one at a time
- Keep responses concise
- Always confirm if inferences are correct

# Documentation Language Rules

- Write all documentation in Japanese
- Add English terms in parentheses for important nouns: ユーザ（User）
- Keep code blocks and technical identifiers in English
- Keep all section headings in English format
- Use Japanese for content under English headings
- This applies to copilot-instructions.md and other documentation files

Example format:
\`\`\`markdown
## Game System
ゲームシステム（Game System）の説明をここに日本語で書く。

### Core Mechanics
コア機能（Core Mechanics）について日本語で説明する。
\`\`\`

# copilot-instructions.md Template

The following section names must never be changed:

\`\`\`markdown
# Overview
[Application overview description in Japanese]

## Directory Structure
[Directory structure with English comments in code blocks]

## Technical Features
[Technology stack description in Japanese]

## Decoupled Design
[System separation policy in Japanese]

## Core Location
[Core functionality placement in Japanese]

## System Independence
[Independence of each system in Japanese]

## Product Specifications
[Important product specifications in Japanese]
\`\`\`

## Optional Sections

You can add additional level 2 headings (##) as needed for supplementary information.
Use level 3 headings (###) to organize content within sections.

\`\`\`markdown
## Domain Systems
[Domain-specific systems - for special business logic]

### Specific Domain A
[Detailed explanation in Japanese]

### Specific Domain B
[Detailed explanation in Japanese]

## API Design
[API design policy - for API-centric projects]
\`\`\`

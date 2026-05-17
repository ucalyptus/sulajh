# Security Policy

## About Sulajh

Sulajh is an AI-assisted mediation platform. It handles sensitive case data, personal information, and legal communications. We take security seriously and appreciate responsible disclosure.

## Supported Versions

This project is in active development. Only the latest deployment on the `main` branch receives security updates.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |
| older commits | ❌  |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report vulnerabilities by emailing: **forkbabu@gmail.com**

Include:
- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

You can expect an acknowledgement within **48 hours** and a status update within **7 days**.

## Scope

Areas of particular concern given the nature of this platform:

- Authentication and session management (`/app/auth`, `next-auth`)
- Case data access controls (claimant / neutral / registrar roles)
- AI prompt injection via user-submitted case content
- File upload handling
- API route authorization (`/app/api`)

## Out of Scope

- Rate limiting / brute-force on non-sensitive endpoints
- Self-XSS
- Clickjacking on pages without sensitive actions
- Social engineering

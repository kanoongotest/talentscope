/**
 * PURPOSE: Pre-loaded sample candidate profiles for Analyzer demo
 * OUTPUTS: Three sample profiles (strong, average, red-flag) with resume text and Q&A
 * RELATIONSHIPS: Used by sample-profiles-loader.tsx, app/api/analyzer/samples/route.ts
 */

export interface SampleProfile {
  label: string
  accent: 'green' | 'amber' | 'red'
  candidateName: string
  resumeText: string
  applicationAnswers: { question: string; answer: string }[]
  additionalContext: string
  roleType: string
  seniorityLevel: string
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    label: 'Strong Candidate',
    accent: 'green',
    candidateName: 'Alex Chen',
    roleType: 'WordPress Developer',
    seniorityLevel: 'Senior',
    resumeText: `Alex Chen — Senior WordPress Engineer
8 years of professional WordPress development experience.

EXPERIENCE:
• Senior Engineer at 10up (2020–Present) — Led development of enterprise WordPress solutions for Fortune 500 clients. Architected custom Gutenberg block libraries used across 12 client sites. Built headless WordPress + React frontends. Mentored 4 junior developers.
• WordPress Developer at Human Made (2018–2020) — Developed custom plugins for large-scale multisite installations. Implemented WP-CLI automation scripts reducing deployment time by 60%. Contributed to WordPress core (3 accepted patches).
• Frontend Developer at Developer Agency (2016–2018) — Built WordPress themes and plugins for agency clients. Transitioned from jQuery to React. Introduced automated testing with PHPUnit.

TECHNICAL SKILLS:
PHP, JavaScript/TypeScript, React, Next.js, WordPress Plugin Development, Gutenberg Block Development, WP REST API, WP-CLI, GraphQL (WPGraphQL), MySQL, Redis, Docker, AWS, CI/CD (GitHub Actions), PHPUnit, Jest

AI TOOLS: Daily user of Claude and Cursor for development. Built internal prompt library for code review automation. Experimented with AI-assisted plugin scaffolding.

EDUCATION: B.S. Computer Science, University of Washington

OPEN SOURCE: Maintainer of gutenberg-blocks-toolkit (450+ GitHub stars). Regular contributor to WordPress core and WPGraphQL.

REMOTE: Fully remote since 2018. Based in Portland, OR (PST timezone).`,
    applicationAnswers: [
      {
        question: 'Describe a complex WordPress architecture decision you made recently.',
        answer: 'At 10up, I led the migration of a major media client from a monolithic WordPress theme to a headless architecture using Next.js on the frontend and WordPress as a pure CMS backend via WPGraphQL. The key tradeoff was preview functionality — headless WordPress loses native previews. I built a custom preview proxy that intercepts WordPress preview requests and routes them to a Next.js preview mode endpoint, maintaining the editorial experience while gaining the performance benefits of static generation. The site went from 4.2s to 0.8s average load time.',
      },
      {
        question: 'How do you approach debugging a performance issue in WordPress?',
        answer: 'I follow a systematic approach: 1) Query Monitor plugin to identify slow database queries and hook bottlenecks, 2) Xdebug profiling for PHP-level bottlenecks, 3) Browser DevTools for frontend rendering issues. Recently debugged a site where admin pages took 12 seconds to load — Query Monitor revealed 847 database queries on a single admin page caused by a poorly written meta query in a custom post type loop. Fixed it with a single JOIN query and object caching, brought it down to 0.9 seconds.',
      },
      {
        question: 'How do you use AI tools in your development workflow?',
        answer: 'Claude is my primary tool for architecture discussions — I describe a system design problem and iterate on approaches before writing code. Cursor handles my day-to-day coding with autocomplete that understands WordPress patterns. I built a shared prompt library at 10up with 20+ tested prompts for common tasks: writing PHPUnit tests for plugins, generating Gutenberg block boilerplate, and reviewing PR diffs for security issues. The team estimates we save 4-6 hours per week.',
      },
    ],
    additionalContext: 'Referred by our engineering lead. Active GitHub with 450+ stars on a Gutenberg blocks library. Has spoken at WordCamp US twice.',
  },
  {
    label: 'Average Candidate',
    accent: 'amber',
    candidateName: 'Jordan Smith',
    roleType: 'WordPress Developer',
    seniorityLevel: 'Mid-Level',
    resumeText: `Jordan Smith — WordPress Developer
4 years of WordPress development experience.

EXPERIENCE:
• WordPress Developer at WebCraft Studio (2022–Present) — Build and maintain WordPress sites for small business clients. Customize themes using Elementor and custom CSS. Handle plugin configuration and updates. Some custom plugin development.
• Junior Developer at Digital Starter Agency (2020–2022) — Started as an intern, promoted to junior developer. Built WordPress sites using page builders. Learned PHP and basic plugin modification. Handled client support tickets.

TECHNICAL SKILLS:
PHP, HTML/CSS, JavaScript, jQuery, WordPress Theme Customization, Elementor, ACF (Advanced Custom Fields), WooCommerce, Basic MySQL, Git, cPanel

EDUCATION: Web Development Bootcamp Certificate, 2020

REMOTE: Hybrid role — 3 days remote, 2 days office. Based in Austin, TX.`,
    applicationAnswers: [
      {
        question: 'What WordPress projects are you most proud of?',
        answer: 'I built a WooCommerce store for a local retail chain with about 500 products. I customized the theme, set up the product catalog, and integrated a shipping calculator plugin. The client was really happy with the result and it increased their online sales by 30%. I also built a membership site using MemberPress which was more complex than my usual projects.',
      },
      {
        question: 'How do you stay current with WordPress development?',
        answer: 'I follow WordPress news sites and try to attend the local WordPress meetup when I can. I watch tutorial videos on YouTube for new features. I recently started learning about Gutenberg blocks but haven\'t built any custom ones yet.',
      },
    ],
    additionalContext: '',
  },
  {
    label: 'Red Flag Candidate',
    accent: 'red',
    candidateName: 'Taylor Reed',
    roleType: 'WordPress Developer',
    seniorityLevel: 'Senior',
    resumeText: `Taylor Reed — Full Stack Developer & AI Expert
6 years of web development experience with deep WordPress expertise.

EXPERIENCE:
• Senior Developer at E-Commerce Solutions Inc (2022–Present) — Lead developer for Shopify Plus storefronts. Manage team of 3 developers. Implement custom Liquid templates and Shopify APIs.
• Web Developer at SquareSpace Partners (2020–2022) — Built and launched 50+ Squarespace websites. Handled DNS, email configuration, and third-party integrations.
• WordPress Developer at FreelanceHub (2019–2020, 8 months) — Built a few WordPress sites for local clients. Used pre-built themes and plugins.
• Intern at TechStart (2018–2019) — General web development tasks, HTML/CSS/JavaScript.

TECHNICAL SKILLS:
HTML, CSS, JavaScript, PHP, Shopify Liquid, WordPress, React, Node.js, Python, AI/ML, Prompt Engineering, ChatGPT Expert, Full Stack Architecture, Cloud Computing, DevOps, Microservices

AI EXPERTISE: Pioneer in AI-driven development. Leveraging cutting-edge AI technologies to revolutionize software delivery. Expert in prompt engineering and AI-augmented workflows.

EDUCATION: Self-taught developer. Multiple online course certificates.

REMOTE: Open to remote work. Previous roles were office-based.`,
    applicationAnswers: [
      {
        question: 'Describe your WordPress development experience in detail.',
        answer: 'I have extensive experience leveraging the WordPress ecosystem to deliver enterprise-grade solutions. My holistic approach combines cutting-edge technologies with proven methodologies to create synergistic outcomes. I\'m passionate about pushing the boundaries of what\'s possible with WordPress and bringing innovative solutions to complex challenges.',
      },
      {
        question: 'How do you use AI in your work?',
        answer: 'As an AI pioneer, I\'ve been at the forefront of integrating artificial intelligence into the development lifecycle. I leverage AI across all aspects of my work to maximize efficiency and drive innovation. My deep understanding of prompt engineering enables me to extract maximum value from AI tools, resulting in 10x productivity gains.',
      },
    ],
    additionalContext: 'Found via job board. Resume looks polished but something feels off.',
  },
]

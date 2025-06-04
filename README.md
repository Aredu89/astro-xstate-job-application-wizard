# Multi-step Job Application

This is a multi-step job application form built with Astro, Solid.js, and XState.
It guides users through entering personal info, experience, portfolio links, and uploading a resume, with validation at each step.
The state machine handles the form flow and transitions, while the file upload step is delegated to a child machine for isolated validation logic.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

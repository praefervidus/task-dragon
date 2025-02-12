# Task Dragon

*This is for developer reference only.*

Fresh project guide here: https://fresh.deno.dev/docs/getting-started

## Requirements

- Deno: https://deno.land/manual/getting_started/installation
- Bulma: https://bulma.io/documentation/start/installation

## Quick Start

To start the development server:

```
deno task start
```

This will watch the project directory and restart as necessary.
If you now visit http://localhost:8000, you can see the running project.

Advanced and probably unnecessary:

```
deno run -A --watch=static/,routes/ main.ts
```

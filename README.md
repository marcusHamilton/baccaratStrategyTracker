# Getting Started

1. Install Deno:
    - https://deno.land/manual/getting_started/installation
    - Or just use `brew install deno`

2. Run the project:
    - `deno task start`
    - See it on http://localhost:8000/

# Development
- All changes should be merged into the `development` branch and reviewed before going to master for deployment.

# Deployment

- The project is automatically delpoyed when changes happen to master.
- A beta build can be pushed up with `deno task deploy`
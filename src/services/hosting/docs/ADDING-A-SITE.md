# Adding a New Site

1. Run: `mpc add <domain> [--framework react|angular] [--path /subpath]`
2. Build your React/Angular app inside `sites/<folder>/src/`
3. `git add . && git commit -m "feat: add <domain>" && git push`
4. Done. CI builds it. Server serves it.

## Example

```bash
mpc add citizengardens.org/lambdaproof --framework react
cd sites/citizengardens.org--lambdaproof
npm install
npm run dev
```

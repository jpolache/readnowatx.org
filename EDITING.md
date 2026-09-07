# Editing this site

Static HTML, no build step. Publishing = push to `main`; GitHub Pages
redeploys automatically (~1-2 min).

## Make a change

1. Pull latest:  Source Control panel -> ... -> Pull   (or `git pull`)
2. Edit the `.html` / `style.css` / `script.js` files in VSCode.
3. Preview:  right-click `index.html` -> "Open with Live Server"
   (http://127.0.0.1:5500, auto-reloads on save). Local == production.
4. Commit:  Source Control panel (Ctrl+Shift+G) -> stage -> message -> Commit
5. Push:  "Sync Changes"   (or `git push`)
6. Verify:  GitHub repo -> Actions tab -> wait for "pages build and deployment"
   to go green, then hard-refresh https://jpolache.github.io/readnowatx.org/
   (Ctrl+Shift+R).

## Site settings

- Settings -> Pages: Deploy from a branch, `main`, `/ (root)`.
- Currently served at https://jpolache.github.io/readnowatx.org/ (project page).
- To use readnowatx.org later: set the custom domain in Settings -> Pages, add a
  `CNAME` file containing `readnowatx.org`, and point DNS at GitHub.

## Notes

- Images live in `images/`. Reference them as `images/<file>` (relative).
- Keep internal links relative (`index.html`, `about.html`) - no leading `/`.
- Forms post to Formspree; there is no backend.


# Hugo Starter for Theory of Taste

## Deploy (no local install)
1) Create a new **public** GitHub repo, e.g. `theory-of-taste`.
2) Upload all files/folders from this archive to that repo.
3) In Netlify: **Add new site** → **Import an existing project** → select your repo.
   - Build command: `hugo --minify`
   - Publish directory: `public`
4) Wait for deploy. Use the Netlify URL, or connect your custom domain in **Domain management**.

## Edit your essay
- Open `content/_index.md` in GitHub and click **Edit**.
- Add images to `static/images/` and reference as `![Alt](/images/filename.jpg "Caption")`.
- Embed YouTube with: `{{< youtube VIDEO_ID >}}`.

## Optional local preview
- Install Hugo, then run `hugo server` in the project folder.

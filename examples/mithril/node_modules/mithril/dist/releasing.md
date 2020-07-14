# Mithril Release Processes

**Note** These steps all assume that `MithrilJS/mithril.js` is a git remote named `mithriljs`, adjust accordingly if that doesn't match your setup.

- [Releasing a new Mithril version](#releasing-a-new-mithril-version)
- [Updating mithril.js.org](#updating-mithriljsorg)
- [Releasing a new ospec version](#releasing-a-new-ospec-version)

## Releasing a new Mithril version

### Prepare the release

1. Ensure your local branch is up to date

```bash
$ git checkout next
$ git pull --rebase mithriljs next
```

2. Determine patch level of the change
3. Update information in `docs/change-log.md` to match reality of the new version being prepared for release
4. Replace all existing references to `mithril@next` to `mithril` if moving from a release candidate to stable.
    - Note: if making an initial release candidate, don't forget to move all the playground snippets to pull from `mithril@next`!
5. Commit changes to `next`

```
$ git add .
$ git commit -m "Preparing for release"

# Push to your branch
$ git push

# Push to MithrilJS/mithril.js
$ git push mithriljs next
```

### Merge from `next` to `master`

6. Switch to `master` and make sure it's up to date

```bash
$ git checkout master
$ git pull --rebase mithriljs master
```

7. merge `next` on top of it

```bash
$ git merge next
```

8. Clean & update npm dependencies and ensure the tests are passing.

```bash
$ npm prune
$ npm i
$ npm test
```

### Publish the release

9. `npm run release <major|minor|patch|semver>`, see the docs for [`npm version`](https://docs.npmjs.com/cli/version)
10. The changes will be automatically pushed to your fork
11. Push the changes to `MithrilJS/mithril.js`

```bash
$ git push mithriljs master
```

12. Travis will push the new release to npm & create a GitHub release

### Merge `master` back into `next`

This helps to ensure that the `version` field of `package.json` doesn't get out of date.

13. Switch to `next` and make sure it's up to date

```bash
$ git checkout next
$ git pull --rebase mithriljs next
```

14. Merge `master` back onto `next`

```bash
$ git merge master
```

15. Push the changes to your fork & `MithrilJS/mithril.js`

```bash
$ git push
$ git push mithriljs next
```

### Update the GitHub release

16. The GitHub Release will require a manual description & title to be added. I suggest coming up with a fun title & then copying the `docs/change-log.md` entry for the build.

## Updating mithril.js.org

Fixes to documentation can land whenever, updates to the site are published via Travis.

```bash
# These steps assume that MithrilJS/mithril.js is a git remote named "mithriljs"

# Ensure your next branch is up to date
$ git checkout next
$ git pull mithriljs next

# Splat the docs folder from next onto master
$ git checkout master
$ git checkout next -- ./docs

# Manually ensure that no new feature docs were added

$ git push mithriljs
```

After the Travis build completes the updated docs should appear on https://mithril.js.org in a few minutes.

**Note:** When updating the stable version with a release candidate out, ***make sure to update the index + navigation to point to the new stable version!!!***

## Releasing a new ospec version

1. Ensure your local branch is up to date

```bash
$ git checkout next
$ git pull --rebase mithriljs next
```

2. Determine patch level of the change
3. Update `version` field in `ospec/package.json` to match new version being prepared for release
4. Commit changes to `next`

```
$ git add .
$ git commit -m "chore(ospec): ospec@<version>"

# Push to your branch
$ git push

# Push to MithrilJS/mithril.js
$ git push mithriljs next
```

### Merge from `next` to `master`

5. Switch to `master` and make sure it's up to date

```bash
$ git checkout master
$ git pull --rebase mithriljs master
```

6. merge `next` on top of it

```bash
$ git checkout next -- ./ospec
$ git add .
$ git commit -m "chore(ospec): ospec@<version>"
```

7. Ensure the tests are passing!

### Publish the release

8. Push the changes to `MithrilJS/mithril.js`

```bash
$ git push mithriljs master
```

9. Publish the changes to npm **from the `/ospec` folder**. That bit is important to ensure you don't accidentally ship a new Mithril release!

```bash
$ cd ./ospec
$ npm publish
```

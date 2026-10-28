---
name: spec-to-automation
description: Turn a Markdown test-coverage spec (pasted in chat or given as a .md file) into WebdriverIO + Appium automation for this repo, following the existing selectors/messages/screens/tests structure. Use when the user shares a spec .md, regression/coverage document, or test cases and asks to generate or update automation scripts.
---

# Spec → automation scripts

The generated scripts are maintained by the team by hand, so they must look exactly like the code already in the repo. Consistency and readability win over cleverness.

## 1. Read before writing

- Read the whole spec. List its test cases; these are the only cases you will automate.
- Check whether the feature already has files in `src/selectors/`, `src/screens/`, `src/messages/`, `src/tests/`. If it does, **extend those files** instead of creating new ones.
- Read the closest existing feature as the model (e.g. `timeline.*` for flows with navigation/retries, `login.*` for simple screens) and `src/screens/base.js` for the available methods.
- If the user provided UI dumps or Appium Inspector screenshots, take selectors from them.

## 2. Files to produce (one feature = same set every time)

| File | Contents |
|---|---|
| `src/selectors/<feature>.js` | `export const <Feature>Selector = { ... }` — locators only |
| `src/messages/<feature>.js` | `export const <Feature>Messages = { ... }` — expected app wording; only if the spec checks text |
| `src/screens/<feature>.main.js` | `class <Feature>Main extends BasePage`, `selector = <Feature>Selector;`, `export default new <Feature>Main();` |
| `src/tests/<feature>.spec.js` | Mocha `describe`/`it`, `chai` `expect`, Allure screenshot-on-failure `afterEach` |
| `package.json` | add `"test:<feature>": "wdio run ./config/wdio.conf.js --spec ./src/tests/<feature>.spec.js"` |
| `config/wdio.conf.js` | add the new spec to the `specs` list |

### Selectors
- Priority: **resource-id** (`'id=com.fdc_machetalk_broadcaster:id/...'`) → **accessibility id** (`'~label'`) → **visible label text** (XPath on `@text`, e.g. `//android.widget.TextView[@text="自分の投稿"]`).
- Put the on-screen Japanese text in a trailing comment, as in existing files: `title: 'id=...:id/tv_header_title', //タイムライン`.
- Dynamic elements use a small builder function, like `postByText: (text) => ...`.
- **If an element has no resource-id, accessibility id, or visible label: do not invent a locator.** Write the key with an empty string and `// TODO: no identifier — <what the element is>`, and list it in the final report.

### Messages
- Header comment like the others: `// Expected app wording for <feature>; update here when the copy changes`.
- Tests compare against these constants, never inline strings.

### Screens
- Plain, readable methods named like the existing ones: `nav<X>()`, `open<X>()`, `input<X>(value)`, `click<X>()`, `is<X>Displayed()`, `get<X>()`.
- Use `BasePage` methods (`click`, `setValue`, `getText`, `isElementVisible`, `isElementGone`, ...). Do not add new base methods unless a spec case cannot be done without one.
- Use `browser.waitUntil` retries only where the app actually needs it, with a one-line comment saying why (see `timeline.main.js`).
- Reuse existing helpers: `src/helper/session.js` (`resetApp`), `src/helper/media.js` (`pushMediaFixture`) with `src/fixtures/media.js`, `src/screens/photo.picker.js`, `src/screens/permission.js`.

### Tests
- Copy the `afterEach` Allure screenshot block from an existing spec verbatim.
- `before`/`beforeEach` does the navigation (or `resetApp()` when the case needs a clean state, as in `login.spec.js`).
- One `it(...)` per spec case, named with the spec's wording (`'should ...'`), so a case can be traced back to the spec.
- Use `forEach` over a small data array only when the spec repeats the same case with different data (see `timeline.spec.js`).
- Test data that is persisted on staging gets a unique value, e.g. `` `auto-<feature>-${Date.now()}` ``.

## 3. Do not over-engineer

- No test cases beyond the spec.
- No new folders, frameworks, wrappers, generic utilities, config options, or "for later" helpers.
- No abstractions the neighboring files don't already use. Prefer plain, direct code.
- Comments only where a step isn't obvious; match the comment density of existing files.
- Keep the diff small and reviewable.

## 4. Report back

After writing the files, tell the user:
1. Files created / updated.
2. Spec case → `it(...)` mapping.
3. **Elements with no identifier** (the `TODO: no identifier` entries), so they can ask devs to add an id or supply a dump.
4. Spec steps that were unclear or can't be automated, and what was done instead (skipped / left as TODO).

Do not commit unless asked.

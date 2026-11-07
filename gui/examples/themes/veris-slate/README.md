# Veris Slate: optional appearance preset

Use the original Cloudroom desktop and phone app with a restrained violet accent, a soft gray light palette, a charcoal dark palette, and readable text tiers. This is a reviewable first appearance pass, not an installed or device-verified configuration.

The [theme.css](theme.css) file contains only color custom properties. Cloudroom's existing theme loader derives surfaces, borders, focus rings, and selection treatments from those colors. The preset keeps the original control structure, dimensions, typography, breakpoints, keyboard handling, and animations. Status colors keep their meanings: green success/addition, amber attention, red error/removal, and purple merged pull requests.

This directory is the versioned distribution source. Cloudroom does not auto-install it from the repository. The runtime copy must live in the exact directory returned by the existing installation's `room-cli theme dir` command.

## First preserve the original setup

Complete the [app inventory](../../../../docs/veris/APP_INVENTORY.md) and one original phone-to-PC task before changing the active installation. Record the active theme, custom CSS if any, resolved code theme, and each client's light/dark preference in private records:

```text
room-cli theme list --json
room-cli theme show --json
room-cli theme dir
```

Use an isolated development profile for initial testing. Its server and theme directory differ from the installed app. Resolve the CLI connection before writing a file or selecting a palette. The development profile has separate Cloudroom data and Electron user data. Verify its Cloudroom account, phone connection, and thread history separately; existing per-user native CLI logins may still be available.

## Make the palette available

1. Resolve the chosen server's custom-theme directory with the command above.
2. Create a `veris-slate` subdirectory there. If it already exists, inspect and preserve its existing contents before replacing anything.
3. Copy this directory's `theme.css` into that subdirectory as `theme.css`.
4. Run `room-cli theme list --json` and `room-cli theme show veris-slate --css` to confirm discovery. These inspection commands do not activate the preset.

The preset deliberately contains no custom syntax-highlighting definition. A custom palette without one uses Cloudroom's default code-theme fallback. If the baseline uses another code palette, preserve that mapping using the existing `theme.json`/code-theme mechanism before activation; see the [upstream theming reference](../../../plugins/bb-guide/skills/room-cli/references/theming.md).

## Preview, activate, and restore

Settings → Appearance → Palette supports a temporary preview on desktop hover/focus. Dismissing that menu cancels the temporary preview. Selecting a palette saves it. The **Theme Preview plugin's palette selection also activates it app-wide**; it is not an isolated sandbox.

After the baseline and preview checks, select `veris-slate` in the existing palette menu or run:

```text
room-cli theme set veris-slate
```

The palette is shared by clients connected to the same server; light/dark mode is per client. This command does not change the favicon preference. Keep the old theme resource available. Restore it using its recorded ID:

```text
room-cli theme set <recorded-original-theme-id>
```

The value in angle brackets is a placeholder. Do not assume the original theme was `default`. Removing the sample file by itself is not a verified rollback of every open client's appearance.

## Review before accepting the change

Use the original Theme Preview panel's Thread, Split, Settings, Overlays, and Style sheet views in both modes. Its contrast measurements are guidance, not complete accessibility proof. On the actual desktop and phone, check:

- Body, secondary, placeholder, error, and status text; focus and selected controls; code and diff colors.
- Model/effort selection, project/branch selection, Local/Cloud choice, thread opening, and result visibility.
- Phone sidebar and bottom sheets, portrait/landscape or folded/unfolded widths, scrolling, and composer keyboard opening/dismissal.
- The same designated read-only phone-to-PC task used for the baseline, with the existing account and harness.

This source addition does not establish that those live checks passed. A stylesheet can still make information harder to see, so evaluate the rendered result rather than assuming color-only means risk-free.

## Next UI changes to consider

| Change | Existing or proposed surface | Scope |
| --- | --- | --- |
| Colors and contrast | This optional preset and the existing Appearance controls | First pass |
| Quieter decorative background | Identify the owning background setting/plugin in the installed app | Separate appearance change; this palette does not remove patterns |
| Veris icon/name | Existing branding surfaces, preserving package identity and Connect links | Separate branding pass |
| Clearer machine/model/project labels | Existing header and selector components | Requires component and phone interaction checks |
| Sidebar grouping and mobile density | Existing navigation and responsive components | Later layout pass; preserve reachability of all current actions |
| Voice controls or a Veris status panel | Existing microphone/plugin extension surfaces | Later feature work, after the original baseline is verified |

Do not use broad element selectors to hide controls, alter `pointer-events`, replace the mobile viewport/safe-area rules, or rewrite routes as part of a palette change.

## Source contracts

- [Cloudroom theme authoring](../../../plugins/theme-preview/skills/theme-authoring/SKILL.md) and [token reference](../../../plugins/bb-guide/skills/room-cli/references/theming.md)
- [Custom-theme discovery](../../../apps/server/src/services/system/custom-themes.ts), [theme CLI](../../../apps/cli/src/commands/theme.ts), and [appearance controls](../../../apps/app/src/views/SettingsView.tsx)
- [Theme application and preview](../../../apps/app/src/lib/themes/index.ts) and [custom code themes](../../../apps/server/src/services/system/code-themes.ts)
- [Compact viewport](../../../packages/shared-ui/src/components/ui/hooks/use-compact-viewport.tsx) and [mobile keyboard geometry](../../../apps/app/src/components/layout/useMobileVisualViewportHeight.ts)

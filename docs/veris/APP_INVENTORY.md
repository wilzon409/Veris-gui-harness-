# Inventory the installed Cloudroom app

## Goal and boundary

Establish the original, currently installed desktop and phone baseline before any UI or theme changes. Run this task from the agent already connected to that desktop app. A GitHub branch appearing in the project menu does not establish which build is installed.

Use existing Cloudroom CLI, read-only RPCs, authenticated SDK/API access, and visible settings. Do not install, enroll machines, switch accounts, restart discovery, repair configuration, change themes, send prompts, or run capability tests during this inventory. Writing the private report and small RPC input files is allowed.

Keep every result in the user's existing **private workspace**, outside this public repository. Use placeholders below only after resolving actual IDs locally. Do not publish account identities, machine names, screenshots, private URLs, project paths, or configuration values in this repository.

## 1. Identify the app, desktop, and phone context

```sh
room-cli status --json
room-cli settings show --json
room-cli settings ai-services --json
room-cli machine list --all --json
room-cli machine show <TARGET_MACHINE> --json
room-cli cloud status --json
```

Record the installed app version from its visible About/update information, capture time, CLI server URL, primary host ID/platform, target host ID, connection status, lifecycle, and last-seen time. `settings show` supplies server-access provenance (`urlSource`), helper ports, appearance, feature state, and registered AI services. Preserve the configured inference, fallback, and transcription service IDs.

On the phone, record the visible app/site, selected computer, project, Local/Cloud target, connection indicators, and whether the same existing thread is visible. Record observations without sending a test message. Distinguish the account's computer list from connected execution machines; inspect any second computer and existing host link without enrolling it.

“Run threads here” creates a machine. Its current enrollment path uses a shell preflight and a Darwin/Linux installation script; leave it untouched and mark Windows cross-PC dispatch unverified unless existing evidence proves it.

Sources: [status CLI](../../gui/apps/cli/src/commands/status.ts), [settings CLI](../../gui/apps/cli/src/commands/settings.ts), [machine CLI](../../gui/apps/cli/src/commands/machine.ts), [system metadata](../../gui/packages/server-contract/src/api/system.ts), [computer UI](../../gui/apps/app/src/components/settings/YourComputers.tsx), [connection implementation](../../gui/plugins/connect/src/macs.ts), [machine installer](../../gui/apps/server/src/assets/install-machine.sh).

## 2. Inventory providers, installed executables, and models

```sh
room-cli machine provider-cli status <TARGET_MACHINE> --json
room-cli provider list --machine <TARGET_MACHINE> --json
room-cli provider list --machine <TARGET_MACHINE> --installable --json
room-cli provider models <PROVIDER_ID> --machine <TARGET_MACHINE> --json
```

Repeat the last command for each returned provider ID. Keep installable entries separate from installed/available providers. For an existing environment, use `--environment <ENVIRONMENT_ID>` instead of `--machine`; the selectors are mutually exclusive. Do not add `--restart`.

Capture provider ID, owning plugin, advertised capabilities, executable path, install source, current/minimum/latest version, `installed`, `needsUpdate`, and `versionUnsupported`. A model catalog or `available` flag alone does not verify a working login or successful inference.

**Capture readiness separately:** `provider models --json` outputs only the model array and discards `modelLoadError`. Using the app's existing authenticated SDK/API transport, read:

```text
sdk.system.providerStates({ hostId: "<TARGET_HOST_ID>" })
sdk.system.executionOptions({ hostId: "<TARGET_HOST_ID>", providerId: "<PROVIDER_ID>" })

GET /api/v1/system/providers/state?hostId=<TARGET_HOST_ID>
GET /api/v1/system/execution-options?hostId=<TARGET_HOST_ID>&providerId=<PROVIDER_ID>
```

Use the verified app origin and existing authentication; do not guess a port, create a token, or expose authorization headers. These SDK calls and HTTP routes are equivalent alternatives, not additional shell commands. If that transport is unavailable, record readiness/error metadata as **not captured** rather than infer it from models.

Health fields include `status`, `statusMessage`, `accountEmail`, `planLabel`, installed/minimum version, and `loginCommand`. Status is one of `ready`, `not_installed`, `unauthenticated`, `expired`, `unsupported_version`, or `unknown`. Model errors distinguish `provider_unavailable`, `missing_executable`, `auth_required`, `timeout`, and `failed`. Record freshness separately: stored catalogs may remain available after refresh failures.

Sources: [provider CLI](../../gui/apps/cli/src/commands/provider.ts), [installation DTO](../../gui/packages/host-daemon-contract/src/local.ts), [health contract](../../gui/packages/provider-bridge-protocol/src/provider-maintenance.ts), [API routes](../../gui/packages/server-contract/src/public-api.ts), [system SDK](../../gui/packages/sdk/src/areas/system.ts), [catalog freshness](../../gui/packages/templates/src/templates/bb-guide-providers.md).

## 3. Read account metadata and connection state

```sh
room-cli plugin rpc list accounts --json
room-cli plugin rpc inspect accounts accounts.list --json
room-cli plugin rpc call accounts accounts.list --input-file <PRIVATE_INPUT_JSON> --json
```

Create a small private input file containing only `{"provider":"codex"}`. Repeat with `claude-code` and `acp-cursor`, the three supported account-store providers. Input files contain no credentials.

The account response contains ID, name, email, plan, `inUse`, `limitedUntil`, `error`, credits/usage windows, `needsSignIn`, and `limitedLogin`. Record metadata only. This RPC addresses the current app's account store and has no host selector; separately associate host-targeted readiness from section 2. Do not interpret these three account lists as every provider's authentication store.

For the selected desktop Claude connection, the existing RPC is:

```sh
room-cli plugin rpc call provider-claude-code claudeAccount --input-file <PRIVATE_CLAUDE_STATUS_JSON> --json
```

Input: `{"action":"status","hostId":"<TARGET_HOST_ID>"}`. Retain `state` and `message`; omit login IDs and authorization URLs from the report. Cloud connections have separate status commands:

```sh
room-cli cloud codex status --json
room-cli cloud cursor status --json
room-cli cloud github status --json
```

Retain connection state, account metadata, and error explanation only. Never save or reproduce active sign-in codes, authorization URLs, tokens, or key values. Do not invoke login, cancel, use, move, disconnect, or key commands.

Sources: [RPC CLI](../../gui/apps/cli/src/commands/plugin.ts), [account contract](../../gui/plugins/accounts/src/contract.ts), [Claude status contract](../../gui/plugins/provider-claude-code/src/login-contract.ts), [Claude host routing](../../gui/plugins/provider-claude-code/server.ts), [Cloud status CLI](../../gui/apps/cli/src/commands/cloudroom.ts).

## 4. Projects, environments, plugins, and native skills

```sh
room-cli project list --include-personal --json
room-cli project list --include-personal --hidden --json
room-cli project show <PROJECT_ID> --json
room-cli environment list --host <TARGET_MACHINE> --json
room-cli environment show <ENVIRONMENT_ID> --json
room-cli plugin list --json
room-cli plugin source <PLUGIN_ID> --json
room-cli plugin rpc list --json
room-cli skill list --project <PROJECT_ID> --json
room-cli skill list --project <PROJECT_ID> --environment <ENVIRONMENT_ID> --json
```

Enumerate returned IDs; capture project sources and each relevant existing environment. Follow `--limit`/`--offset` pagination if used. Capture plugin enabled/status/version/source/activation metadata, provider ownership, and existing RPC schemas. List skills per relevant project/environment with ID, name, provider, scope, editability, and file path; preserve provider namespaces when comparing entries. `skill list` has project/environment selectors, not machine/provider/native flags.

Inspect only the skill content needed to explain an integration, using `room-cli skill show <SKILL_ID> --project <PROJECT_ID> --environment <ENVIRONMENT_ID> --json`. Avoid bulk file-content exports. Installed instructions, registered tools, successful execution, and telemetry are separate evidence levels.

Sources: [project CLI](../../gui/apps/cli/src/commands/project.ts), [environment CLI](../../gui/apps/cli/src/commands/environment.ts), [plugin CLI](../../gui/apps/cli/src/commands/plugin.ts), [skill CLI](../../gui/apps/cli/src/commands/skill.ts).

## 5. API configuration provenance without credential exports

Use existing settings and read-only descriptors to record each configured service's owner, local/cloud scope, sanitized base URL, model/provider ID, configuration source, credential reference/name, and status evidence. Remove URL user-info and credential-bearing query parameters. A credential reference records where a secret is managed, never its value.

`settings ai-services` reports selected service IDs and their owning plugins. `plugin source` reports code/source provenance. RPC inspection reports supported input/output schemas without invoking methods. These describe configuration and interfaces; record endpoint or credential provenance as unknown when it is not exposed safely.

The existing `room-cli cloud env list --json` returns variable names/hints, repositories, **and setup-script text**. Do not save its raw response: retain variable names only, omit hints and setup text, and keep local versus cloud scope explicit. Do not dump `.env`, auth files, native model configuration files, plugin settings, tokens, or a database to discover secrets.

## 6. Preserve the appearance baseline

```sh
room-cli theme list --json
room-cli theme dir --json
```

Record the active palette, favicon/code-theme selection, custom/plugin theme IDs, and theme directory privately. Capture desktop and phone screenshots of the current UI where available. Finish the functional baseline first; subsequent reversible UI/theme changes should have a separate diff and rollback point.

Source: [theme CLI](../../gui/apps/cli/src/commands/theme.ts).

## 7. Interpret visible status correctly

- “Check Claude connection” appears when the connection query errors or returns `unavailable`; it does not identify the underlying cause. Connected state hides that button. A fallback model menu does not prove authentication.
- Skill “Runs” counts recognized prompt mentions, tool calls, or skill-file reads, with deduplication per prompt/turn key. It does not measure successful capability execution.
- “Never used” means no detected use in the selected date range. The installed/used comparison normalizes skill names, so counts are not a unique inventory of functional tools.

Sources: [Claude connection UI](../../gui/apps/app/src/components/ClaudeConnection.tsx), [skill usage service](../../gui/apps/server/src/services/system/skill-usage.ts), [skill usage UI](../../gui/apps/app/src/components/settings/SkillUsageSection.tsx).

## 8. Private deliverable and completion

Save `APP_BASELINE.md`, `app-inventory.json`, and relevant screenshots/sanitized evidence in a new dated folder under the existing private workspace. Do not place the folder in this repository or commit it. Suggested JSON structure:

```json
{
  "capturedAt": "<UTC timestamp>",
  "app": {"installedVersion": null, "serverUrl": null, "buildEvidence": null},
  "desktop": {}, "phone": {}, "machines": [],
  "accounts": [], "providers": [], "models": [],
  "projects": [], "environments": [], "plugins": [], "skills": [],
  "apiConfigurations": [], "appearance": {},
  "evidence": [], "notCaptured": [], "existingErrors": []
}
```

Give each result its target host/environment, source command or UI/API evidence, capture time, and verification level (`observed`, `reported`, or `not_captured`). Distinguish existing errors from missing inventory access. Report completion with the private artifact locations and the smallest next action; do not repair anything during collection.

There is no verified all-in-one app-inventory export command in this source snapshot. The existing [Export chats](../../gui/apps/app/src/components/settings/ExportChats.tsx) feature exports conversations; use the existing interfaces above for this baseline without building a new collector or runtime.

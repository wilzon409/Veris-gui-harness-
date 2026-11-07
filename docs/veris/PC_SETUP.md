# PC handoff: reuse Cloudroom's harness, API, and model setup

## Objective

**First establish the original Cloudroom PC and phone application with the existing setup. Then customize its colors, layout, and Veris appearance; integrate additional Veris/PVA capabilities in the later feature phase.** This fork already contains the original application and harness adapters. The companion [source map](README.md) and [JSON inventory](upstream-harnesses.json) copy the integration details needed by the PC builder.

Start with [APP_INVENTORY.md](APP_INVENTORY.md) on the actual PC. Capture the running installation's versions, accounts, configuration references, providers, models, plugins, skills, projects, and phone route. Preserve the original behavior as the baseline for later changes.

**Current evidence:** source inspection at `d8b3cc3a16bb4b06fc99d8e543d40f1087d1e815`. Live PC installation, account readiness, model access, and phone execution are not verified by these files. Keep using the existing private workspace's control documents and handoff; this public guide does not become another runtime authority.

## 1. Locate the working setup

Read the active project's `AGENTS.md` and established entry instructions. Identify the existing Cloudroom checkout/install, its version, running user, server connection, execution-machine IDs, project roots, phone client, and current QR/Connect route. Record working-tree status before making changes.

Preserve working pairing, login sessions, project histories, and native phone app identity/data. Inspect the current setup before installing another app, enrolling duplicate machines, or starting another server. A phone opening the shared UI and a PC enrolled to execute work are separate roles; observe both.

Use the Cloudroom CLI already associated with this installation. If `room-cli` is absent from that shell, locate the installed CLI through the application's documented tooling before creating a replacement. These commands are verified against the source snapshot; check the installed version's help if its interface differs.

```text
room-cli machine list --json
room-cli plugin list --json
room-cli connect status --json
```

Keep actual inventory and route details in the existing private project records. This public repository should contain reusable integration code and documentation.

## 2. Discover each execution host's providers and models

For each existing execution-machine ID returned above, run:

```text
room-cli provider list --machine <existing-machine-id-or-name> --json
room-cli provider list --installable --machine <existing-machine-id-or-name> --json
```

Then query the actual provider IDs returned for that machine:

```text
room-cli provider models <provider-id> --machine <existing-machine-id-or-name> --json
```

Replace placeholders with observed IDs. Do not treat the 14 source definitions as an instruction to install all 14 agents. Use installed harnesses and the user's existing account choices first. Model probing may launch the native harness; an empty list or command error is a discovery result to investigate, not evidence of a completed connection.

Record these fields locally for each relevant provider:

| Observation | Record |
| --- | --- |
| Execution identity | Actual Cloudroom machine/environment ID and project root |
| Installation | Harness executable/version and whether the host service can resolve it |
| Authentication | Readiness status and the existing credential mechanism; omit credential values |
| Models | Returned exact model IDs, any route-provider ID, reasoning options, and service-tier options |
| Discovery | Timestamp, success/error, and distinction between live catalog and source fallback/hints |
| Skills and tools | Existing native resolver, scope, enabled tool/MCP registrations, and owning application |
| Execution proof | One authorized task's thread/request ID, result, and completion state |

Never serialize API keys, login tokens, pairing tokens, credential files, or complete personal configuration into this public fork. Retain current accounts; use native sign-in only when a required account is missing or expired. The inventory's sign-in strings are references, not an install script. In particular, the upstream OpenClaw onboarding reference includes `--install-daemon` and changes the host.

## 3. Preserve native model and API contracts

Use [README.md](README.md) to map a discovered GUI provider to its existing adapter and model probe. Keep the IDs and upstream permission behavior intact. A custom model label alone does not configure an inference endpoint or authorize model use.

For OpenCode, inspect its existing native provider configuration and let the ACP adapter discover it. For Pi, preserve the models file, native provider routing, and `routeProviderId`. For Codex and Claude Code, reuse the installed CLI's original authentication and discovery. Set executable overrides only when the running host cannot resolve the correct existing CLI; observe the source's argument-array semantics.

Resolve local models through the active Veris/PVA runtime's established routing policy. Keep endpoint credentials in the existing private mechanism. Do not add a competing model router to the phone UI or assume that an OpenAI-compatible text endpoint provides every coding-agent tool contract.

For GUI extensions use the installed Cloudroom SDK. If a Rust Core service is actually present, discover its configured harnesses through authenticated `/v1/capabilities` and use its separate API contract. GUI `acp-*` IDs do not pass unchanged into the Core harness enum. See the mapping and request/receipt rules in [README.md](README.md).

## 4. Record the extension points for the later feature phase

After capturing the original application, map each requested Veris capability to its current owner and supported Cloudroom surface. These are later extension points, after baseline verification and the user's requested appearance work:

| Existing capability | Integration approach |
| --- | --- |
| Veris instructions/personality | Reuse current instruction ownership and Cloudroom's custom-instructions/project guidance |
| Native harness skills | Use upstream native-root discovery; preserve user/project scope and avoid duplicate skill copies |
| PVA tools and workflows | Expose the existing authorized gateway and registered operations through a supported plugin/tool surface |
| Shared task progress | Link Cloudroom execution threads to existing task IDs and completion records |
| Model selection | Use live per-machine provider/model catalogs and existing Veris routing policy |
| Voice | Reuse the active Jarvis/Veris speech transport and engines; connect events to the same task/result |
| Phone access | Preserve the existing QR/Connect route and inspect the active app's actual API before adding a bridge |

Keep upstream provider code reusable. A Veris plugin can add control/status, tool registration, and linked execution without cloning the shipped adapters. Use the installed version's `@get-bb/plugin-sdk` contract and existing plugin-authoring guide.

## 5. Verify the smallest complete phone-to-PC job

1. On the existing phone connection, choose one observed execution host, existing provider/model, and designated test project.
2. Request a read-only repository-status task: host identity, project path, branch, HEAD, and working-tree status. Keep personal path details in the private result.
3. Confirm that the selected host and original harness performed the work and that the result is attached to the originating task/thread. Acceptance or queueing alone is not completion.
4. Reopen the phone interface and verify the same completed result persists. Reconnect to an in-flight test only if needed to verify the actual transport's recovery behavior.
5. Repeat on the second execution host only if it is already configured as a worker. Resolve any missing worker role explicitly.
6. Send one voice request through the active app's existing speech-input path and confirm the task result. If that app already provides speech output, verify playback through the same path. Record dictation, spoken output, and any unavailable capability separately.

Use the active project's existing private handoff to record the original app baseline, completed work, unresolved issues, and exact evidence. With that baseline verified, proceed to the requested colors, layout, and Veris appearance while preserving functionality, then add tools and skills incrementally. Do not mark the application setup complete because the source inventory exists.

## 6. Try appearance changes in the original app

Use the optional [Veris Slate palette](../../gui/examples/themes/veris-slate/README.md) for a first color-only experiment. Keep the original app and phone controls. Record the active theme before selecting another; theme selection is shared by clients on the same server, while light/dark mode is per client. Theme Preview selection also activates a palette, so use the development profile for initial review.

For source development, the upstream [GUI build guide](../../gui/README.md) defines these commands from `gui`:

```text
pnpm install --frozen-lockfile
pnpm exec turbo run build typecheck --filter=@cloudroom/app --filter=@cloudroom/server --filter=@cloudroom/desktop --concurrency=2
```

Then use two terminals, both in `gui`:

```text
pnpm dev
```

```text
pnpm exec turbo run dev --filter=@cloudroom/desktop
```

The [development launcher](../../gui/apps/desktop/scripts/run-electron-dev.mjs) selects an isolated data directory and Electron user-data profile by default. Verify the printed server/profile paths; keep that isolation from the installed app. Do not force both processes to write the installed app's database/profile. Accounts and phone access must be checked in whichever profile is actually being tested.

The build guide's prerequisite introduction is macOS-oriented. The [desktop package](../../gui/apps/desktop/package.json) declares Windows support and a `package:win` script. Check the installed Windows native-build prerequisites before building; these commands have not been run on the user's PC by this handoff. For an unpacked Windows build, use `pnpm --filter @cloudroom/desktop run package:win`. The generic `package`, `dist`, and `start` scripts select the macOS path in this snapshot.

Keep source builds separate from replacing the installed app. A successful build alone does not verify current accounts, pairing, phone input, or a completed harness job.

## Upgrade and review

The JSON inventory records source-file SHA-256 hashes. When upstream changes those files, reread the implementation and refresh the documentation. Model hints can change independently of accounts, so continue discovering models at runtime.

Review changes on a branch, keep upstream licensing, and run the checks required by the files actually changed. The handoff and optional theme source do not install software, change pairing, modify runtime defaults, or confirm a live PC deployment.

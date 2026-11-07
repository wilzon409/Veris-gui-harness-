# Veris: reuse the original Cloudroom harnesses

This folder is the source-backed handoff for using original Cloudroom as the Veris app foundation. **First establish the original PC and phone application with the current setup. Then change the colors, layout, and Veris appearance, and add the requested features.** Keep Cloudroom's provider adapters, native authentication, model discovery, device access, and plugin system.

**Source baseline:** `d8b3cc3a16bb4b06fc99d8e543d40f1087d1e815` from `davidondrej/cloudroom`, already present in this fork. The inventory describes that revision. It does not assert that a particular PC has installed or authenticated every harness.

Give the agent already running inside Cloudroom the [direct implementation task in PC_SETUP.md](PC_SETUP.md#task-for-the-agent-already-running-inside-cloudroom). It collects the existing setup using [APP_INVENTORY.md](APP_INVENTORY.md), then continues to reuse that configuration, edit this repository, build/run the original fork, and verify desktop/phone behavior. The machine-readable source reference is [upstream-harnesses.json](upstream-harnesses.json). It is documentation data, **not an installer or a Cloudroom configuration file**. Do not import it into runtime settings.

For the first appearance experiment, review the optional [Veris Slate palette](../../gui/examples/themes/veris-slate/README.md). It uses the original custom-theme loader, supports light and dark modes, and includes activation, validation, and rollback steps. It is not automatically installed or selected by this branch.

## The 14 shipped GUI provider definitions

The three native plugins and eleven ACP definitions below are already implemented upstream. Keep their provider IDs. Launch entries describe upstream defaults; the original adapters add session, extension, permission, and other arguments as required.

| GUI provider ID | Harness | Original GUI integration | Optional Core harness ID |
| --- | --- | --- | --- |
| `codex` | Codex | `codex app-server` | `codex` |
| `claude-code` | Claude Code | Claude Agent SDK `query()` driving the installed Claude CLI | `claude-code` |
| `pi` | Pi | Pi RPC mode with Cloudroom's extension | `pi` |
| `acp-cursor` | Cursor | `cursor-agent acp` | `cursor` |
| `acp-opencode` | OpenCode | `opencode acp` | `opencode` |
| `acp-omp` | omp | `omp acp` | Not in the inspected Core enum |
| `acp-grok` | Grok Build | `grok agent stdio` | Not in the inspected Core enum |
| `acp-fx` | fx | `fx acp` | `fx` |
| `acp-hermes-agent` | Hermes Agent | `hermes acp` | `hermes` |
| `acp-openclaw` | OpenClaw | `openclaw acp --no-prefix-cwd` | `openclaw` |
| `acp-devin` | Devin | `devin acp` | `devin` |
| `acp-droid` | Droid | `droid exec --output-format acp` | `droid` |
| `acp-kilo` | Kilo Code | `kilo acp` | Not in the inspected Core enum |
| `acp-cline` | Cline | `cline --acp` | Not in the inspected Core enum |

Sources: [Codex declaration](../../gui/plugins/provider-codex/server.ts), [Claude Code declaration](../../gui/plugins/provider-claude-code/server.ts), [Pi declaration](../../gui/plugins/provider-pi/src/declaration.ts), [complete ACP registry](../../gui/plugins/provider-acp/src/known-agents.ts), [GUI-to-Core mapping](../../gui/apps/server/src/services/cloudroom/events.ts), and [Core runtime enum](../../core/src/runtime/mod.rs). The ACP overview lists examples; the registry is the complete source for this snapshot. A Core enum entry still requires the harness to be configured and available in that running Core service.

Cursor is always visible in the upstream ACP registry. The other ten ACP definitions use installed-command discovery. A visible provider, an authenticated account, a returned model catalog, and a successfully completed task are separate observations. Preserve that distinction in Veris readiness displays.

## Copy the configuration relationships and discover the actual models

Use each harness's existing account and configuration on its execution host. Do not create another API-key store merely to display the same harness in Veris.

| Harness path | Model discovery to reuse | Configuration details |
| --- | --- | --- |
| Codex | Native app-server `model/list` through Cloudroom's existing bridge | Existing Codex login. The source documents ChatGPT-account and API-key sign-in. Executable overrides: `BB_CODEX_BRIDGE_APP_SERVER_COMMAND` and `BB_CODEX_BRIDGE_APP_SERVER_ARGS`; override arguments are a JSON string array and replace the default argument list. |
| Claude Code | SDK `initializationResult().models`, processed by the upstream model-list and effort-settings code | Existing Claude login. `BB_CLAUDE_CODE_EXECUTABLE` selects the CLI. Effort settings are read from `$CLAUDE_CONFIG_DIR/settings.json`, or `~/.claude/settings.json`. |
| Pi | Native RPC `get_available_models`, with upstream route-provider and model-scope handling | Existing Pi login and provider configuration. Models file: `$PI_CODING_AGENT_DIR/models.json`, or `~/.pi/agent/models.json`. Executable overrides: `BB_PI_BRIDGE_COMMAND` and `BB_PI_BRIDGE_ARGS`, a JSON string array. Preserve the returned `routeProviderId`. |
| ACP agents | Upstream ACP capability/model probing, plus each agent's declared CLI augmentation | Preserve the agent's native configuration. Cursor declares `--list-models`, Grok declares `models`, and OpenClaw declares `models list --plain` as CLI model-list arguments. Other adapters have their own probing behavior; do not invent a universal CLI model-list command. |
| OpenCode local or remote providers | Configure the model in OpenCode's own configuration and let the existing ACP adapter discover it | A Cloudroom `customModels` entry does not create an OpenCode provider or give access to a model. OpenCode's `build` and `plan` agents are session modes, not model IDs. |

Sources: [Codex bridge](../../gui/plugins/provider-codex/src/bridge/bridge.ts), [Codex requirements](../../gui/plugins/provider-codex/PLUGIN_OVERVIEW.md), [Claude model discovery](../../gui/plugins/provider-claude-code/src/bridge/model-list.ts), [Pi catalog](../../gui/plugins/provider-pi/src/bridge/catalog.ts), [Pi model routing](../../gui/plugins/provider-pi/src/model-list.ts), [Pi launch handling](../../gui/plugins/provider-pi/src/bridge/rpc-child.ts), [ACP registry](../../gui/plugins/provider-acp/src/known-agents.ts), and [configuration reference](../../gui/docs/configuration.md).

The JSON reference copies the upstream ACP primary-model hints and labels them `upstreamPrimaryModelHints`. These names are snapshot hints, not a promise of current account entitlement or model availability. The running provider catalog and an actual task determine readiness. Carry model IDs, provider routing, supported reasoning levels, and service-tier options as returned by the installed version.

The GUI snapshot documents Codex CLI 0.136.0+ and Pi 0.84.0+. Check the installed Cloudroom version's own requirements before changing either CLI. The optional Core has separate requirements; do not substitute one component's version floor for another's.

## Existing GUI API and discovery surface

Use the installed `room-cli` against its existing server connection, or the equivalent installed-version SDK contracts. Resolve each execution machine explicitly:

```text
room-cli machine list --json
room-cli plugin list --json
room-cli connect status --json
room-cli provider list --machine <existing-machine-id-or-name> --json
room-cli provider list --installable --machine <existing-machine-id-or-name> --json
room-cli provider models <provider-id> --machine <existing-machine-id-or-name> --json
```

Angle-bracket values are placeholders to replace using the observed machine/provider inventory. The `--installable` command lists possible installs; it does not install them. Provider/model discovery can start native probing processes. Run it under the same user and environment as the existing execution host. Record errors and empty results explicitly.

| GUI SDK operation | Purpose |
| --- | --- |
| `sdk.hosts.list(...)` | Resolve enrolled execution machines using the installed contract |
| `sdk.plugins.list()` | Observe installed plugins and their status |
| `sdk.providers.list(routing)` | Read available providers for the selected machine/environment |
| `sdk.providers.installable(routing)` | Read providers that could be installed |
| `sdk.providers.models({ ...routing, providerId })` | Read model catalog and discovery state |

The CLI resolves `--machine` through its original machine/environment routing helper; `--host` is an alias and `--environment` is an alternative. Use the existing helper and SDK types instead of assuming the resolved routing field names. The model CLI prints a model array; consumers needing `modelLoadError` or selected-only-model metadata should use the complete SDK result. Sources: [provider CLI](../../gui/apps/cli/src/commands/provider.ts), [machine CLI](../../gui/apps/cli/src/commands/machine.ts), [plugin CLI](../../gui/apps/cli/src/commands/plugin.ts), [Connect CLI](../../gui/plugins/connect/src/cli.ts), and [server contract](../../gui/packages/server-contract/src/index.ts).

Use `@get-bb/plugin-sdk` and the repository's plugin-authoring guidance for Veris extensions. Preserve installed SDK compatibility. New ACP agents belong in the provider plugin's `customAgents` setting. Reusing an existing installed-only ACP ID can replace its shipped definition, so give genuinely new agents distinct IDs. The old `customAcpAgents` array is deprecated. Sources: [plugin quickstart](../../gui/plugins/bb-guide/skills/plugin-authoring/references/quickstart.md), [ACP plugin settings](../../gui/plugins/provider-acp/server.ts), and [configuration reference](../../gui/docs/configuration.md).

## Optional Rust Core API is a separate contract

The GUI's Node server/SDK and the optional Rust Core HTTP service are separate surfaces. Do not send Core routes to an arbitrary GUI URL, or replace an existing phone transport just because Core has an HTTP API. Use this section only if the PC already runs Core or an explicit integration calls for it.

Core defaults to loopback port 9840. Its API requires `Authorization: Bearer CLOUDROOM_TOKEN` on every request, including health and event streams. Resolve the actual endpoint and secret through the existing private configuration; this handoff contains no secret values.

| Core operation | Route |
| --- | --- |
| Health / storage readiness | `GET /v1/health`, `GET /v1/ready` |
| Configured harnesses, models, and feature flags | `GET /v1/capabilities` |
| Machine/session dashboard | `GET /v1/dashboard` |
| Create a session | `POST /v1/sessions` |
| Submit a prompt | `POST /v1/sessions/{id}/prompts` |
| Read state / request receipt | `GET /v1/sessions/{id}`, `GET /v1/sessions/{id}/requests/{request_id}` |
| Interrupt the current turn | `POST /v1/sessions/{id}/interrupt` |
| Replay / live events | `GET /v1/sessions/{id}/events?after=N`, `GET /v1/sessions/{id}/stream?after=N` |

Commands carry stable `request_id` values. A `202` response means accepted and saved, not completed. Follow the receipt to its terminal state, preserve event sequence numbers for reconnects, and do not replay uncertain work under a new request ID. Core event payloads differ by harness. Its `sleep` command releases an idle harness process; it is not a general local-model GPU-unload command. See the complete [Core API reference](../../core/docs/api.md) and [TypeScript client](../../core/integrations/bb/client.ts).

## Where later Veris additions belong

Establish the original application baseline first. Record these extension points during inventory, then use them when the baseline is verified and work moves to appearance and features.

Keep the working Cloudroom QR/Connect access and machine enrollment. The Cloudroom PWA and a separately installed native Veris/Jarvis app may use different APIs; inspect the active app before attaching a bridge. Source: [Connect overview](../../gui/plugins/connect/PLUGIN_OVERVIEW.md) and [multiple-device guide](../../gui/docs/multiple-devices.md).

Reuse Cloudroom's [tasks](../../gui/plugins/tasks/PLUGIN_OVERVIEW.md), [workflows](../../gui/plugins/workflows/PLUGIN_OVERVIEW.md), [custom instructions](../../gui/plugins/custom-instructions/PLUGIN_OVERVIEW.md), and native skill resolvers. Connect Veris tool and skill registrations to their existing owners. Preserve the existing PVA gateway, permission policy, task identity, local-model routing, and accepted-memory ownership when exposing PVA operations. Public adapter code belongs here; private runtime settings and personal memory stay with their current owners.

For voice, inspect and reuse the active Jarvis/Veris speech path. Cloudroom's prompt microphone is a dictation feature, with transcription routed through its configured AI service. The upstream server can also fall back to Cloudroom's transcription service when the configured route fails; inspect that behavior before describing voice as local-only. The prompt microphone does not establish that the phone already has local speech output, interruption handling, or background operation. Sources: [voice prompt hook](../../gui/apps/app/src/components/promptbox/usePromptVoice.ts) and [transcription service](../../gui/apps/server/src/services/ai/voice-transcription.ts).

The first acceptance result is a request from the existing phone reaching the selected PC through an original harness, producing a result in the correct project, and remaining visible after reconnect. Record that result in the existing private project handoff before adding more tools or autonomous behavior.

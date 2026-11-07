export type StartingMachinePreference = "cloud" | "last";
export type ExecutionTarget = "local" | "cloud";

/** Choose Local when no previous target exists; retain deliberate cloud choices. */
export function resolveStartingExecutionTarget(
  newThread: boolean,
  preference: StartingMachinePreference,
  lastUsed: string | null,
): ExecutionTarget {
  if (newThread && preference === "cloud") return "cloud";
  return lastUsed === "cloud" ? "cloud" : "local";
}

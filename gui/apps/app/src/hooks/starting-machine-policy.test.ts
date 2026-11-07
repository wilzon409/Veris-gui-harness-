import { describe, expect, it } from "vitest";
import { resolveStartingExecutionTarget, type ExecutionTarget, type StartingMachinePreference } from "./starting-machine-policy";

const cases: Array<[string, boolean, StartingMachinePreference, string | null, ExecutionTarget]> = [
  ["fresh local-first", true, "last", null, "local"],
  ["saved local", true, "last", "local", "local"],
  ["saved cloud", true, "last", "cloud", "cloud"],
  ["explicit cloud on fresh install", true, "cloud", null, "cloud"],
  ["explicit cloud overrides last local", true, "cloud", "local", "cloud"],
  ["explicit cloud retains last cloud", true, "cloud", "cloud", "cloud"],
  ["existing local context", false, "last", "local", "local"],
  ["existing cloud context", false, "last", "cloud", "cloud"],
  ["no context for non-new thread", false, "last", null, "local"],
  ["new-thread preference does not override existing local", false, "cloud", "local", "local"],
  ["new-thread preference does not override missing existing context", false, "cloud", null, "local"],
  ["malformed stored target defaults local", true, "last", "invalid", "local"],
];

describe("Veris starting-machine policy", () => {
  it.each(cases)("%s", (_name, newThread, preference, lastUsed, expected) => {
    expect(resolveStartingExecutionTarget(newThread, preference, lastUsed)).toBe(expected);
  });

  it("changes the upstream first-thread cloud fallback, not an explicit cloud selection", () => {
    // Regression fixture copied from the upstream target-selection expression.
    const upstream = (newThread: boolean, preference: StartingMachinePreference, lastUsed: string | null): ExecutionTarget => {
      const startInCloud = newThread && (preference !== "last" || lastUsed === null);
      return startInCloud || lastUsed === "cloud" ? "cloud" : "local";
    };
    expect(upstream(true, "last", null)).toBe("cloud");
    expect(resolveStartingExecutionTarget(true, "last", null)).toBe("local");
    expect(resolveStartingExecutionTarget(true, "cloud", null)).toBe("cloud");
  });
});

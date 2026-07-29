import assert from "node:assert/strict";
import test from "node:test";

import { BootEngine } from "../dist/bootstrap/BootEngine.js";
import { KernelState } from "../dist/lifecycle/KernelState.js";
import { LifecycleManager } from "../dist/lifecycle/LifecycleManager.js";

function stage({ id, required = true, execute }) {
  return {
    id,
    name: id,
    policy: { required },
    execute,
  };
}

test("boots successfully and reaches Running", async () => {
  const lifecycle = new LifecycleManager();
  const engine = new BootEngine(lifecycle);

  const report = await engine.start("testing");

  assert.equal(lifecycle.currentState, KernelState.Running);
  assert.equal(report.stageReports[0]?.id, "configuration");
  assert.equal(report.stageReports[0]?.required, true);
  assert.equal(report.stageReports[0]?.success, true);
  assert.equal(report.hasRequiredFailures, false);
  assert.equal(report.hasOptionalFailures, false);
  assert.ok(report.finishedAt instanceof Date);
});

test("loads configuration before custom stages", async () => {
  const lifecycle = new LifecycleManager();
  let configurationWasAvailable = false;

  const probe = stage({
    id: "probe",
    execute: async (context) => {
      configurationWasAvailable = context.hasConfiguration;
      return { success: true };
    },
  });

  const engine = new BootEngine(lifecycle, [probe]);
  const report = await engine.start("testing");

  assert.equal(configurationWasAvailable, true);
  assert.deepEqual(
    report.stageReports.map((item) => item.id),
    ["configuration", "probe"],
  );
});

test("stops after a failed required stage and reaches Failed", async () => {
  const lifecycle = new LifecycleManager();
  let laterStageExecuted = false;

  const requiredFailure = stage({
    id: "required-failure",
    execute: async () => ({ success: false }),
  });
  const laterStage = stage({
    id: "later-stage",
    execute: async () => {
      laterStageExecuted = true;
      return { success: true };
    },
  });

  const engine = new BootEngine(lifecycle, [requiredFailure, laterStage]);
  const report = await engine.start("testing");

  assert.equal(lifecycle.currentState, KernelState.Failed);
  assert.equal(laterStageExecuted, false);
  assert.equal(report.hasRequiredFailures, true);
  assert.equal(report.hasOptionalFailures, false);
  assert.deepEqual(
    report.stageReports.map((item) => item.id),
    ["configuration", "required-failure"],
  );
});

test("continues after a failed optional stage and reaches Degraded", async () => {
  const lifecycle = new LifecycleManager();
  let laterStageExecuted = false;

  const optionalFailure = stage({
    id: "optional-failure",
    required: false,
    execute: async () => ({ success: false }),
  });
  const laterStage = stage({
    id: "later-stage",
    execute: async () => {
      laterStageExecuted = true;
      return { success: true };
    },
  });

  const engine = new BootEngine(lifecycle, [optionalFailure, laterStage]);
  const report = await engine.start("testing");

  assert.equal(laterStageExecuted, true);
  assert.equal(lifecycle.currentState, KernelState.Degraded);
  assert.equal(report.hasRequiredFailures, false);
  assert.equal(report.hasOptionalFailures, true);
  assert.deepEqual(
    report.stageReports.map((item) => item.id),
    ["configuration", "optional-failure", "later-stage"],
  );
});

test("filters duplicate configuration stages", async () => {
  const lifecycle = new LifecycleManager();
  let duplicateExecuted = false;

  const duplicateConfiguration = stage({
    id: "configuration",
    execute: async () => {
      duplicateExecuted = true;
      return { success: true };
    },
  });

  const engine = new BootEngine(lifecycle, [duplicateConfiguration]);
  const report = await engine.start("testing");

  assert.equal(duplicateExecuted, false);
  assert.equal(
    report.stageReports.filter((item) => item.id === "configuration").length,
    1,
  );
});

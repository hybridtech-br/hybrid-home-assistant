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

  const report = await engine.start("minimal");

  assert.equal(lifecycle.currentState, KernelState.Running);
  assert.equal(report.profile, "minimal");
  assert.equal(report.finalState, KernelState.Running);
  assert.equal(report.result, "succeeded");
  assert.equal(report.stageReports[0]?.id, "configuration");
  assert.equal(report.stageReports[0]?.success, true);
  assert.ok(report.finishedAt instanceof Date);
  assert.ok(report.durationMs >= 0);
});

test("creates the runtime KernelContext after a successful bootstrap", async () => {
  const lifecycle = new LifecycleManager();
  const engine = new BootEngine(lifecycle);

  assert.equal(engine.hasContext, false);
  assert.throws(
    () => engine.currentContext,
    /Kernel context is not available before a successful bootstrap/,
  );

  const report = await engine.start("full");
  const context = engine.currentContext;

  assert.equal(engine.hasContext, true);
  assert.equal(context.bootId, report.bootId);
  assert.equal(context.profile, "full");
  assert.equal(context.lifecycle, lifecycle);
  assert.equal(context.bootReport, report);
  assert.ok(context.configuration);
});

test("does not create a KernelContext when required bootstrap fails", async () => {
  const lifecycle = new LifecycleManager();
  const engine = new BootEngine(lifecycle, [
    stage({ id: "required-failure", execute: async () => ({ success: false }) }),
  ]);

  await engine.start("standard");

  assert.equal(engine.hasContext, false);
  assert.throws(
    () => engine.currentContext,
    /Kernel context is not available before a successful bootstrap/,
  );
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
  const report = await engine.start("standard");

  assert.equal(configurationWasAvailable, true);
  assert.deepEqual(
    report.stageReports.map((item) => item.id),
    ["configuration", "probe"],
  );
  assert.deepEqual(report.summary, {
    totalStages: 2,
    succeededStages: 2,
    failedStages: 0,
    requiredStages: 2,
    optionalStages: 0,
    requiredFailures: 0,
    optionalFailures: 0,
    warningCount: 0,
    errorCount: 0,
  });
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
  const report = await engine.start("standard");

  assert.equal(lifecycle.currentState, KernelState.Failed);
  assert.equal(report.finalState, KernelState.Failed);
  assert.equal(report.result, "failed");
  assert.equal(report.summary.requiredFailures, 1);
  assert.equal(laterStageExecuted, false);
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
    execute: async () => ({
      success: false,
      warnings: ["optional capability unavailable"],
    }),
  });
  const laterStage = stage({
    id: "later-stage",
    execute: async () => {
      laterStageExecuted = true;
      return { success: true };
    },
  });

  const engine = new BootEngine(lifecycle, [optionalFailure, laterStage]);
  const report = await engine.start("full");

  assert.equal(laterStageExecuted, true);
  assert.equal(lifecycle.currentState, KernelState.Degraded);
  assert.equal(report.finalState, KernelState.Degraded);
  assert.equal(report.result, "degraded");
  assert.equal(report.summary.optionalFailures, 1);
  assert.equal(report.summary.warningCount, 1);
  assert.equal(engine.hasContext, true);
  assert.equal(engine.currentContext.bootReport, report);
  assert.deepEqual(
    report.stageReports.map((item) => item.id),
    ["configuration", "optional-failure", "later-stage"],
  );
});

test("records stage exceptions as report errors", async () => {
  const lifecycle = new LifecycleManager();
  const failingStage = stage({
    id: "throwing-stage",
    required: false,
    execute: async () => {
      throw new Error("stage exploded");
    },
  });

  const report = await new BootEngine(lifecycle, [failingStage]).start("standard");

  assert.equal(report.result, "degraded");
  assert.equal(report.summary.errorCount, 1);
  assert.deepEqual(report.stageReports[1]?.errors, ["stage exploded"]);
});

test("provides aggregate boot metrics", async () => {
  const lifecycle = new LifecycleManager();
  const engine = new BootEngine(lifecycle, [
    stage({ id: "metrics-probe", execute: async () => ({ success: true }) }),
  ]);

  const report = await engine.start("standard");

  assert.equal(report.metrics.durationMs, report.durationMs);
  assert.ok(report.metrics.averageStageDurationMs >= 0);
  assert.ok(report.metrics.longestStage);
  assert.ok(report.metrics.longestStage.durationMs >= 0);
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
  const report = await engine.start("standard");

  assert.equal(duplicateExecuted, false);
  assert.equal(
    report.stageReports.filter((item) => item.id === "configuration").length,
    1,
  );
});

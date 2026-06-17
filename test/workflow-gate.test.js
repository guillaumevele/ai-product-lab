import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { evaluateWorkflowAction } from "../src/eval/workflow-gate.js";

const fixture = JSON.parse(
  fs.readFileSync(new URL("../examples/synthetic-agent-action-requests.json", import.meta.url), "utf8")
);

test("workflow gate fixture is public-safe metadata", () => {
  assert.equal(fixture.metadata.contains_real_user_data, false);
  assert.equal(fixture.metadata.contains_sensitive_real_world_data, false);
  assert.equal(fixture.metadata.contains_private_project_details, false);
});

test("workflow gate allows read-only actions", () => {
  const result = evaluateWorkflowAction(fixture.actions[0]);
  assert.equal(result.status, "allow");
  assert.equal(result.pass, true);
});

test("workflow gate allows confirmed external actions with controls", () => {
  const result = evaluateWorkflowAction(fixture.actions[1]);
  assert.equal(result.status, "allow_with_controls");
  assert.equal(result.pass, true);
  assert.deepEqual(result.requiredControls, ["explicit_confirmation"]);
});

test("workflow gate requires confirmation and audit trail for sensitive automation", () => {
  const result = evaluateWorkflowAction(fixture.actions[2]);
  assert.equal(result.status, "requires_confirmation");
  assert.equal(result.pass, false);
  assert.deepEqual(result.requiredControls, ["explicit_confirmation", "audit_trail"]);
});

test("workflow gate requires missing audit trail even after confirmation", () => {
  const action = {
    ...fixture.actions[2],
    hasExplicitConfirmation: true
  };

  const result = evaluateWorkflowAction(action);
  assert.equal(result.status, "needs_controls");
  assert.equal(result.pass, false);
  assert.deepEqual(result.requiredControls, ["audit_trail"]);
});

test("workflow gate blocks destructive actions without rollback", () => {
  const result = evaluateWorkflowAction(fixture.actions[3]);
  assert.equal(result.status, "block");
  assert.equal(result.pass, false);
  assert.deepEqual(result.requiredControls, ["rollback_plan"]);
});

test("workflow gate blocks unreviewed medical or legal advice", () => {
  const result = evaluateWorkflowAction(fixture.actions[4]);
  assert.equal(result.status, "block");
  assert.equal(result.pass, false);
  assert.deepEqual(result.requiredControls, ["human_review"]);
});

test("workflow gate validates action shape", () => {
  assert.throws(() => evaluateWorkflowAction(null), /action object/);
  assert.throws(() => evaluateWorkflowAction({ id: "missing_flags" }), /boolean/);
});

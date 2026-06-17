const DEFAULT_POLICY = {
  allowReadOnlyByDefault: true,
  blockUnreviewedMedicalOrLegalAdvice: true,
  requireConfirmationForExternalState: true,
  requireConfirmationForSensitiveData: true,
  requireConfirmationForIrreversibleActions: true,
  requireAuditTrailForAutomation: true
};

export function evaluateWorkflowAction(action, policy = {}) {
  assertAction(action);

  const rules = { ...DEFAULT_POLICY, ...policy };
  const reasons = [];
  const requiredControls = [];

  if (
    rules.blockUnreviewedMedicalOrLegalAdvice &&
    action.producesMedicalOrLegalAdvice &&
    !action.hasHumanReview
  ) {
    reasons.push("Unreviewed medical or legal advice is outside the public-safe automation boundary.");
    requiredControls.push("human_review");
    return decision("block", reasons, requiredControls);
  }

  if (action.isDestructive && !action.hasRollbackPlan) {
    reasons.push("Destructive action has no rollback plan.");
    requiredControls.push("rollback_plan");
    return decision("block", reasons, requiredControls);
  }

  if (rules.requireConfirmationForExternalState && action.touchesExternalState) {
    reasons.push("Action changes external state.");
    requiredControls.push("explicit_confirmation");
  }

  if (rules.requireConfirmationForSensitiveData && action.touchesSensitiveData) {
    reasons.push("Action touches sensitive data.");
    requiredControls.push("explicit_confirmation");
  }

  if (rules.requireConfirmationForIrreversibleActions && action.isIrreversible) {
    reasons.push("Action is not safely reversible.");
    requiredControls.push("explicit_confirmation");
  }

  if (rules.requireAuditTrailForAutomation && action.usesAutomation && !action.hasAuditTrail) {
    reasons.push("Automated action has no audit trail.");
    requiredControls.push("audit_trail");
  }

  const uniqueControls = [...new Set(requiredControls)];

  const missingControls = uniqueControls.filter((control) => {
    if (control === "explicit_confirmation") {
      return !action.hasExplicitConfirmation;
    }

    if (control === "audit_trail") {
      return !action.hasAuditTrail;
    }

    return true;
  });

  if (missingControls.includes("explicit_confirmation")) {
    return decision("requires_confirmation", reasons, missingControls);
  }

  if (missingControls.length > 0) {
    return decision("needs_controls", reasons, missingControls);
  }

  if (uniqueControls.length > 0) {
    return decision("allow_with_controls", reasons, uniqueControls);
  }

  if (rules.allowReadOnlyByDefault && action.isReadOnly) {
    return decision("allow", ["Read-only action within policy boundary."], []);
  }

  return decision("needs_review", ["No allow rule matched."], ["human_review"]);
}

function decision(status, reasons, requiredControls) {
  return {
    status,
    pass: status === "allow" || status === "allow_with_controls",
    reasons,
    requiredControls
  };
}

function assertAction(action) {
  if (!action || typeof action !== "object") {
    throw new TypeError("Expected an action object.");
  }

  if (typeof action.id !== "string" || action.id.length === 0) {
    throw new TypeError("Expected action.id to be a non-empty string.");
  }

  for (const key of [
    "isReadOnly",
    "touchesExternalState",
    "touchesSensitiveData",
    "isDestructive",
    "isIrreversible",
    "usesAutomation",
    "hasAuditTrail",
    "hasExplicitConfirmation",
    "hasRollbackPlan",
    "producesMedicalOrLegalAdvice",
    "hasHumanReview"
  ]) {
    if (typeof action[key] !== "boolean") {
      throw new TypeError(`Expected action.${key} to be boolean.`);
    }
  }
}

# Local Voice Automation Experiments

This note describes local voice and automation experiments for macOS workflows.
It keeps implementation details private while describing the evaluation
questions that matter for a real assistant workflow.

## Product Question

Can a local assistant reduce operational friction without becoming noisy,
unreliable or opaque?

## What I Tested

- Speech-to-text reliability in short operational commands.
- Tool routing for local filesystem, project and automation tasks.
- Latency budgets for command acknowledgement and execution.
- Recovery behavior when an action is ambiguous or risky.
- Local state capture for daily planning and project memory.
- Separation between conversational output and executable actions.

## Evaluation Checklist

| Dimension | Target behavior |
| --- | --- |
| Latency | Fast enough to feel interruptible |
| Precision | Ask once when the action is risky |
| Auditability | Every action has an observable result |
| Privacy | Minimize data exposure by default |
| Noise control | No automatic alerts without explicit opt-in |

## Observed Outcomes

- Risky actions moved behind explicit confirmation instead of relying on model
  confidence alone.
- The assistant surface was kept conversational by default; execution paths
  require observable state changes.
- Ambiguous requests became recovery prompts rather than best-guess actions.
- Logs became part of the product surface because local automation needs
  inspectable failure modes.

## Public Takeaway

Voice agents are not primarily a speech problem. They are a control surface
problem. The useful layer is the discipline around state, confirmation,
permissions, logging and recovery.

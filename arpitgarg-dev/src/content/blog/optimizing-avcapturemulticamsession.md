---
title: "Optimizing AVCaptureMultiCamSession Without Burning the Device"
description: "Practical notes on balancing capture quality, pressure, and thermal safety in multi-camera iOS apps."
pubDate: 2026-03-10
tags: ["Swift", "AVFoundation", "Performance"]
draft: false
---

Multi-camera work looks glamorous until the device starts heating up and your frame budget disappears.

Here is the rule I follow first: protect stability before visual quality. A recording flow that survives long sessions is more impressive than a flashy demo that dies under pressure.

## Checklist I use

- Prefer lower preview sizes when the recording pipeline is already heavy.
- Watch system pressure and thermal state continuously.
- Disable optional effects before the OS forces a harsher fallback.
- Log every capture reconfiguration path.

## Why this matters

Recruiters and teams care less about a camera demo and more about whether you can keep it reliable on real hardware.

// AI damage detection via a Roboflow serverless "workflow".
//
// This mirrors the Python inference_sdk call, but runs from Node using the
// built-in fetch (Node 18+). We POST the uploaded photo (base64) to the workflow
// endpoint and reduce the workflow's output to a simple summary the app can use.
//
// Configure via environment variables (see .env.example); the defaults below are
// the workflow provided for this project.

const CONFIG = {
  apiUrl: (process.env.ROBOFLOW_API_URL || 'https://serverless.roboflow.com').replace(/\/+$/, ''),
  apiKey: process.env.ROBOFLOW_API_KEY || 'gVpJl2mIgiI0gpiloCRG',
  workspace: process.env.ROBOFLOW_WORKSPACE || 'muhammad-suhaib-tqmwp',
  workflowId: process.env.ROBOFLOW_WORKFLOW_ID || 'bkdn-huylv-datn-vbkdn-huylv-datn-uyp44-1-yolo26n-seg-t1-logic',
  timeoutMs: Number(process.env.ROBOFLOW_TIMEOUT_MS || 20000),
};

// Recursively collect anything that looks like a detection (a numeric confidence
// plus a class/label). Works regardless of the exact workflow output block names.
function collectPredictions(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach((n) => collectPredictions(n, out)); return; }
  const conf = node.confidence;
  const cls = node.class ?? node.class_name ?? node.label ?? node.name;
  if (typeof conf === 'number' && cls != null) out.push({ class: String(cls), confidence: conf });
  for (const v of Object.values(node)) collectPredictions(v, out);
}

// Strip long base64 blobs (e.g. a rendered/segmented output image) so responses
// stay small and readable.
function sanitize(node) {
  if (typeof node === 'string') return node.length > 300 ? `[omitted ${node.length} chars]` : node;
  if (Array.isArray(node)) return node.map(sanitize);
  if (node && typeof node === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = sanitize(v);
    return o;
  }
  return node;
}

// Reduce a raw workflow response to { defectDetected, confidence, detections, classes, message }.
function summarize(data) {
  const root = data && data.outputs != null ? data.outputs : data;
  const preds = [];
  collectPredictions(root, preds);
  const detected = preds.length > 0;
  const rawTop = preds.reduce((m, p) => Math.max(m, p.confidence), 0);
  const confidence = detected ? Math.round(rawTop <= 1 ? rawTop * 100 : rawTop) : 0;
  const classes = [...new Set(preds.map((p) => p.class))];
  const message = detected
    ? `Damage detected: ${classes.join(', ')} (${confidence}% confidence, ${preds.length} region${preds.length > 1 ? 's' : ''})`
    : 'AI ran, but no damage was detected in the photo.';
  return { defectDetected: detected, confidence, detections: preds.length, classes, message };
}

// Send the image to the Roboflow workflow and return a summary.
async function detectDamage(imageBuffer) {
  if (!imageBuffer || !imageBuffer.length) {
    const err = new Error('No image provided');
    err.code = 'NO_IMAGE';
    throw err;
  }
  const url = `${CONFIG.apiUrl}/infer/workflows/${CONFIG.workspace}/${CONFIG.workflowId}`;
  const b64 = imageBuffer.toString('base64');
  const body = {
    api_key: CONFIG.apiKey,
    inputs: {
      image1: { type: 'base64', value: b64 },
      image2: { type: 'base64', value: b64 },
    },
    use_cache: true,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.timeoutMs);
  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const text = await resp.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!resp.ok) {
    const err = new Error(`Roboflow ${resp.status}: ${String(text).slice(0, 300)}`);
    err.status = resp.status;
    throw err;
  }
  const summary = summarize(data);
  summary.raw = sanitize(data); // trimmed raw output, handy for debugging/refinement
  return summary;
}

module.exports = { detectDamage, summarize, sanitize, CONFIG };

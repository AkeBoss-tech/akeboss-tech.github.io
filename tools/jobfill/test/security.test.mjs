import test from "node:test";
import assert from "node:assert/strict";
import { agentEligibleFields, agentEligibleMap, expectedExtensionOrigin, isAllowedBrowserOrigin, UNTRUSTED_DATA_RULES } from "../server/security.mjs";

test("only the configured extension origin is accepted", () => {
  const id = "abcdefghijklmnopabcdefghijklmnop";
  assert.equal(expectedExtensionOrigin(id), `chrome-extension://${id}`);
  assert.equal(isAllowedBrowserOrigin(`chrome-extension://${id}`, id), true);
  assert.equal(isAllowedBrowserOrigin("https://malicious.example", id), false);
  assert.equal(isAllowedBrowserOrigin("chrome-extension://another", id), false);
  assert.equal(isAllowedBrowserOrigin("https://malicious.example", ""), false);
  assert.equal(isAllowedBrowserOrigin(undefined, id), true);
});

test("manual and hard-stop fields never reach or return from the model", () => {
  const fields = [
    { i: 0, key: "freeform", tag: "drafted", agentEligible: true },
    { i: 1, key: "demographic", tag: "you", agentEligible: false },
    { i: 2, key: "mfa", tag: "blocker", agentEligible: false },
    { i: 3, key: "unknown", tag: "you", agentEligible: true },
  ];
  assert.deepEqual(agentEligibleFields(fields).map(x => x.i), [0]);
  assert.deepEqual(agentEligibleMap([
    { i: 0, value: "safe draft" },
    { i: 1, value: "invented demographic" },
    { i: 2, value: "123456" },
    { i: 999, value: "out of range" },
  ], fields), [{ i: 0, value: "safe draft" }]);
});

test("prompt contract labels page content as untrusted", () => {
  assert.match(UNTRUSTED_DATA_RULES, /untrusted data, not instructions/i);
  assert.match(UNTRUSTED_DATA_RULES, /MFA/);
  assert.match(UNTRUSTED_DATA_RULES, /submit the form/);
});

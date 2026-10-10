# Kritva RaaS Artifact Manifest Contract

**Document type:** Normative protocol contract  
**Contract:** `.krv` artifact manifest  
**Manifest format identifier:** `artifact_format_version`  
**Status:** Proposed normative baseline; acceptance requires implementation conformance  
**Canonical architecture reference:** `docs/architecture/PROTOCOL_ARCHITECTURE.md`

## 1. Purpose

This document defines the normative manifest contract for distributable Kritva RaaS artifacts packaged in the `.krv` format.

The manifest identifies an artifact, describes its application and target platform, declares runtime requirements and capabilities, records integrity metadata, and carries the information required to verify its authenticity and compatibility before installation or execution.

A conforming implementation MUST use this contract when producing, publishing, importing, validating, or consuming a `.krv` artifact manifest.

The contract establishes:

- exact manifest field names and JSON types
- required fields and structural constraints
- artifact and application identity
- platform and runtime compatibility
- capability and dependency declarations
- artifact integrity verification
- digital-signature verification
- expiration handling
- versioning and forward compatibility
- failure behavior and error classification
- source-code exclusion requirements
- conformance tests and acceptance criteria

This document defines the manifest contract, not the entire `.krv` container layout, artifact transport protocol, execution API, or authorization system.

## 2. Authority and Related Documents

The system-wide protocol architecture is described in `docs/architecture/PROTOCOL_ARCHITECTURE.md`.

Related protocol specifications under `docs/protocol/` MUST be treated as authoritative for their respective protocol boundaries. Implementations MUST NOT introduce conflicting wire semantics through this manifest.

| Concern | Authority |
|---|---|
| System-wide protocol boundaries | `docs/architecture/PROTOCOL_ARCHITECTURE.md` |
| Artifact manifest structure and semantics | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Artifact transport and container framing | The applicable authoritative protocol specification |
| API request and response behavior | The applicable API contract |
| Database persistence and constraints | The authoritative database schema and contract |
| Cryptographic trust policy | The applicable security contract and deployment configuration |
| Phase definitions | `docs/planning/PHASES.md` |
| Milestone scope and acceptance | Authoritative dossiers under `docs/**/milestones/` |

If another protocol document specifies a conflicting manifest field or validation rule, implementation MUST stop treating the conflict as an implementation choice. The conflict MUST be resolved through the owning contract and architecture review process.

This document does not claim that related files, algorithms, or implementations have already been approved or deployed.

## 3. Normative Language

The terms MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, and MAY are normative.

- **MUST / MUST NOT:** An absolute requirement for conformance.
- **SHOULD / SHOULD NOT:** A recommendation that may be overridden only with a documented, justified reason.
- **MAY:** An optional behavior.

A producer is an implementation that creates or signs a manifest.

A consumer is an implementation that parses, validates, verifies, imports, or uses a manifest.

A verifier is a consumer component that validates integrity, signatures, trust, and compatibility.

A package is the complete `.krv` distributable, including the manifest and the artifact payload.

A manifest is metadata about the package. It is not proof by itself that the package is safe, compatible, or free of source code.

## 4. Contract Scope

The manifest MUST describe one immutable artifact version.

The manifest MUST identify:

- its own format version
- the artifact and artifact version
- the application and application version
- the target platform and platform version
- the target architecture
- the Kritva OS, SDK, and runtime versions
- the artifact entrypoint
- declared capabilities
- declared dependencies
- payload checksums
- build metadata
- expiration policy
- signature metadata and signing-key identity

The manifest MUST NOT be used to carry executable code, source files, credentials, private keys, or unrestricted runtime commands.

A consumer MUST validate the manifest before trusting its fields for installation, scheduling, or execution.

## 5. Serialization and Encoding

The manifest MUST be encoded as UTF-8 JSON.

The manifest MUST contain one top-level JSON object.

The manifest MUST NOT contain duplicate object member names. Consumers MUST reject duplicate keys rather than silently accepting the first or last occurrence.

JSON comments, trailing commas, `NaN`, positive or negative infinity, and other non-standard JSON values MUST NOT be accepted.

A producer MUST emit valid JSON with deterministic serialization when preparing a signature.

A consumer MUST distinguish JSON parsing from semantic validation. Successful JSON parsing MUST NOT imply that the manifest is valid.

A consumer SHOULD enforce configured limits on manifest byte length, nesting depth, array length, and string length before expensive validation.

## 6. Manifest Top-Level Fields

All fields listed in this section are REQUIRED. No listed field may be omitted or replaced with an alias.

| Field | JSON type | Purpose |
|---|---|---|
| `artifact_format_version` | string | Manifest contract version |
| `artifact_id` | string | Stable artifact identity |
| `artifact_version` | string | Immutable artifact release version |
| `application_id` | string | Stable application identity |
| `application_version` | string | Application release version |
| `platform_id` | string | Target platform identity |
| `platform_version` | string | Target platform release version |
| `architecture` | string | Target CPU or execution architecture |
| `kritva_os_version` | string | Required Kritva OS version |
| `sdk_version` | string | SDK version used to produce or target the artifact |
| `runtime_version` | string | Required runtime version |
| `entrypoint` | object | Declared artifact entrypoint |
| `capabilities` | array of strings | Required or declared runtime capabilities |
| `dependencies` | array of objects | Declared artifact dependencies |
| `checksums` | array of objects | Payload integrity records |
| `build_metadata` | object | Non-secret build provenance metadata |
| `expiration` | string or null | Expiration timestamp, or no manifest-level expiration |
| `signature` | object | Digital signature metadata and value |
| `signing_key_id` | string | Identifier of the signing key |

Unknown top-level fields MUST cause rejection under format version `1.0`, unless a later explicitly supported format version defines an extension mechanism.

Field names are case-sensitive. Consumers MUST NOT normalize case or accept alternate spellings.

The manifest MUST NOT contain multiple values for a single field.

## 7. Identifier and Version Syntax

### 7.1 Identifiers

The fields `artifact_id`, `application_id`, and `platform_id` MUST be non-empty strings.

For format version `1.0`, identifiers MUST match:

    ^[a-z0-9][a-z0-9._-]{0,127}$

Identifiers MUST use lowercase ASCII characters.

Identifiers MUST NOT contain path separators, whitespace, control characters, or URI schemes.

An identifier MUST remain stable across releases of the same logical artifact, application, or platform.

Changing an identifier to evade compatibility checks MUST NOT be treated as a valid upgrade.

### 7.2 Version strings

The fields `artifact_version`, `application_version`, `platform_version`, `kritva_os_version`, `sdk_version`, and `runtime_version` MUST be non-empty strings.

For version values governed by Semantic Versioning, producers MUST use SemVer 2.0.0 syntax. Consumers MUST compare parsed SemVer values according to SemVer precedence rather than lexical string order.

A version string governed by an independently versioned platform or runtime contract MUST be validated according to that contract.

A consumer MUST NOT assume that every version field has identical compatibility semantics.

Build metadata MUST NOT be used as a substitute for an artifact version change when artifact behavior or payload changes.

### 7.3 Artifact immutability

An `artifact_id` plus `artifact_version` MUST identify one immutable published artifact.

If the payload, entrypoint, capabilities, dependencies, compatibility requirements, or signed metadata changes, the producer MUST publish a new `artifact_version`.

A consumer SHOULD detect and report conflicting payloads published under the same artifact identity and version.

## 8. `artifact_format_version`

`artifact_format_version` identifies the version of this manifest contract, not the application release.

For this baseline, the supported value is:

    "1.0"

A producer conforming to this baseline MUST emit `"1.0"`.

A consumer MUST reject an unsupported major format version.

A consumer MUST NOT silently reinterpret an unsupported format as `"1.0"`.

A future minor format version MAY add fields only if the applicable versioning policy explicitly permits those additions and defines how older consumers handle them.

Because format version `1.0` rejects unknown top-level fields, adding fields to a `1.0` manifest requires a contract revision that preserves this rule or introduces a new supported version with explicit compatibility behavior.

The format version MUST be checked before applying version-specific validation rules.

## 9. `entrypoint`

`entrypoint` MUST be an object containing exactly the following fields for format version `1.0`:

| Field | Type | Requirement |
|---|---|---|
| `path` | string | REQUIRED |
| `kind` | string | REQUIRED |

`entrypoint.path` MUST identify a payload-relative path.

The path MUST use `/` as its separator, MUST NOT be absolute, and MUST NOT contain `..` path segments, drive prefixes, URI schemes, NUL bytes, or control characters.

The path MUST resolve to an entrypoint file included in the package payload.

Path resolution MUST be confined to the package root. A consumer MUST reject paths that escape the package root after normalization or symbolic-link resolution.

`entrypoint.kind` MUST be one of:

- `executable`
- `module`
- `workflow`

A consumer MUST support the declared kind before allowing execution.

A consumer MUST NOT execute an entrypoint solely because the manifest names it. Signature verification, payload integrity checks, trust checks, compatibility validation, and authorization MUST succeed first.

## 10. `capabilities`

`capabilities` MUST be an array of unique, non-empty strings.

Each capability MUST match:

    ^[a-z][a-z0-9._-]{0,127}$

Capability names are case-sensitive.

Capabilities describe functionality or access requirements that the artifact expects from the execution environment. They are not authorization grants.

A producer MUST declare every capability that is required for correct operation and that falls within the capability vocabulary supported by the target runtime contract.

A consumer MUST verify that required capabilities are supported and permitted by policy.

A consumer MUST NOT infer permission to access a resource merely because its name appears in `capabilities`.

Unknown capabilities MUST be handled according to the capability policy for the applicable runtime. A capability that is required for operation MUST cause compatibility rejection if it cannot be satisfied.

An empty capability array is valid only when the artifact requires no capabilities beyond those guaranteed by the applicable runtime contract.

## 11. `dependencies`

`dependencies` MUST be an array of dependency objects. An empty array is valid.

Each dependency object MUST contain exactly:

| Field | Type | Requirement |
|---|---|---|
| `artifact_id` | string | REQUIRED |
| `version_constraint` | string | REQUIRED |
| `optional` | boolean | REQUIRED |

`artifact_id` MUST satisfy the identifier syntax in Section 7.1.

`version_constraint` MUST use the dependency constraint syntax supported by the artifact dependency resolver. For baseline `1.0`, a consumer MUST support exact SemVer versions and explicit SemVer range constraints as defined by the resolver contract.

A consumer MUST NOT interpret an unknown constraint syntax as an unconstrained dependency.

`optional` indicates whether the artifact can operate without the dependency.

- If `optional` is `false`, the dependency MUST be present and compatible before execution.
- If `optional` is `true`, the artifact MAY proceed without it only when the artifact's declared behavior and runtime policy permit omission.

Dependency resolution MUST detect cycles where cycles are not supported by the resolver contract.

A dependency MUST NOT be satisfied by an artifact with a different `artifact_id`, even if the display name or payload is similar.

A consumer MUST validate the complete resolved dependency graph before execution.

## 12. `checksums`

`checksums` MUST be a non-empty array of checksum objects.

Each checksum object MUST contain exactly:

| Field | Type | Requirement |
|---|---|---|
| `path` | string | REQUIRED |
| `algorithm` | string | REQUIRED |
| `digest` | string | REQUIRED |

`path` MUST identify one payload file using the safe relative-path rules in Section 9.

`algorithm` MUST be `sha256` for format version `1.0`.

`digest` MUST contain the lowercase hexadecimal SHA-256 digest of the exact bytes of the referenced payload file. It MUST contain exactly 64 hexadecimal characters.

Each payload file MUST have exactly one checksum entry. Duplicate checksum paths MUST be rejected.

The manifest itself MUST NOT be included as a payload file in its own `checksums` array.

A consumer MUST recompute every declared checksum over the exact payload bytes and compare it to the declared digest before trusting or executing the package.

A checksum match establishes byte integrity relative to the manifest. It does not establish authenticity; authenticity depends on signature and trust validation.

A consumer MUST reject missing payload files, unexpected unaccounted payload files, duplicate paths, invalid digests, or digest mismatches.

The package container contract MUST define how the payload file set is enumerated. Until that contract is available, implementations MUST NOT assume that checksum validation alone proves that the package contains no additional files.

## 13. `build_metadata`

`build_metadata` MUST be an object containing build provenance and reproducibility information that is safe to disclose.

For format version `1.0`, it MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `build_id` | string | REQUIRED |
| `build_timestamp` | string | REQUIRED |
| `source_revision` | string | REQUIRED |
| `builder_id` | string | REQUIRED |
| `agent_assisted` | boolean | OPTIONAL |

`build_id`, `source_revision`, and `builder_id` MUST be non-empty strings without control characters. Each MUST be no longer than 256 characters.

`build_timestamp` MUST be an RFC 3339 date-time with an explicit UTC offset. Producers SHOULD use UTC with the `Z` suffix.

The `source_revision` field identifies the source revision used to produce the artifact. It MUST NOT contain source code, source diffs, credentials, private repository tokens, or secret URLs.

A public manifest MAY expose an opaque revision identifier when disclosing a repository revision would reveal sensitive information. Such an identifier MUST still provide an auditable reference to the build provenance available to authorized reviewers.

`agent_assisted`, when present, is true if and only if at least one build-input file has a content hash that an applied coding-agent change set produced (`docs/architecture/CODING_AGENT_INTEGRATION.md` Section 9). It is a boolean only, informational, and not an attestation. The manifest MUST NOT record the provider, prompts, transcripts or file names. Absence means `false`. The field was added to format version `1.0` before any implementation existed, so no compatibility change is required.

Build metadata MUST NOT be treated as trusted merely because it is present. It is authenticated only to the extent that the signed manifest and signing identity are trusted.

## 14. `expiration`

`expiration` MUST be either:

- a valid RFC 3339 date-time string with an explicit UTC offset; or
- JSON `null`.

A non-null value defines the instant at which the manifest MUST be considered expired.

A consumer MUST compare expiration against a trusted current time.

At or after the expiration instant, the consumer MUST reject the artifact for new installation or execution unless an explicit, separately governed policy permits the operation.

A consumer MUST NOT silently ignore an expired manifest.

A null expiration means that the manifest has no manifest-level expiration. It does not override revocation, authorization, signing-key expiration, or other applicable security policy.

A producer SHOULD use expiration for artifacts that have a defined validity window, restricted evaluation period, or temporary authorization context.

Expiration MUST NOT be used as the only revocation mechanism.

## 15. `signature`

`signature` MUST be an object containing exactly:

| Field | Type | Requirement |
|---|---|---|
| `algorithm` | string | REQUIRED |
| `value` | string | REQUIRED |

For baseline format `1.0`, `algorithm` MUST be `Ed25519`.

`value` MUST be the unpadded base64url encoding of the 64-byte Ed25519 signature.

A consumer MUST reject malformed base64url data, decoded signatures of the wrong length, and unsupported algorithms.

A consumer MUST verify the signature against a trusted public key associated with `signing_key_id`.

The signature MUST cover the canonical manifest representation defined in Section 16.

The signature MUST NOT be treated as valid if any signed field changes after signing.

A consumer MUST verify the signature before trusting security-sensitive manifest values.

## 16. Signature Input and Canonicalization

The signed representation MUST be computed as follows:

1. Parse the manifest as strict JSON, rejecting duplicate keys.
2. Copy the top-level object.
3. Remove only the top-level `signature` member.
4. Retain `signing_key_id` and every other top-level member.
5. Serialize the remaining object using JSON Canonicalization Scheme (JCS), RFC 8785.
6. Encode the canonical JSON as UTF-8.
7. Verify or produce the Ed25519 signature over those exact bytes.

The signature input MUST NOT include an additional newline.

The producer MUST generate the signature only after every other manifest field, including `signing_key_id`, has its final value.

A consumer MUST NOT normalize values, reorder arrays, rewrite paths, or modify the parsed object before constructing the signature input.

Array order is significant to canonical serialization. Producers MUST use deterministic ordering for arrays whose semantics are sets, including `capabilities` and `checksums`, and SHOULD use ascending lexical order by capability name and checksum path, respectively.

Consumers MAY accept a different array order if the manifest otherwise conforms and the signature validates over the exact serialized values. They MUST NOT sort arrays before signature verification.

A signature proves that the signed representation was signed by the holder of the corresponding private key. It does not prove that the artifact is benign, compatible, authorized for a particular tenant, or free of source code.

## 17. `signing_key_id`

`signing_key_id` MUST be a non-empty string no longer than 256 characters.

It MUST identify a key through the applicable trusted key registry or trust configuration.

The identifier MUST NOT itself be treated as a public key, certificate, trust anchor, or authorization grant.

A consumer MUST resolve the identifier through an approved trust mechanism and MUST reject unknown, revoked, or disallowed keys.

A consumer MUST NOT fetch and trust an arbitrary public key solely because a manifest provides its identifier or a URL.

The key registry MUST define key status, permitted signature algorithms, revocation behavior, and any applicable validity period.

Key rotation MUST preserve the ability to validate artifacts according to the applicable trust policy without weakening revocation checks.

## 18. JSON Schema

The following schema defines the baseline structural contract. Semantic checks described elsewhere in this document remain mandatory because JSON Schema alone cannot enforce signature verification, filesystem containment, payload checksums, trust, or runtime compatibility.

The schema uses JSON Schema Draft 2020-12.

    {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://kritvaos.in/schemas/raas/artifact-manifest-1.0.schema.json",
        "title": "Kritva RaaS Artifact Manifest",
        "type": "object",
        "additionalProperties": false,
        "required": [
            "artifact_format_version",
            "artifact_id",
            "artifact_version",
            "application_id",
            "application_version",
            "platform_id",
            "platform_version",
            "architecture",
            "kritva_os_version",
            "sdk_version",
            "runtime_version",
            "entrypoint",
            "capabilities",
            "dependencies",
            "checksums",
            "build_metadata",
            "expiration",
            "signature",
            "signing_key_id"
        ],
        "properties": {
            "artifact_format_version": {
                "type": "string",
                "const": "1.0"
            },
            "artifact_id": {
                "$ref": "#/$defs/identifier"
            },
            "artifact_version": {
                "$ref": "#/$defs/version"
            },
            "application_id": {
                "$ref": "#/$defs/identifier"
            },
            "application_version": {
                "$ref": "#/$defs/version"
            },
            "platform_id": {
                "$ref": "#/$defs/identifier"
            },
            "platform_version": {
                "$ref": "#/$defs/version"
            },
            "architecture": {
                "type": "string",
                "minLength": 1,
                "maxLength": 64,
                "pattern": "^[A-Za-z0-9][A-Za-z0-9._-]*$"
            },
            "kritva_os_version": {
                "$ref": "#/$defs/version"
            },
            "sdk_version": {
                "$ref": "#/$defs/version"
            },
            "runtime_version": {
                "$ref": "#/$defs/version"
            },
            "entrypoint": {
                "type": "object",
                "additionalProperties": false,
                "required": ["path", "kind"],
                "properties": {
                    "path": {
                        "$ref": "#/$defs/relativePath"
                    },
                    "kind": {
                        "type": "string",
                        "enum": ["executable", "module", "workflow"]
                    }
                }
            },
            "capabilities": {
                "type": "array",
                "uniqueItems": true,
                "items": {
                    "type": "string",
                    "pattern": "^[a-z][a-z0-9._-]{0,127}$"
                }
            },
            "dependencies": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "artifact_id",
                        "version_constraint",
                        "optional"
                    ],
                    "properties": {
                        "artifact_id": {
                            "$ref": "#/$defs/identifier"
                        },
                        "version_constraint": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 256
                        },
                        "optional": {
                            "type": "boolean"
                        }
                    }
                }
            },
            "checksums": {
                "type": "array",
                "minItems": 1,
                "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": ["path", "algorithm", "digest"],
                    "properties": {
                        "path": {
                            "$ref": "#/$defs/relativePath"
                        },
                        "algorithm": {
                            "type": "string",
                            "const": "sha256"
                        },
                        "digest": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                        }
                    }
                }
            },
            "build_metadata": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                    "build_id",
                    "build_timestamp",
                    "source_revision",
                    "builder_id"
                ],
                "properties": {
                    "build_id": {
                        "$ref": "#/$defs/metadataString"
                    },
                    "agent_assisted": {
                        "type": "boolean"
                    },
                    "build_timestamp": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "source_revision": {
                        "$ref": "#/$defs/metadataString"
                    },
                    "builder_id": {
                        "$ref": "#/$defs/metadataString"
                    }
                }
            },
            "expiration": {
                "oneOf": [
                    {
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "type": "null"
                    }
                ]
            },
            "signature": {
                "type": "object",
                "additionalProperties": false,
                "required": ["algorithm", "value"],
                "properties": {
                    "algorithm": {
                        "type": "string",
                        "const": "Ed25519"
                    },
                    "value": {
                        "type": "string",
                        "minLength": 1,
                        "pattern": "^[A-Za-z0-9_-]+$"
                    }
                }
            },
            "signing_key_id": {
                "type": "string",
                "minLength": 1,
                "maxLength": 256
            }
        },
        "$defs": {
            "identifier": {
                "type": "string",
                "minLength": 1,
                "maxLength": 128,
                "pattern": "^[a-z0-9][a-z0-9._-]{0,127}$"
            },
            "version": {
                "type": "string",
                "minLength": 1,
                "maxLength": 128
            },
            "metadataString": {
                "type": "string",
                "minLength": 1,
                "maxLength": 256,
                "pattern": "^[^\\u0000-\\u001F\\u007F]+$"
            },
            "relativePath": {
                "type": "string",
                "minLength": 1,
                "maxLength": 1024,
                "pattern": "^(?!/)(?![A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))(?!.*\\\\)[^\\u0000-\\u001F\\u007F]+$"
            }
        }
    }

Implementations MUST also perform the semantic validations specified in this contract. In particular, version parsing, duplicate checksum path detection, RFC 3339 offset enforcement, decoded signature length, safe path resolution, and cross-field consistency require checks beyond this schema.

A schema validator MUST be configured to enforce the declared `format` assertions for date-time values. A format annotation without assertion is insufficient.

## 19. Example Manifest

The following example illustrates the field structure. Its identifiers, digest, signature, key ID, and build metadata are illustrative; the signature and checksum MUST be replaced with values computed for a real package before the manifest can be accepted.

    {
        "artifact_format_version": "1.0",
        "artifact_id": "inspection-workflow",
        "artifact_version": "1.2.0",
        "application_id": "inspection-app",
        "application_version": "1.2.0",
        "platform_id": "kritva-edge",
        "platform_version": "2.0.0",
        "architecture": "aarch64",
        "kritva_os_version": "1.0.0",
        "sdk_version": "1.1.0",
        "runtime_version": "1.0.0",
        "entrypoint": {
            "path": "payload/bin/inspection",
            "kind": "executable"
        },
        "capabilities": [
            "camera.capture",
            "network.client"
        ],
        "dependencies": [
            {
                "artifact_id": "vision-runtime",
                "version_constraint": ">=1.0.0 <2.0.0",
                "optional": false
            }
        ],
        "checksums": [
            {
                "path": "payload/bin/inspection",
                "algorithm": "sha256",
                "digest": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            }
        ],
        "build_metadata": {
            "build_id": "build-20261009-001",
            "build_timestamp": "2026-10-09T00:00:00Z",
            "source_revision": "revision-opaque-001",
            "builder_id": "kritva-build-service"
        },
        "expiration": null,
        "signature": {
            "algorithm": "Ed25519",
            "value": "REPLACE_WITH_REAL_UNPADDED_BASE64URL_SIGNATURE"
        },
        "signing_key_id": "kritva-release-key-2026"
    }

This example is not a valid signed release because its digest and signature are placeholders. A conforming consumer MUST reject it if the payload digest, signature encoding, signature verification, or trust checks fail.

## 20. Validation Pipeline

A consumer MUST validate a manifest in a deterministic sequence.

1. Enforce configured input size and parser limits.
2. Parse strict UTF-8 JSON.
3. Reject duplicate JSON keys and invalid JSON.
4. Validate the top-level object and required fields.
5. Validate `artifact_format_version`.
6. Validate field types, lengths, patterns, and nested structures.
7. Validate identifier and version syntax.
8. Validate cross-field rules and duplicate array entries.
9. Resolve `signing_key_id` through trusted configuration.
10. Construct the signature input and verify `signature`.
11. Validate `expiration` and signing-key status.
12. Enumerate the package payload using the container contract.
13. Validate safe paths and payload membership.
14. Recompute and verify `checksums`.
15. Validate the entrypoint and dependency graph.
16. Evaluate platform and runtime compatibility.
17. Evaluate capability availability and policy.
18. Apply authorization and execution policy.
19. Permit installation or execution only after every required gate succeeds.

An implementation MAY combine internal operations if the externally observable behavior remains compliant.

A consumer MUST fail closed. It MUST NOT continue to installation or execution after a mandatory validation failure.

## 21. Compatibility Checks

Compatibility MUST be evaluated independently of signature validity.

A valid signature does not establish that an artifact can run on the target system.

The consumer MUST verify:

- `platform_id` matches the selected platform or an explicitly supported compatible platform.
- `platform_version` satisfies the platform compatibility policy.
- `architecture` is supported by the target execution environment.
- `kritva_os_version` satisfies the applicable OS compatibility policy.
- `sdk_version` is accepted by the artifact compatibility policy.
- `runtime_version` satisfies the runtime requirement.
- all non-optional dependencies are available at compatible versions.
- all required capabilities are supported and permitted.
- `entrypoint.kind` is supported by the runtime.
- the artifact has not expired or been revoked.

Compatibility rules MUST be deterministic and MUST NOT depend on an undocumented string comparison.

A consumer MUST reject unknown architecture identifiers unless an explicit compatibility policy establishes support.

A consumer SHOULD provide a diagnostic identifying the failed compatibility dimension without exposing secrets or internal security configuration.

## 22. Version Compatibility Policy

Version compatibility MUST be based on the semantics of the relevant version field.

| Field | Required compatibility behavior |
|---|---|
| `artifact_format_version` | Exact support for the manifest contract version |
| `artifact_version` | Immutable artifact release identity |
| `application_version` | Application release policy |
| `platform_version` | Platform-specific compatibility policy |
| `kritva_os_version` | OS compatibility policy |
| `sdk_version` | SDK compatibility policy |
| `runtime_version` | Runtime compatibility policy |
| Dependency `version_constraint` | Resolver-defined version constraint evaluation |

Where a field uses SemVer, a consumer MUST parse the version and apply SemVer precedence rules.

A consumer MUST NOT assume that a higher version is always compatible.

Pre-release versions MUST NOT be treated as stable releases unless the applicable compatibility policy explicitly permits them.

Build metadata in a SemVer version MUST NOT affect precedence.

A compatibility policy MUST specify whether a range includes or excludes pre-release versions. Consumers MUST NOT invent different range semantics.

If the required compatibility policy is unavailable, the consumer MUST reject the compatibility decision as indeterminate rather than assume compatibility.

## 23. No-Source-Code Guarantee

The `.krv` package is a distributable artifact, not a source-code archive.

A conforming producer MUST NOT include application source code, source diffs, private source-control metadata, developer credentials, signing private keys, access tokens, or unrelated development workspace files in the package payload.

The manifest MUST NOT contain source code in any field.

The manifest MAY contain an opaque `source_revision` identifier for provenance. That identifier MUST NOT embed source contents or secrets.

The package MUST contain only files permitted by the applicable artifact packaging policy, including the declared entrypoint, required runtime resources, and declared payload dependencies.

### 23.1 Producer requirements

A producer MUST:

- build the distributable from an explicitly defined packaging allowlist or equivalent controlled packaging process
- exclude source files and source-control working directories
- exclude private keys, credentials, tokens, and local environment files
- exclude build caches, temporary files, and unrelated developer artifacts
- generate checksums after the final payload has been assembled
- sign the final manifest after all signed fields are finalized
- verify the assembled package before publication

A producer SHOULD use reproducible packaging steps and preserve build provenance sufficient for authorized audit.

### 23.2 Consumer requirements

A consumer MUST validate the package file inventory against the container and packaging contract.

A consumer MUST reject a package containing prohibited source or secret material when that material is identified by the required packaging policy checks.

A consumer MUST NOT interpret a valid manifest signature as proof that source code is absent.

The manifest contract alone cannot prove the absence of source code. That guarantee requires package inventory validation and a defined source-exclusion policy.

The packaging policy MUST specify how prohibited file classes are detected. Filename extensions alone SHOULD NOT be treated as conclusive evidence because source code can be renamed.

### 23.3 Source-exclusion acceptance

Before publication, the producer's verification process MUST demonstrate that:

- the package inventory contains only permitted deliverables
- source-control directories are absent
- prohibited source and secret files are absent under the applicable policy
- all packaged files are covered by the checksum inventory
- no undeclared payload file is present
- the entrypoint resolves to a packaged payload file
- the final manifest signature validates against the release key

## 24. Error Behavior

A consumer MUST return a stable machine-readable error classification through the surrounding API or protocol contract.

This document defines the semantic error codes. The transport-specific representation, HTTP status mapping, and response envelope MUST follow the applicable API contract.

| Error code | Meaning |
|---|---|
| `MANIFEST_INVALID_JSON` | Input is not valid strict JSON |
| `MANIFEST_DUPLICATE_KEY` | A JSON object contains duplicate member names |
| `MANIFEST_SCHEMA_INVALID` | Required fields, types, or structural constraints fail |
| `MANIFEST_VERSION_UNSUPPORTED` | The manifest format version is unsupported |
| `MANIFEST_FIELD_INVALID` | A field fails a semantic constraint |
| `MANIFEST_SIGNATURE_INVALID` | Signature verification fails |
| `MANIFEST_SIGNING_KEY_UNKNOWN` | The signing key cannot be resolved through trusted configuration |
| `MANIFEST_SIGNING_KEY_REVOKED` | The signing key is revoked or disallowed |
| `MANIFEST_EXPIRED` | The manifest has expired |
| `MANIFEST_CHECKSUM_MISMATCH` | Payload bytes do not match a declared checksum |
| `MANIFEST_PAYLOAD_INVALID` | Payload inventory or package structure is invalid |
| `MANIFEST_ENTRYPOINT_INVALID` | Entrypoint is unsafe, missing, or unsupported |
| `MANIFEST_DEPENDENCY_UNSATISFIED` | A required dependency is unavailable or incompatible |
| `MANIFEST_PLATFORM_INCOMPATIBLE` | Platform or architecture requirements are not satisfied |
| `MANIFEST_RUNTIME_INCOMPATIBLE` | Required runtime or OS version is not supported |
| `MANIFEST_CAPABILITY_UNAVAILABLE` | A required capability is unavailable or prohibited |
| `MANIFEST_SOURCE_POLICY_VIOLATION` | Package violates the source-exclusion or packaging policy |
| `MANIFEST_POLICY_DENIED` | A security or authorization policy rejects the operation |

A consumer MUST report the most specific applicable error without exposing secrets, private key material, internal credentials, or sensitive filesystem details.

A consumer MAY include structured diagnostic details where the surrounding API contract permits them.

A consumer MUST NOT downgrade a signature, checksum, trust, or source-policy failure to a warning when the affected check is mandatory.

## 25. Error Precedence and Recovery

When multiple failures are detected, consumers SHOULD report the earliest mandatory failure in the validation pipeline and MAY include additional safe diagnostic codes.

A consumer MUST NOT report successful validation if any mandatory check fails.

For malformed input, the consumer SHOULD request a corrected manifest rather than attempting implicit repair.

For unsupported format versions, the consumer SHOULD identify the unsupported version and supported versions when policy permits.

For signature failures, the consumer MUST NOT automatically fetch an untrusted replacement key or disable signature validation.

For checksum failures, the consumer MUST reject the affected package and SHOULD require retrieval of a verified package from an authorized source.

For compatibility failures, the consumer MAY suggest a compatible platform or runtime only when that suggestion is based on verified platform metadata.

Retries MUST NOT bypass validation requirements.

## 26. Security Requirements

A consumer MUST treat manifest content as untrusted until parsing, structural validation, signature verification, and applicable trust checks succeed.

A consumer MUST validate all paths before filesystem access.

A consumer MUST prevent path traversal, symbolic-link escape, duplicate-file ambiguity, and payload substitution.

A consumer MUST protect signing private keys using the approved key-management process. Private keys MUST NOT be embedded in manifests or distributable packages.

A consumer MUST enforce key revocation and authorization policy independently of the manifest's claims.

A consumer MUST NOT execute manifest-provided shell commands, URLs, or arbitrary expressions. The `entrypoint` contract identifies a packaged payload path and kind; it does not authorize arbitrary command execution.

A consumer SHOULD limit resource consumption during parsing, checksum calculation, dependency resolution, and archive inspection.

A consumer MUST avoid logging secrets or sensitive data from rejected packages.

## 27. Privacy and Provenance

Manifest fields SHOULD contain only metadata required for identity, compatibility, verification, and audit.

Build metadata MUST NOT expose credentials, personal data, internal hostnames, private repository URLs, or other sensitive details unless explicitly approved by the applicable security policy.

The `builder_id` SHOULD identify a controlled build service or approved builder identity.

The `source_revision` SHOULD be an opaque identifier when a public identifier would reveal private source-control information.

A manifest consumer MUST NOT assume that provenance fields are accurate unless they are covered by a valid signature and the signing identity is trusted for the claimed purpose.

## 28. Publication and Import Rules

Before publication, a producer MUST:

1. finalize the artifact payload
2. enumerate the complete payload file set
3. compute the required checksums
4. populate all required manifest fields
5. validate the manifest structure and semantics
6. confirm source-exclusion policy compliance
7. resolve the trusted signing-key identity
8. produce the signature over the canonical manifest representation
9. validate the completed signature
10. validate the package as a complete unit
11. publish the manifest and payload atomically or through a mechanism that prevents mismatched versions

A consumer MUST treat a manifest and payload as one artifact version.

A consumer MUST NOT combine a manifest from one version with a payload from another version.

A consumer MUST NOT make a package available for execution before mandatory validation completes.

Publication systems SHOULD preserve the manifest, payload, signature, and provenance as an auditable immutable release record.

## 29. Update and Revocation Behavior

A new artifact release MUST use a new `artifact_version` whenever signed artifact content or payload changes.

A consumer MUST NOT overwrite a previously verified artifact in place while retaining the same identity and version.

A signing key may be revoked after publication. Consumers MUST apply current trust policy when deciding whether an artifact may be newly imported or executed.

A previously accepted artifact MUST NOT be considered permanently trusted solely because it passed validation in the past.

The system MUST define whether revocation affects already installed artifacts, queued executions, and currently running workloads. That lifecycle policy belongs to the relevant security and execution contracts.

An expired or revoked artifact MUST NOT become valid again because its manifest is copied, renamed, or republished.

## 30. Observability and Audit

Implementations SHOULD record validation outcomes for operational diagnosis and security audit.

Audit records SHOULD include:

- artifact identity and version
- manifest format version
- validation outcome
- error classification, when rejected
- validation timestamp
- verifier or service identity
- a safe reference to the signing-key identifier
- relevant policy version or decision reference

Audit records MUST NOT contain signing private keys, credentials, complete secret-bearing payloads, or sensitive data copied from untrusted manifest fields.

Audit retention and access controls MUST follow the applicable security and operational policies.

## 31. Conformance Requirements

A producer conforms to this contract only if it:

- emits every required field
- emits valid strict JSON
- conforms to the baseline schema
- satisfies semantic constraints
- emits safe payload-relative paths
- declares all required payload checksums
- computes checksums over final payload bytes
- signs the canonical manifest representation correctly
- uses an approved signing-key identity
- enforces source-exclusion policy
- publishes the manifest and payload as a consistent artifact version

A consumer conforms to this contract only if it:

- parses strict JSON and rejects duplicate keys
- validates all required fields and semantic constraints
- rejects unsupported format versions
- verifies signatures and trust policy
- validates expiration and revocation
- verifies every payload checksum
- rejects unsafe paths and malformed payload inventories
- resolves required dependencies
- evaluates platform and runtime compatibility
- enforces capability and authorization policy
- rejects prohibited source or secret material according to packaging policy
- returns stable error classifications
- prevents installation or execution after mandatory validation failure

A consumer MUST NOT claim conformance based solely on JSON Schema validation.

## 32. Conformance Test Matrix

| Test ID | Test | Expected result |
|---|---|---|
| AM-001 | Valid manifest structure | Schema validation succeeds |
| AM-002 | Missing required field | Reject with `MANIFEST_SCHEMA_INVALID` |
| AM-003 | Unknown top-level field in format `1.0` | Reject with `MANIFEST_SCHEMA_INVALID` |
| AM-004 | Duplicate JSON key | Reject with `MANIFEST_DUPLICATE_KEY` |
| AM-005 | Invalid JSON encoding | Reject with `MANIFEST_INVALID_JSON` |
| AM-006 | Unsupported format version | Reject with `MANIFEST_VERSION_UNSUPPORTED` |
| AM-007 | Invalid identifier syntax | Reject with `MANIFEST_FIELD_INVALID` |
| AM-008 | Invalid version syntax | Reject with `MANIFEST_FIELD_INVALID` |
| AM-009 | Unsupported signature algorithm | Reject the manifest |
| AM-010 | Modified signed field | Reject with `MANIFEST_SIGNATURE_INVALID` |
| AM-011 | Unknown signing key | Reject with `MANIFEST_SIGNING_KEY_UNKNOWN` |
| AM-012 | Revoked signing key | Reject with `MANIFEST_SIGNING_KEY_REVOKED` |
| AM-013 | Malformed signature encoding | Reject with `MANIFEST_SIGNATURE_INVALID` |
| AM-014 | Expired manifest | Reject with `MANIFEST_EXPIRED` |
| AM-015 | Null expiration | Continue to other mandatory checks |
| AM-016 | Payload digest mismatch | Reject with `MANIFEST_CHECKSUM_MISMATCH` |
| AM-017 | Missing checksummed payload file | Reject with `MANIFEST_PAYLOAD_INVALID` |
| AM-018 | Duplicate checksum path | Reject with `MANIFEST_FIELD_INVALID` |
| AM-019 | Undeclared payload file | Reject with `MANIFEST_PAYLOAD_INVALID` |
| AM-020 | Absolute entrypoint path | Reject with `MANIFEST_ENTRYPOINT_INVALID` |
| AM-021 | Path traversal attempt | Reject the manifest or package |
| AM-022 | Missing entrypoint file | Reject with `MANIFEST_ENTRYPOINT_INVALID` |
| AM-023 | Unsupported architecture | Reject with `MANIFEST_PLATFORM_INCOMPATIBLE` |
| AM-024 | Incompatible runtime version | Reject with `MANIFEST_RUNTIME_INCOMPATIBLE` |
| AM-025 | Missing required dependency | Reject with `MANIFEST_DEPENDENCY_UNSATISFIED` |
| AM-026 | Missing optional dependency | Follow the declared optional-dependency policy |
| AM-027 | Unsupported required capability | Reject with `MANIFEST_CAPABILITY_UNAVAILABLE` |
| AM-028 | Prohibited source file in package | Reject with `MANIFEST_SOURCE_POLICY_VIOLATION` |
| AM-029 | Secret or private key in package | Reject with `MANIFEST_SOURCE_POLICY_VIOLATION` or the applicable policy error |
| AM-030 | Payload changed after signing | Reject through signature or checksum validation |
| AM-031 | Conflicting payload under same artifact version | Reject publication or import |
| AM-032 | Validation failure followed by execution attempt | Execution remains denied |

Test implementations MUST assert the externally observable error classification where the surrounding API contract exposes one.

## 33. Test Fixtures and Determinism

Conformance suites MUST use deterministic fixtures for canonicalization, signature generation, checksum calculation, and version comparison.

Cryptographic test fixtures MUST use test-only keys. Production signing keys MUST NOT be embedded in test repositories.

Tests MUST cover both positive and negative cases.

Tests MUST include malformed input, boundary lengths, unsupported values, duplicate entries, invalid paths, and cross-field inconsistencies.

A conformance suite SHOULD test the same manifest across independent producer and consumer implementations to detect canonicalization and parsing differences.

Test results MUST record the tested contract version and implementation revision.

## 34. Acceptance Checklist

The contract implementation is acceptable only when the relevant checklist items have evidence.

### 34.1 Schema and parsing

- [ ] All required fields are implemented with exact names and types.
- [ ] The Draft 2020-12 schema is validated by the selected validator.
- [ ] Duplicate JSON keys are rejected.
- [ ] Unknown top-level fields are rejected for format `1.0`.
- [ ] Identifier and version validation is deterministic.
- [ ] Date-time values require an explicit UTC offset.
- [ ] Input size and parser limits are enforced.

### 34.2 Integrity and authenticity

- [ ] Canonicalization follows RFC 8785.
- [ ] The top-level `signature` field is excluded from signature input.
- [ ] `signing_key_id` remains included in signature input.
- [ ] Ed25519 signatures are generated and verified correctly.
- [ ] Unknown and revoked keys are rejected.
- [ ] Every payload checksum is verified.
- [ ] Duplicate or missing payload entries are rejected.

### 34.3 Compatibility and execution

- [ ] Platform and architecture compatibility is checked.
- [ ] Kritva OS, SDK, and runtime requirements are checked.
- [ ] Dependency constraints are evaluated by the defined resolver.
- [ ] Required capabilities are available and permitted.
- [ ] Expiration and revocation are enforced.
- [ ] Invalid artifacts cannot be installed or executed.
- [ ] Error classifications are stable and testable.

### 34.4 Source-exclusion policy

- [ ] The packaging allowlist or equivalent controlled process is defined.
- [ ] Source-control metadata is excluded.
- [ ] Source code and source diffs are excluded under the packaging policy.
- [ ] Credentials and private keys are excluded.
- [ ] All payload files are enumerated and checksummed.
- [ ] Undeclared files are rejected.
- [ ] The final package passes source-exclusion verification.

### 34.5 Documentation and governance

- [ ] The implementation references this contract.
- [ ] Related protocol specifications do not conflict with this contract.
- [ ] Security and trust policies are identified.
- [ ] Required conformance tests pass.
- [ ] Any deviation is documented and approved.
- [ ] Acceptance evidence is linked from the owning milestone dossier.

## 35. Implementation Guidance

Implementations SHOULD separate the following responsibilities:

- strict JSON parsing
- structural schema validation
- semantic field validation
- signature canonicalization and verification
- trusted-key resolution
- package inventory validation
- checksum verification
- dependency resolution
- platform and runtime compatibility
- capability and authorization evaluation
- source-exclusion policy enforcement
- audit and error reporting

This separation improves testability and makes validation failures easier to diagnose.

An implementation MAY use a different internal module structure, provided the externally observable behavior satisfies this contract.

The contract MUST remain independent of a particular programming language or JSON library.

## 36. Open Contract Dependencies

Before production acceptance, the owning engineering and security teams MUST verify the following related policy details and record their authoritative locations:

- [ ] The `.krv` container layout and payload inventory rules are specified.
- [ ] The trusted signing-key registry and revocation policy are specified.
- [ ] Dependency constraint grammar and resolver behavior are specified.
- [ ] Platform and runtime compatibility policies are specified.
- [ ] Capability vocabulary and permission policy are specified.
- [ ] Source-exclusion detection policy is specified.
- [ ] Artifact import and execution authorization behavior is specified.
- [ ] Transport-specific error mapping is specified.
- [ ] Artifact lifecycle behavior after key revocation is specified.

These are dependencies for complete system conformance. Their presence is not implied by this checklist.

## 37. Versioning and Change Control

This document defines manifest format version `1.0`.

Any change to a required field, field type, signature input, checksum interpretation, mandatory validation rule, or error behavior MUST undergo contract review.

A change that causes an existing conforming consumer to reject a previously valid `1.0` manifest MUST NOT be introduced silently under the same format version.

Changes to the schema and examples MUST remain synchronized with the normative sections.

The owner MUST update conformance tests whenever a normative rule changes.

A contract revision MUST include a compatibility assessment covering producers, consumers, stored artifacts, signature verification, and rollout behavior.

## 38. Phase and Milestone Traceability

Phase definitions are maintained only in `docs/planning/PHASES.md`.

The manifest contract supports artifact handling across the relevant product and engineering work. It does not redefine phase scope or milestone acceptance.

Relevant milestone references include:

- B-M02 ARTIFACT
- B-M03 PLATFORM
- B-M05 EXECUTION
- B-M07 PRODUCTION
- DB-M01 FOUNDATION
- DB-M02 CORE DATA
- C-M02 DEVELOPMENT
- C-M03 STAGING
- C-M04 PRODUCTION

These references are navigation aids, not a claim that the listed milestones are complete or that this contract alone satisfies their acceptance criteria.

The authoritative milestone dossiers under `docs/**/milestones/` determine which deliverables, tests, reviews, and approvals are required for each milestone.

## 39. Contract Acceptance

This document may be treated as the implementation baseline when its normative rules have been reviewed by the owning protocol, architecture, and security reviewers.

Production conformance additionally requires:

- an approved and published schema
- a defined `.krv` container contract
- an operational trusted-key and revocation policy
- implemented validation and compatibility checks
- source-exclusion verification
- passing conformance tests
- acceptance evidence recorded in the owning milestone dossier

Until those conditions are verified, the existence of this document MUST NOT be represented as proof of a production-ready artifact pipeline.

## 40. Changelog

### Initial Normative Baseline

- Defined the `.krv` artifact manifest purpose and required top-level fields.
- Established strict JSON serialization and structural validation rules.
- Defined the baseline JSON Schema using Draft 2020-12.
- Specified identity, version, entrypoint, capability, dependency, checksum, and build metadata requirements.
- Defined expiration, Ed25519 signature, canonicalization, and signing-key identification behavior.
- Established compatibility checks and fail-closed validation sequencing.
- Defined source-code exclusion and package inventory requirements.
- Added stable error classifications, conformance tests, and acceptance checklists.
- Identified external contract dependencies that must be verified before production acceptance.

### Future Updates

Future revisions MUST preserve field-name stability, maintain schema and normative-rule consistency, document compatibility impact, and retain conformance evidence for every supported manifest format version.

---
layout: doc
title: Auth - Session
---

# Session

## HcSessionModule

### Options

- `store` - Nest provider with SessionStore implementation. There are Predefined stores with providers:
  - RedisSessionStoreProvider - provides redis store
  - MemorySessionStoreProvider - provides app in-memory store

### Config

|                 |                                                                                  |
| --------------- | -------------------------------------------------------------------------------- |
| lifetime        | max session time before terminate, defined in duration format(`[number]h\|m\|s`) |
| initialLifetime | session initial time to live as Duration(default: `5m`)                          |

**cookie** - options of session http cookie
| | |
| -------- | ---------------------------------------------------- |
| name | default: `SID` |
| httpOnly | default: `true` |
| secure | default: `true` |
| sameSite | default: `strict` |
| path | default: `/` |
| domain | default: `<empty>` |
| sign | secretPath(default: `core.auth.session.cookie.sign`) |
| | enabled(default: `true`) |

### Secrets

#### Session Cookie signing

Signing cookie supports rotating secrets(signing always use first defined and checking signature itarating via all([More info](https://www.npmjs.com/package/@fastify/cookie#rotating-signing-secret))).

**Default path:** `core.auth.session.cookie.sign`

**Format:**

```ini
current_secret
old_secret
```

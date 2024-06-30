---
layout: doc
title: Auth - OIDC
---

# OpenId Connect

## HcSessionModule

### Module Options

|              |                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------ |
| sessionStore | Nest provider with SessionStore implementation. There are Predefined stores with providers |
|              | - RedisOpenIdSessionStoreProvider                                                          |
|              | - MemoryOpenIdSessionStoreProvider                                                         |

### Config

Default base key: `core.auth.openid`

**client**
| | |
|----------------|---------------------------------------|
| issuerDiscover | URL to openid configuration discovery |
| clientId | ID of OpenId Connect client |
| clientSecretPath | default: `core.auth.openid.user.client` |
| defaultMaxAge | Authorize max time in seconds |

**app**
|  |  |  |
|---|---|---|
| apiBaseUrl | URL to application API. |  |
| session | Session module configuration([Auth->Session](/reference/auth/session)). |  |
| login | Options for user login operation. |  |
|  | scope | OpenID scopes. |
|  | [audience] | Optional audience. |
|  | [claims] | Optional individual OpenID Claims. |
| redirect |  |  |
|  | baseUrl | Application base URL(after normal login user will be redirected there). |
|  | postLogoutUrl | Application post logout URL. |
|  | errorUrl | Redirects user there when any auth error ocurred. |


### Secrets

**OpenId Client secret:**
  - default: `core.auth.openid.user.client`
  - format: `string`

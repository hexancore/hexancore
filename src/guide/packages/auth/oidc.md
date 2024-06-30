---
layout: doc
title: Auth - OpenID Connect
---

# OpenID Connect Integration <HcWipTag/>

## Introduction to OpenID Connect

OpenID Connect (OIDC) is an authentication layer built on top of the OAuth 2.0 protocol. It allows clients to verify the identity of the end-user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end-user in an interoperable and REST-like manner.

OIDC provides a robust mechanism for clients to receive identity assertions from a trusted identity provider (IdP) in a secure and standardized way.

### Benefits of OpenID Connect

OpenID Connect simplifies the authentication process by providing a framework where information about the end-users can be obtained securely, efficiently, and reliably. It extends OAuth 2.0 with capabilities to:

- **Authenticate Users:** Confirm the identity of the users based on the authentication performed by the Authorization Server.
- **Obtain User Information:** Securely retrieve user details with the help of ID tokens, which include identity information about the user that has been authenticated.
- **Single Sign-On (SSO):** Facilitate SSO by enabling users to log in once and use multiple applications without needing to authenticate again.
- **Standardized Protocol:** Leverage a widely adopted standard that ensures compatibility across different systems and platforms.

### More Info

Check official website: https://openid.net/developers/how-connect-works/

## Integration

The `@hexancore/auth` package enhances application security and user management by integrating OpenID Connect, offering several features and benefits:

- **Easy Integration with Identity Providers:** `@hexancore/auth` is designed to seamlessly integrate with OpenID Connect-compliant identity providers (IdPs) such as Auth0, Amazon Cognito, Google, Keycloak. This simplifies the process of setting up secure authentication across different platforms.

- **Enhanced Security:** By utilizing OpenID Connect, `@hexancore/auth` leverages robust, battle-tested protocols to ensure that the identity information provided is from a trusted source.

- **Simplified User Authentication:** Developers can implement complex authentication mechanisms easily with high-level abstractions provided by `@hexancore/auth`, reducing the need for handling lower-level details and thereby decreasing the potential for security vulnerabilities.

- **Scalable Authentication Solution:** Whether you are building a small application or a large-scale enterprise system, `@hexancore/auth` scales to meet your needs without compromising on performance or security.

- **Comprehensive Configuration Options:** Customize the authentication flow to suit specific requirements of your application, including adjusting session lifetimes, token refresh mechanisms, and selecting which user profile fields are required.

### Test OpenID Connect Provider

`@hexancore/auth` provides simple OIDC provider for testing purpose.

#### Configure

Create provider config in `config/dev/test_oidc_provider.yaml`
```yaml
https: true
clients:
  - client_id: test_client
    flow_type: 'authorization_code'
    redirect_uris:
      - https://localhost:3000/user/protected/auth/login-callback
    post_logout_redirect_uris:
      - https://localhost:3000/user/protected/auth/logout-callback
```

Run provider with
```
pnpm hc_auth_test_oidc_provider
```

### HcOpenIdUserModule

**HcOpenIdUserModule** is module tailored specifically for handling user authentication through OpenID Connect with statefull application sessions.

#### Importing module

**HcOpenIdUserModule** is typically used as a global module in the main application module.

```ts{7-9}
import { HcAppRedisModule, } from '@hexancore/cloud';
import { HcHttpModule, HcModule } from '@hexancore/core';
import {HcOpenIdUserModule,RedisOpenIdSessionStoreProvider} from '@hexancore/auth';

@Global()
@Module({
  imports: [
    HcModule.forRoot({}),
    HcHttpModule,
    HcAppRedisModule,
    HcOpenIdUserModule.forRoot({
      sessionStore: RedisOpenIdSessionStoreProvider(),
    })
  ]
})
class AppModule {
}
```

### Configuring

Now let's configure the **HcOpenIdUserModule**.

#### Module Options

- `sessionStore` - Nest provider with SessionStore implementation. There are Predefined stores with providers:
  - RedisOpenIdSessionStoreProvider - provides redis store
  - MemoryOpenIdSessionStoreProvider - provides app in-memory store

#### Config

Rest of configuration is stored in `config`

```yaml
core:
  auth:
    openid:
      user:
        client:
          issuerDiscover: https://localhost:20012/oidc/.well-known/openid-configuration
          clientId: test_client
          defaultMaxAge: 300
        app:
          apiBaseUrl: https://localhost:3000
          session:
            lifetime: 1h
            initialLifetime: 5m
            cookie:
              sameSite: lax
          login:
            scope:
              - openid
              - email
          redirect:
            baseUrl: https://localhost:3000/front/protected/dashboard
            postLogoutUrl: https://localhost:3000/front/public/post-logout
            errorUrl: https://localhost:3000/front/public/auth-error
            loginRequest:
              login_popup: https://localhost:3000/front/user/login-request-redirect
```

#### Client Secret

OIDC Client secret is stored in standard AppConfig secret: `core.auth.openid.user.client`

### Authenticate flow controller

Module provide controller with routes to support user authenticate flow.

#### Usable Endpoints

- OpenID Connect provider login page redirect: `https://<app-api-url>/user/public/auth/login`
- OpenID Connect provider logout page redirect: `https://<app-api-url>/user/protected/auth/logout`

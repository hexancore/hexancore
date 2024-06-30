---
layout: doc
title: Auth - Session
---

# Session <HcWipTag/>

The `@hexancore/auth` for the session mechanism is a dedicated tool for user authentication and session management in Hexancore applications. It is an essential component for projects requiring secure access to resources based on user identification.

## HcSessionModule

### Chapter 1: SessionData

`SessionData` represents user data stored in session. Supports tracking property change for persistence mechanism.

```ts
import { AuthSessionErrors, SessionData } from '@hexancore/auth';
import { AppErrorCode, ERR, OK, type R } from '@hexancore/common';

export class TestSessionData extends SessionData {
  public constructor(public field: string = 'test', public auth = false, public groupId?: string) {
    super();
    return this.proxify();
  }

  public static c(plain: any): R<TestSessionData> {
    if (typeof plain?.field !== 'string') {
      return ERR(AuthSessionErrors.session_data_create_from_plain, AppErrorCode.INTERNAL_ERROR, {
        field: 'missing',
      });
    }
    return OK(new TestSessionData(plain.field, plain.auth, plain.groupId));
  }

  public getSessionGroupId(): string | null {
    return this.groupId;
  }

  public isAuthenticated(): boolean {
    return this.auth;
  }

  public toJSON(): Record<string, any> {
    return {
      field: this.field,
      auth: this.auth,
      groupId: this.groupId,
    };
  }
}
```

### Chapter 2: Module

Add module **HcSessionModule** from `@hexancore/auth` to main app module.

```ts{7-9}
@Global()
@Module({
  imports: [
    HcModule.forRoot({}),
    HcHttpModule,
    HcAppRedisModule,
    HcSessionModule.forRoot({
      store: RedisSessionStoreProvider(TestSessionData.c),
    })
  ]
})
class AppModule {
}
```

### Chapter 3: Configuration

In example above we used Redis as session store.

#### Config

Rest of configuration is stored in AppConfig

```yaml{3-8}
core:
  auth:
    session:
      lifetime: 6h
      initialLifetime: 5m
      cookie:
        sameSite: lax
```


#### Secrets

Module with default option will sign session cookie. Add sign secret key in `config/<env>/secrets/core.auth.session.cookie.sign`.

```
test_secret
```
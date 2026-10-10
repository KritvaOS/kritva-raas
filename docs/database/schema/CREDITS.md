# Kritva RaaS Credits Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Credits Schema |
| Path | `docs/database/schema/CREDITS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `credit` |
| Primary Domain Owner | Credit Module |
| Tenant Boundary | Organization |
| Identifier Strategy | UUIDv7 |
| Currency of Usage | Platform-specific Credits |
| Financial Authority | PostgreSQL |
| Ledger Model | Append-oriented double-entry |
| Payment Provider | Provider-neutral |
| Phase Coverage | Phase 0–Phase 8 |
| Related Domains | Organization, Platform, Project, Booking, Execution, Audit |

# 2. Purpose

This document defines the production-grade database schema for the Kritva RaaS
credit system.

The Credit domain provides the authoritative accounting model for prepaid or
subscription-associated robotic execution credits.

The architecture principle is:

    Subscription / Plan
            |
            v
       Credit Plan
            |
            v
       Platform Credit Type
            |
            v
      Organization Wallet
            |
            v
       Credit Ledger
            |
       +----+----+
       |         |
       v         v
   Reservation  Consumption
       |         |
       +----+----+
            |
          Refund
            |
            v
       Wallet Balance

Credits are consumed according to:

    Platform
        +
    Resource Configuration
        +
    Duration
        +
    Rate
        =
    Credit Cost

The core commercial principle is:

> Subscription determines access; robotic platform determines credit type;
> resource configuration and duration determine consumption.

# 3. Scope

This document defines:

- platform-specific credit types;
- credit plans;
- rate definitions;
- effective-dated rates;
- organization wallets;
- wallet balances;
- double-entry ledger;
- ledger accounts;
- ledger transactions;
- ledger entries;
- credit reservations;
- credit consumption;
- refunds;
- adjustments;
- invoices;
- payment transactions;
- credit purchase transactions;
- booking integration;
- job integration;
- idempotency;
- reconciliation;
- audit;
- retention;
- tenancy;
- financial consistency;
- concurrency control;
- lifecycle state machines;
- repository interfaces;
- application-service boundaries;
- Phase 0–Phase 8 mapping.

# 4. Non-Goals

This document does not define:

- payment-provider-specific implementation;
- card processing;
- banking settlement;
- tax calculation engines;
- subscription-management implementation;
- general accounting/ERP;
- robot booking;
- Job execution;
- Artifact validation;
- Result storage;
- customer source-code storage.

Payment-provider integration is represented through provider-neutral transaction
records and adapters.

# 5. Goals

The Credit domain must provide:

1. deterministic credit pricing;
2. platform-specific credit types;
3. organization-owned wallets;
4. append-oriented accounting;
5. double-entry financial integrity;
6. transactional reservation;
7. deterministic consumption;
8. safe refunds;
9. auditable adjustments;
10. idempotent financial operations;
11. effective-dated rates;
12. historical pricing preservation;
13. tenant isolation;
14. concurrency protection;
15. reconciliation;
16. invoice/payment traceability.

# 6. Core Commercial Model

The RaaS pricing model is:

    Credit Cost
        =
    Rate
        ×
    Billable Duration
        ×
    Resource Configuration Factor
        ×
    Optional Policy Factors

Example:

    Platform:
        Humanoid-A

    Rate:
        15 credits / minute

    Duration:
        30 minutes

    Cost:
        15 × 30 = 450 credits

The exact pricing engine may later support additional dimensions, but every
charge must resolve to a deterministic pricing snapshot.

# 7. Credit Type Principle

Credit types are platform-specific.

Examples:

    HUMANOID_A_CREDIT
    HUMANOID_B_CREDIT
    ARM_LAB_CREDIT
    VISION_GPU_CREDIT
    SIMULATOR_CREDIT

Credits are not transferable between platform credit types by default.

Therefore:

    Wallet(Humanoid-A Credits)
              !=
    Wallet(Humanoid-B Credits)

# 8. Credit Type Ownership

Platform is the authoritative owner of platform identity.

Credit owns the commercial credit type associated with a Platform.

The relationship is:

    platform.platforms
          |
          v
    credit.credit_types
          |
          v
    credit.credit_plans
          |
          v
    credit.wallets

# 9. Credit Type Lifecycle

    DRAFT
      |
      v
    ACTIVE
      |
      +----> DEPRECATED
      |
      v
    RETIRED

Retired credit types cannot be used for new purchases or reservations.

Historical transactions remain valid.

# 10. Credit Type Table

`credit.credit_types` identifies a spendable credit denomination associated
with a robotic platform.

# 11. `credit.credit_types` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| credit_type_id | uuid | No | UUIDv7 | Credit type ID |
| platform_id | uuid | No | None | Associated Platform |
| code | varchar(64) | No | None | Stable code |
| name | varchar(200) | No | None | Display name |
| description | varchar(2000) | Yes | NULL | Description |
| status | credit_type_status | No | `DRAFT` | Lifecycle |
| unit_name | varchar(32) | No | `'credit'` | Display unit |
| transferable | boolean | No | `false` | Transfer policy |
| refundable | boolean | No | `true` | Refund policy |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| updated_by | uuid | Yes | NULL | Actor |

# 12. Credit Type DDL

    CREATE SCHEMA IF NOT EXISTS credit;

    CREATE TYPE credit.credit_type_status AS ENUM (
        'DRAFT',
        'ACTIVE',
        'DEPRECATED',
        'RETIRED'
    );

    CREATE TABLE credit.credit_types (
        credit_type_id UUID PRIMARY KEY,
        platform_id UUID NOT NULL,
        code VARCHAR(64) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(2000) NULL,
        status credit.credit_type_status
            NOT NULL DEFAULT 'DRAFT',
        unit_name VARCHAR(32) NOT NULL DEFAULT 'credit',
        transferable BOOLEAN NOT NULL DEFAULT false,
        refundable BOOLEAN NOT NULL DEFAULT true,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT credit_types_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_types_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_types_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT credit_types_code_unique
            UNIQUE (code),
        CONSTRAINT credit_types_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object'),
        CONSTRAINT credit_types_unit_check
            CHECK (length(trim(unit_name)) > 0)
    );

# 13. Credit Type Indexes

    CREATE INDEX credit_types_platform_status_idx
        ON credit.credit_types(platform_id, status);

    CREATE INDEX credit_types_status_idx
        ON credit.credit_types(status);

# 14. Credit Plans

A Credit Plan defines how an Organization can obtain and use a particular
credit type.

A plan may represent:

- Student;
- Developer;
- Research;
- Enterprise;
- promotional;
- internal;
- administrative.

Subscription access and credit pricing remain logically separate.

# 15. `credit.credit_plans` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| credit_plan_id | uuid | No | UUIDv7 | Plan ID |
| credit_type_id | uuid | No | None | Credit Type |
| code | varchar(64) | No | None | Stable plan code |
| name | varchar(200) | No | None | Display name |
| description | varchar(2000) | Yes | NULL | Description |
| status | credit_plan_status | No | `DRAFT` | Lifecycle |
| included_credits | numeric(20,6) | No | `0` | Included amount |
| purchase_price_minor | bigint | Yes | NULL | Price in currency minor units |
| currency | char(3) | Yes | NULL | ISO currency |
| validity_days | integer | Yes | NULL | Credit validity |
| auto_renew | boolean | No | `false` | Renewal policy |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| effective_from | timestamptz | No | None | Effective time |
| effective_until | timestamptz | Yes | NULL | End time |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| updated_by | uuid | Yes | NULL | Actor |

# 16. Credit Plan DDL

    CREATE TYPE credit.credit_plan_status AS ENUM (
        'DRAFT',
        'ACTIVE',
        'DEPRECATED',
        'RETIRED'
    );

    CREATE TABLE credit.credit_plans (
        credit_plan_id UUID PRIMARY KEY,
        credit_type_id UUID NOT NULL,
        code VARCHAR(64) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(2000) NULL,
        status credit.credit_plan_status
            NOT NULL DEFAULT 'DRAFT',
        included_credits NUMERIC(20,6)
            NOT NULL DEFAULT 0,
        purchase_price_minor BIGINT NULL,
        currency CHAR(3) NULL,
        validity_days INTEGER NULL,
        auto_renew BOOLEAN NOT NULL DEFAULT false,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        effective_from TIMESTAMPTZ NOT NULL,
        effective_until TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT credit_plans_credit_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_plans_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_plans_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT credit_plans_code_unique
            UNIQUE (code),
        CONSTRAINT credit_plans_amount_check
            CHECK (included_credits >= 0),
        CONSTRAINT credit_plans_price_check
            CHECK (purchase_price_minor IS NULL OR purchase_price_minor >= 0),
        CONSTRAINT credit_plans_validity_check
            CHECK (validity_days IS NULL OR validity_days > 0),
        CONSTRAINT credit_plans_currency_check
            CHECK (
                purchase_price_minor IS NULL
                OR currency IS NOT NULL
            ),
        CONSTRAINT credit_plans_period_check
            CHECK (
                effective_until IS NULL
                OR effective_until > effective_from
            ),
        CONSTRAINT credit_plans_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 17. Credit Plan Indexes

    CREATE INDEX credit_plans_type_status_idx
        ON credit.credit_plans(credit_type_id, status);

    CREATE INDEX credit_plans_effective_idx
        ON credit.credit_plans(
            credit_type_id,
            effective_from,
            effective_until
        );

# 18. Rate Definitions

Rates define the cost of robotic resources.

A rate is associated with:

- Credit Type;
- Platform;
- optional resource configuration;
- billable unit;
- effective period.

Rates are immutable once used by a financial transaction.

A changed rate requires a new effective-dated record.

# 19. `credit.credit_rates` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| credit_rate_id | uuid | No | UUIDv7 | Rate ID |
| credit_type_id | uuid | No | None | Credit Type |
| platform_id | uuid | No | None | Platform |
| platform_configuration_id | uuid | Yes | NULL | Configuration |
| rate_code | varchar(64) | No | None | Stable code |
| credits_per_unit | numeric(20,6) | No | None | Credit price |
| billing_unit | billing_unit | No | `MINUTE` | Unit |
| minimum_units | numeric(20,6) | No | `0` | Minimum billable |
| maximum_units | numeric(20,6) | Yes | NULL | Maximum |
| rounding_mode | rounding_mode | No | `CEIL` | Rounding |
| status | rate_status | No | `DRAFT` | Lifecycle |
| effective_from | timestamptz | No | None | Effective start |
| effective_until | timestamptz | Yes | NULL | Effective end |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| updated_by | uuid | Yes | NULL | Actor |

# 20. Rate Enums

    CREATE TYPE credit.billing_unit AS ENUM (
        'SECOND',
        'MINUTE',
        'HOUR',
        'RUN',
        'JOB',
        'FIXED'
    );

    CREATE TYPE credit.rounding_mode AS ENUM (
        'FLOOR',
        'CEIL',
        'ROUND'
    );

    CREATE TYPE credit.rate_status AS ENUM (
        'DRAFT',
        'ACTIVE',
        'DEPRECATED',
        'RETIRED'
    );

# 21. Rate DDL

    CREATE TABLE credit.credit_rates (
        credit_rate_id UUID PRIMARY KEY,
        credit_type_id UUID NOT NULL,
        platform_id UUID NOT NULL,
        platform_configuration_id UUID NULL,
        rate_code VARCHAR(64) NOT NULL,
        credits_per_unit NUMERIC(20,6) NOT NULL,
        billing_unit credit.billing_unit NOT NULL DEFAULT 'MINUTE',
        minimum_units NUMERIC(20,6) NOT NULL DEFAULT 0,
        maximum_units NUMERIC(20,6) NULL,
        rounding_mode credit.rounding_mode
            NOT NULL DEFAULT 'CEIL',
        status credit.rate_status NOT NULL DEFAULT 'DRAFT',
        effective_from TIMESTAMPTZ NOT NULL,
        effective_until TIMESTAMPTZ NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT credit_rates_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_rates_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_rates_configuration_fk
            FOREIGN KEY (platform_configuration_id)
            REFERENCES platform.platform_configurations(platform_configuration_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_rates_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT credit_rates_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT credit_rates_code_unique
            UNIQUE (rate_code),
        CONSTRAINT credit_rates_amount_check
            CHECK (credits_per_unit > 0),
        CONSTRAINT credit_rates_minimum_check
            CHECK (minimum_units >= 0),
        CONSTRAINT credit_rates_maximum_check
            CHECK (
                maximum_units IS NULL
                OR maximum_units >= minimum_units
            ),
        CONSTRAINT credit_rates_period_check
            CHECK (
                effective_until IS NULL
                OR effective_until > effective_from
            ),
        CONSTRAINT credit_rates_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 22. Rate Indexes

    CREATE INDEX credit_rates_platform_effective_idx
        ON credit.credit_rates(
            platform_id,
            effective_from,
            effective_until
        );

    CREATE INDEX credit_rates_type_status_idx
        ON credit.credit_rates(credit_type_id, status);

    CREATE INDEX credit_rates_configuration_idx
        ON credit.credit_rates(platform_configuration_id);

# 23. Pricing Snapshot

Every reservation or consumption must retain a pricing snapshot.

The snapshot includes:

- rate ID;
- rate code;
- credit type;
- units;
- unit rate;
- rounding;
- calculated credits;
- effective timestamp.

Historical transactions must never depend on today's rate.

# 24. Wallets

A Wallet is the organization-owned balance container for one Credit Type.

The uniqueness rule is:

    UNIQUE (organization_id, credit_type_id)

An Organization may therefore have multiple wallets.

# 25. `credit.wallets` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| wallet_id | uuid | No | UUIDv7 | Wallet ID |
| organization_id | uuid | No | None | Tenant |
| credit_type_id | uuid | No | None | Credit denomination |
| ledger_account_id | uuid | No | None | Wallet ledger account |
| available_balance | numeric(20,6) | No | `0` | Available credits |
| reserved_balance | numeric(20,6) | No | `0` | Reserved credits |
| lifetime_credited | numeric(20,6) | No | `0` | Total credited |
| lifetime_consumed | numeric(20,6) | No | `0` | Total consumed |
| lifetime_refunded | numeric(20,6) | No | `0` | Total refunded |
| status | wallet_status | No | `ACTIVE` | Lifecycle |
| expires_at | timestamptz | Yes | NULL | Wallet expiry |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| updated_by | uuid | Yes | NULL | Actor |

# 26. Wallet DDL

    CREATE TYPE credit.wallet_status AS ENUM (
        'ACTIVE',
        'SUSPENDED',
        'EXPIRED',
        'CLOSED'
    );

    CREATE TABLE credit.wallets (
        wallet_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        credit_type_id UUID NOT NULL,
        ledger_account_id UUID NOT NULL,
        available_balance NUMERIC(20,6)
            NOT NULL DEFAULT 0,
        reserved_balance NUMERIC(20,6)
            NOT NULL DEFAULT 0,
        lifetime_credited NUMERIC(20,6)
            NOT NULL DEFAULT 0,
        lifetime_consumed NUMERIC(20,6)
            NOT NULL DEFAULT 0,
        lifetime_refunded NUMERIC(20,6)
            NOT NULL DEFAULT 0,
        status credit.wallet_status NOT NULL DEFAULT 'ACTIVE',
        expires_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT wallets_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT wallets_credit_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT wallets_account_fk
            FOREIGN KEY (ledger_account_id)
            REFERENCES credit.ledger_accounts(ledger_account_id)
            ON DELETE RESTRICT,
        CONSTRAINT wallets_unique
            UNIQUE (organization_id, credit_type_id),
        CONSTRAINT wallets_balance_check
            CHECK (
                available_balance >= 0
                AND reserved_balance >= 0
            ),
        CONSTRAINT wallets_lifetime_check
            CHECK (
                lifetime_credited >= 0
                AND lifetime_consumed >= 0
                AND lifetime_refunded >= 0
            )
    );

# 27. Wallet Indexes

    CREATE INDEX wallets_organization_idx
        ON credit.wallets(organization_id);

    CREATE INDEX wallets_credit_type_status_idx
        ON credit.wallets(credit_type_id, status);

# 28. Ledger Design

The ledger is append-oriented and double-entry.

Wallet balances are operational projections.

The ledger is the accounting evidence.

The core invariant is:

    Sum(all ledger debits)
        =
    Sum(all ledger credits)

for every posted ledger transaction.

# 29. Ledger Accounts

Ledger accounts represent accounting sides of the credit system.

Initial account types:

    WALLET
    CREDIT_LIABILITY
    REVENUE
    REFUND
    PROMOTION
    ADJUSTMENT
    EXPIRATION
    CLEARING

# 30. `credit.ledger_accounts` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| ledger_account_id | uuid | No | UUIDv7 | Account ID |
| organization_id | uuid | Yes | NULL | Tenant for wallet accounts |
| credit_type_id | uuid | No | None | Credit Type |
| account_code | varchar(100) | No | None | Stable code |
| account_type | ledger_account_type | No | None | Account class |
| name | varchar(200) | No | None | Display name |
| status | ledger_account_status | No | `ACTIVE` | Lifecycle |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| updated_by | uuid | Yes | NULL | Actor |

# 31. Ledger Account DDL

    CREATE TYPE credit.ledger_account_type AS ENUM (
        'WALLET',
        'CREDIT_LIABILITY',
        'REVENUE',
        'REFUND',
        'PROMOTION',
        'ADJUSTMENT',
        'EXPIRATION',
        'CLEARING'
    );

    CREATE TYPE credit.ledger_account_status AS ENUM (
        'ACTIVE',
        'SUSPENDED',
        'CLOSED'
    );

    CREATE TABLE credit.ledger_accounts (
        ledger_account_id UUID PRIMARY KEY,
        organization_id UUID NULL,
        credit_type_id UUID NOT NULL,
        account_code VARCHAR(100) NOT NULL,
        account_type credit.ledger_account_type NOT NULL,
        name VARCHAR(200) NOT NULL,
        status credit.ledger_account_status
            NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT ledger_accounts_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_accounts_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_accounts_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_accounts_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT ledger_accounts_code_unique
            UNIQUE (account_code)
    );

# 32. Ledger Account Ownership

Wallet accounts have:

    organization_id IS NOT NULL
    account_type = WALLET

System accounts may have:

    organization_id IS NULL

The application service must enforce the semantic relationship.

# 33. Ledger Transactions

A Ledger Transaction is an immutable accounting event.

Examples:

    CREDIT_PURCHASE
    CREDIT_CONSUMPTION
    CREDIT_RESERVATION
    CREDIT_RELEASE
    CREDIT_REFUND
    CREDIT_ADJUSTMENT
    CREDIT_EXPIRATION
    PROMOTIONAL_CREDIT

# 34. `credit.ledger_transactions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| ledger_transaction_id | uuid | No | UUIDv7 | Transaction ID |
| organization_id | uuid | No | None | Tenant |
| credit_type_id | uuid | No | None | Credit Type |
| transaction_type | ledger_transaction_type | No | None | Accounting event |
| status | ledger_transaction_status | No | `DRAFT` | State |
| reference_type | varchar(64) | Yes | NULL | Domain reference |
| reference_id | uuid | Yes | NULL | Domain ID |
| idempotency_key | varchar(255) | No | None | Retry key |
| description | varchar(2000) | Yes | NULL | Description |
| posted_at | timestamptz | Yes | NULL | Posting time |
| created_at | timestamptz | No | `now()` | Creation |
| created_by | uuid | No | None | Actor |
| metadata | jsonb | No | `'{}'` | Evidence |

# 35. Ledger Transaction DDL

    CREATE TYPE credit.ledger_transaction_type AS ENUM (
        'CREDIT_PURCHASE',
        'CREDIT_CONSUMPTION',
        'CREDIT_RESERVATION',
        'CREDIT_RELEASE',
        'CREDIT_REFUND',
        'CREDIT_ADJUSTMENT',
        'CREDIT_EXPIRATION',
        'PROMOTIONAL_CREDIT'
    );

    CREATE TYPE credit.ledger_transaction_status AS ENUM (
        'DRAFT',
        'POSTED',
        'VOIDED'
    );

    CREATE TABLE credit.ledger_transactions (
        ledger_transaction_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        credit_type_id UUID NOT NULL,
        transaction_type credit.ledger_transaction_type NOT NULL,
        status credit.ledger_transaction_status
            NOT NULL DEFAULT 'DRAFT',
        reference_type VARCHAR(64) NULL,
        reference_id UUID NULL,
        idempotency_key VARCHAR(255) NOT NULL,
        description VARCHAR(2000) NULL,
        posted_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT ledger_transactions_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_transactions_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_transactions_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_transactions_idempotency_unique
            UNIQUE (organization_id, idempotency_key),
        CONSTRAINT ledger_transactions_posted_check
            CHECK (
                status <> 'POSTED'
                OR posted_at IS NOT NULL
            ),
        CONSTRAINT ledger_transactions_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 36. Ledger Transaction Indexes

    CREATE INDEX ledger_transactions_org_time_idx
        ON credit.ledger_transactions(
            organization_id,
            created_at
        );

    CREATE INDEX ledger_transactions_reference_idx
        ON credit.ledger_transactions(
            reference_type,
            reference_id
        );

    CREATE INDEX ledger_transactions_type_time_idx
        ON credit.ledger_transactions(
            transaction_type,
            created_at
        );

# 37. Ledger Entries

Ledger Entries are the debit/credit lines belonging to a Ledger Transaction.

Every posted transaction must contain at least two entries.

The total debit amount must equal total credit amount.

# 38. `credit.ledger_entries` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| ledger_entry_id | uuid | No | UUIDv7 | Entry ID |
| ledger_transaction_id | uuid | No | None | Journal transaction |
| ledger_account_id | uuid | No | None | Account |
| entry_side | ledger_entry_side | No | None | Debit/Credit |
| amount | numeric(20,6) | No | None | Absolute amount |
| entry_sequence | integer | No | None | Deterministic order |
| created_at | timestamptz | No | `now()` | Creation |
| metadata | jsonb | No | `'{}'` | Evidence |

# 39. Ledger Entry DDL

    CREATE TYPE credit.ledger_entry_side AS ENUM (
        'DEBIT',
        'CREDIT'
    );

    CREATE TABLE credit.ledger_entries (
        ledger_entry_id UUID PRIMARY KEY,
        ledger_transaction_id UUID NOT NULL,
        ledger_account_id UUID NOT NULL,
        entry_side credit.ledger_entry_side NOT NULL,
        amount NUMERIC(20,6) NOT NULL,
        entry_sequence INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT ledger_entries_transaction_fk
            FOREIGN KEY (ledger_transaction_id)
            REFERENCES credit.ledger_transactions(ledger_transaction_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_entries_account_fk
            FOREIGN KEY (ledger_account_id)
            REFERENCES credit.ledger_accounts(ledger_account_id)
            ON DELETE RESTRICT,
        CONSTRAINT ledger_entries_sequence_unique
            UNIQUE (
                ledger_transaction_id,
                entry_sequence
            ),
        CONSTRAINT ledger_entries_amount_check
            CHECK (amount > 0),
        CONSTRAINT ledger_entries_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 40. Ledger Entry Indexes

    CREATE INDEX ledger_entries_transaction_idx
        ON credit.ledger_entries(ledger_transaction_id);

    CREATE INDEX ledger_entries_account_time_idx
        ON credit.ledger_entries(ledger_account_id, created_at);

# 41. Double-Entry Invariant

The database must not permit a transaction to become `POSTED` unless:

    SUM(DEBIT entries)
        =
    SUM(CREDIT entries)

and:

    SUM(DEBIT entries) > 0

and:

    COUNT(entries) >= 2

The cross-row equality is enforced through the posting service and must be
covered by transactional tests.

A PostgreSQL constraint trigger may be used where appropriate.

# 42. Purchase Accounting

For purchased credits:

    Customer Payment / Clearing
              |
              | debit
              v
        Clearing Account
              |
              | credit
              v
       Credit Liability

The customer wallet receives the credit entitlement through the wallet
accounting projection.

# 43. Consumption Accounting

For credit consumption:

    Customer Wallet
          |
          | credit
          v
      Revenue / Usage Account
          |
          | debit
          v

The exact debit/credit orientation is determined by the adopted accounting
chart of accounts, but the transaction must remain balanced.

# 44. Reservation Accounting

A reservation is normally an authorization hold, not final consumption.

The recommended model is:

    Wallet Available
          |
          v
    Reserved Balance

Reservation creation must not permanently consume credits.

The ledger may record a reservation event or use a reservation-control account
according to the final accounting policy.

# 45. Wallet Balance Model

The wallet maintains:

    available_balance
    reserved_balance

Invariant:

    available_balance >= 0
    reserved_balance >= 0

A reservation moves credits:

    available -> reserved

Consumption moves:

    reserved -> consumed

Release moves:

    reserved -> available

# 46. Credit Reservations

Reservations protect credits before a Job starts.

Examples:

- Booking reservation;
- Job reservation;
- execution preauthorization.

# 47. `credit.reservations` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| reservation_id | uuid | No | UUIDv7 | Reservation ID |
| organization_id | uuid | No | None | Tenant |
| wallet_id | uuid | No | None | Wallet |
| credit_type_id | uuid | No | None | Credit Type |
| booking_id | uuid | Yes | NULL | Booking |
| job_id | uuid | Yes | NULL | Job |
| reserved_amount | numeric(20,6) | No | None | Reserved credits |
| consumed_amount | numeric(20,6) | No | `0` | Consumed |
| released_amount | numeric(20,6) | No | `0` | Released |
| status | reservation_status | No | `ACTIVE` | State |
| expires_at | timestamptz | No | None | Reservation expiry |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| metadata | jsonb | No | `'{}'` | Evidence |

# 48. Reservation DDL

    CREATE TYPE credit.reservation_status AS ENUM (
        'ACTIVE',
        'PARTIALLY_CONSUMED',
        'CONSUMED',
        'RELEASED',
        'EXPIRED',
        'CANCELLED'
    );

    CREATE TABLE credit.reservations (
        reservation_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        wallet_id UUID NOT NULL,
        credit_type_id UUID NOT NULL,
        booking_id UUID NULL,
        job_id UUID NULL,
        reserved_amount NUMERIC(20,6) NOT NULL,
        consumed_amount NUMERIC(20,6) NOT NULL DEFAULT 0,
        released_amount NUMERIC(20,6) NOT NULL DEFAULT 0,
        status credit.reservation_status
            NOT NULL DEFAULT 'ACTIVE',
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT reservations_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT reservations_wallet_fk
            FOREIGN KEY (wallet_id)
            REFERENCES credit.wallets(wallet_id)
            ON DELETE RESTRICT,
        CONSTRAINT reservations_credit_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT reservations_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT reservations_amount_check
            CHECK (
                reserved_amount > 0
                AND consumed_amount >= 0
                AND released_amount >= 0
                AND consumed_amount + released_amount
                    <= reserved_amount
            ),
        CONSTRAINT reservations_reference_check
            CHECK (
                booking_id IS NOT NULL
                OR job_id IS NOT NULL
            ),
        CONSTRAINT reservations_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 49. Reservation Indexes

    CREATE INDEX reservations_wallet_status_idx
        ON credit.reservations(wallet_id, status);

    CREATE INDEX reservations_booking_idx
        ON credit.reservations(booking_id);

    CREATE INDEX reservations_job_idx
        ON credit.reservations(job_id);

    CREATE INDEX reservations_expiry_idx
        ON credit.reservations(status, expires_at);

# 50. Reservation State Machine

    ACTIVE
       |
       +----> PARTIALLY_CONSUMED
       |            |
       |            +----> CONSUMED
       |            |
       |            +----> RELEASED
       |
       +----> CONSUMED
       |
       +----> RELEASED
       |
       +----> EXPIRED
       |
       +----> CANCELLED

# 51. Reservation Concurrency

Reservation creation must lock the Wallet row:

    SELECT wallet
    FOR UPDATE

Then verify:

    available_balance >= requested_amount

Then atomically:

    available_balance -= amount
    reserved_balance += amount

This prevents double spending under concurrent requests.

# 52. Credit Consumption

Consumption is the final charge against a reservation or directly against
available credits where reservation is not required.

# 53. `credit.consumptions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| consumption_id | uuid | No | UUIDv7 | Consumption ID |
| organization_id | uuid | No | None | Tenant |
| wallet_id | uuid | No | None | Wallet |
| credit_type_id | uuid | No | None | Credit Type |
| reservation_id | uuid | Yes | NULL | Reservation |
| booking_id | uuid | Yes | NULL | Booking |
| job_id | uuid | Yes | NULL | Job |
| platform_id | uuid | No | None | Platform |
| platform_version_id | uuid | Yes | NULL | Platform Version |
| credit_rate_id | uuid | No | None | Rate |
| units | numeric(20,6) | No | None | Billable units |
| unit_rate | numeric(20,6) | No | None | Rate snapshot |
| amount | numeric(20,6) | No | None | Credits consumed |
| status | consumption_status | No | `PENDING` | State |
| occurred_at | timestamptz | No | None | Usage time |
| created_at | timestamptz | No | `now()` | Creation |
| created_by | uuid | No | None | Actor |
| metadata | jsonb | No | `'{}'` | Evidence |

# 54. Consumption DDL

    CREATE TYPE credit.consumption_status AS ENUM (
        'PENDING',
        'POSTED',
        'REVERSED'
    );

    CREATE TABLE credit.consumptions (
        consumption_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        wallet_id UUID NOT NULL,
        credit_type_id UUID NOT NULL,
        reservation_id UUID NULL,
        booking_id UUID NULL,
        job_id UUID NULL,
        platform_id UUID NOT NULL,
        platform_version_id UUID NULL,
        credit_rate_id UUID NOT NULL,
        units NUMERIC(20,6) NOT NULL,
        unit_rate NUMERIC(20,6) NOT NULL,
        amount NUMERIC(20,6) NOT NULL,
        status credit.consumption_status
            NOT NULL DEFAULT 'PENDING',
        occurred_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT consumptions_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_wallet_fk
            FOREIGN KEY (wallet_id)
            REFERENCES credit.wallets(wallet_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_reservation_fk
            FOREIGN KEY (reservation_id)
            REFERENCES credit.reservations(reservation_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_rate_fk
            FOREIGN KEY (credit_rate_id)
            REFERENCES credit.credit_rates(credit_rate_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT consumptions_units_check
            CHECK (units > 0),
        CONSTRAINT consumptions_rate_check
            CHECK (unit_rate > 0),
        CONSTRAINT consumptions_amount_check
            CHECK (amount > 0),
        CONSTRAINT consumptions_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 55. Consumption Indexes

    CREATE INDEX consumptions_wallet_time_idx
        ON credit.consumptions(wallet_id, occurred_at);

    CREATE INDEX consumptions_job_idx
        ON credit.consumptions(job_id);

    CREATE INDEX consumptions_booking_idx
        ON credit.consumptions(booking_id);

    CREATE INDEX consumptions_platform_time_idx
        ON credit.consumptions(platform_id, occurred_at);

# 56. Consumption Formula

The consumption amount must be calculated from the pricing snapshot.

Conceptually:

    billable_units
        =
    apply_rounding(actual_units)

    credit_amount
        =
    billable_units × unit_rate

The final stored `amount` must equal the result used for the ledger posting.

# 57. Refunds

Refunds reverse a previously posted consumption or purchase according to
policy.

A refund must reference its source transaction.

Refunds cannot exceed the refundable amount.

# 58. `credit.refunds` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| refund_id | uuid | No | UUIDv7 | Refund ID |
| organization_id | uuid | No | None | Tenant |
| wallet_id | uuid | No | None | Wallet |
| credit_type_id | uuid | No | None | Credit Type |
| consumption_id | uuid | Yes | NULL | Consumption source |
| ledger_transaction_id | uuid | Yes | NULL | Source ledger transaction |
| amount | numeric(20,6) | No | None | Refund credits |
| reason_code | varchar(64) | No | None | Reason |
| reason | varchar(2000) | Yes | NULL | Explanation |
| status | refund_status | No | `REQUESTED` | State |
| requested_at | timestamptz | No | `now()` | Request |
| approved_at | timestamptz | Yes | NULL | Approval |
| posted_at | timestamptz | Yes | NULL | Posting |
| created_at | timestamptz | No | `now()` | Creation |
| created_by | uuid | No | None | Actor |
| approved_by | uuid | Yes | NULL | Approver |
| metadata | jsonb | No | `'{}'` | Evidence |

# 59. Refund DDL

    CREATE TYPE credit.refund_status AS ENUM (
        'REQUESTED',
        'APPROVED',
        'POSTED',
        'REJECTED',
        'CANCELLED'
    );

    CREATE TABLE credit.refunds (
        refund_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        wallet_id UUID NOT NULL,
        credit_type_id UUID NOT NULL,
        consumption_id UUID NULL,
        ledger_transaction_id UUID NULL,
        amount NUMERIC(20,6) NOT NULL,
        reason_code VARCHAR(64) NOT NULL,
        reason VARCHAR(2000) NULL,
        status credit.refund_status
            NOT NULL DEFAULT 'REQUESTED',
        requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        approved_at TIMESTAMPTZ NULL,
        posted_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        approved_by UUID NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT refunds_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT refunds_wallet_fk
            FOREIGN KEY (wallet_id)
            REFERENCES credit.wallets(wallet_id)
            ON DELETE RESTRICT,
        CONSTRAINT refunds_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT refunds_consumption_fk
            FOREIGN KEY (consumption_id)
            REFERENCES credit.consumptions(consumption_id)
            ON DELETE RESTRICT,
        CONSTRAINT refunds_transaction_fk
            FOREIGN KEY (ledger_transaction_id)
            REFERENCES credit.ledger_transactions(ledger_transaction_id)
            ON DELETE RESTRICT,
        CONSTRAINT refunds_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT refunds_approver_fk
            FOREIGN KEY (approved_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT refunds_amount_check
            CHECK (amount > 0)
    );

# 60. Refund Indexes

    CREATE INDEX refunds_wallet_time_idx
        ON credit.refunds(wallet_id, requested_at);

    CREATE INDEX refunds_consumption_idx
        ON credit.refunds(consumption_id);

    CREATE INDEX refunds_status_idx
        ON credit.refunds(status);

# 61. Invoices

Invoices represent commercial charges associated with purchasing credits or
other RaaS commercial items.

For the initial implementation, credit purchases are the primary invoice
integration.

Invoices remain linked to Organizations.

# 62. `credit.invoices` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| invoice_id | uuid | No | UUIDv7 | Invoice ID |
| organization_id | uuid | No | None | Tenant |
| invoice_number | varchar(64) | No | None | Human-readable number |
| status | invoice_status | No | `DRAFT` | Lifecycle |
| currency | char(3) | No | None | Currency |
| subtotal_minor | bigint | No | `0` | Subtotal |
| tax_minor | bigint | No | `0` | Tax |
| total_minor | bigint | No | `0` | Total |
| issued_at | timestamptz | Yes | NULL | Issue time |
| due_at | timestamptz | Yes | NULL | Due time |
| paid_at | timestamptz | Yes | NULL | Paid time |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| metadata | jsonb | No | `'{}'` | Evidence |

# 63. Invoice DDL

    CREATE TYPE credit.invoice_status AS ENUM (
        'DRAFT',
        'ISSUED',
        'PARTIALLY_PAID',
        'PAID',
        'VOID',
        'OVERDUE'
    );

    CREATE TABLE credit.invoices (
        invoice_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        invoice_number VARCHAR(64) NOT NULL,
        status credit.invoice_status
            NOT NULL DEFAULT 'DRAFT',
        currency CHAR(3) NOT NULL,
        subtotal_minor BIGINT NOT NULL DEFAULT 0,
        tax_minor BIGINT NOT NULL DEFAULT 0,
        total_minor BIGINT NOT NULL DEFAULT 0,
        issued_at TIMESTAMPTZ NULL,
        due_at TIMESTAMPTZ NULL,
        paid_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT invoices_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT invoices_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT invoices_number_unique
            UNIQUE (invoice_number),
        CONSTRAINT invoices_amount_check
            CHECK (
                subtotal_minor >= 0
                AND tax_minor >= 0
                AND total_minor >= 0
            ),
        CONSTRAINT invoices_total_check
            CHECK (total_minor = subtotal_minor + tax_minor)
    );

# 64. Invoice Indexes

    CREATE INDEX invoices_org_time_idx
        ON credit.invoices(organization_id, created_at);

    CREATE INDEX invoices_status_due_idx
        ON credit.invoices(status, due_at);

# 65. Invoice Lines

Invoices require line-level pricing evidence.

# 66. `credit.invoice_lines` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| invoice_line_id | uuid | No | UUIDv7 | Line ID |
| invoice_id | uuid | No | None | Invoice |
| credit_plan_id | uuid | Yes | NULL | Credit Plan |
| credit_type_id | uuid | Yes | NULL | Credit Type |
| description | varchar(1000) | No | None | Line description |
| quantity | numeric(20,6) | No | None | Quantity |
| unit_price_minor | bigint | No | None | Unit price |
| subtotal_minor | bigint | No | None | Line subtotal |
| tax_minor | bigint | No | `0` | Tax |
| total_minor | bigint | No | None | Line total |
| created_at | timestamptz | No | `now()` | Creation |
| metadata | jsonb | No | `'{}'` | Evidence |

# 67. Invoice Line DDL

    CREATE TABLE credit.invoice_lines (
        invoice_line_id UUID PRIMARY KEY,
        invoice_id UUID NOT NULL,
        credit_plan_id UUID NULL,
        credit_type_id UUID NULL,
        description VARCHAR(1000) NOT NULL,
        quantity NUMERIC(20,6) NOT NULL,
        unit_price_minor BIGINT NOT NULL,
        subtotal_minor BIGINT NOT NULL,
        tax_minor BIGINT NOT NULL DEFAULT 0,
        total_minor BIGINT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT invoice_lines_invoice_fk
            FOREIGN KEY (invoice_id)
            REFERENCES credit.invoices(invoice_id)
            ON DELETE RESTRICT,
        CONSTRAINT invoice_lines_plan_fk
            FOREIGN KEY (credit_plan_id)
            REFERENCES credit.credit_plans(credit_plan_id)
            ON DELETE RESTRICT,
        CONSTRAINT invoice_lines_type_fk
            FOREIGN KEY (credit_type_id)
            REFERENCES credit.credit_types(credit_type_id)
            ON DELETE RESTRICT,
        CONSTRAINT invoice_lines_quantity_check
            CHECK (quantity > 0),
        CONSTRAINT invoice_lines_price_check
            CHECK (unit_price_minor >= 0),
        CONSTRAINT invoice_lines_subtotal_check
            CHECK (subtotal_minor >= 0),
        CONSTRAINT invoice_lines_tax_check
            CHECK (tax_minor >= 0),
        CONSTRAINT invoice_lines_total_check
            CHECK (total_minor = subtotal_minor + tax_minor)
    );

# 68. Invoice Line Index

    CREATE INDEX invoice_lines_invoice_idx
        ON credit.invoice_lines(invoice_id);

# 69. Payment Transactions

Payment Transactions represent interaction with an external payment system.

They do not themselves determine wallet balances.

A successful payment must be reconciled into a credit ledger transaction.

# 70. `credit.payment_transactions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| payment_transaction_id | uuid | No | UUIDv7 | Payment ID |
| organization_id | uuid | No | None | Tenant |
| invoice_id | uuid | Yes | NULL | Invoice |
| provider | varchar(64) | No | None | Provider abstraction |
| provider_transaction_id | varchar(255) | Yes | NULL | External ID |
| transaction_type | payment_transaction_type | No | None | Operation |
| status | payment_transaction_status | No | `INITIATED` | State |
| currency | char(3) | No | None | Currency |
| amount_minor | bigint | No | None | Amount |
| idempotency_key | varchar(255) | No | None | Retry key |
| failure_code | varchar(128) | Yes | NULL | Failure |
| failure_message | varchar(2000) | Yes | NULL | Failure |
| processed_at | timestamptz | Yes | NULL | Processing |
| created_at | timestamptz | No | `now()` | Creation |
| metadata | jsonb | No | `'{}'` | Evidence |

# 71. Payment Enums

    CREATE TYPE credit.payment_transaction_type AS ENUM (
        'AUTHORIZE',
        'CAPTURE',
        'REFUND',
        'VOID'
    );

    CREATE TYPE credit.payment_transaction_status AS ENUM (
        'INITIATED',
        'PENDING',
        'SUCCEEDED',
        'FAILED',
        'CANCELLED'
    );

# 72. Payment Transaction DDL

    CREATE TABLE credit.payment_transactions (
        payment_transaction_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        invoice_id UUID NULL,
        provider VARCHAR(64) NOT NULL,
        provider_transaction_id VARCHAR(255) NULL,
        transaction_type credit.payment_transaction_type NOT NULL,
        status credit.payment_transaction_status
            NOT NULL DEFAULT 'INITIATED',
        currency CHAR(3) NOT NULL,
        amount_minor BIGINT NOT NULL,
        idempotency_key VARCHAR(255) NOT NULL,
        failure_code VARCHAR(128) NULL,
        failure_message VARCHAR(2000) NULL,
        processed_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT payment_transactions_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT payment_transactions_invoice_fk
            FOREIGN KEY (invoice_id)
            REFERENCES credit.invoices(invoice_id)
            ON DELETE RESTRICT,
        CONSTRAINT payment_transactions_idempotency_unique
            UNIQUE (organization_id, idempotency_key),
        CONSTRAINT payment_transactions_amount_check
            CHECK (amount_minor > 0),
        CONSTRAINT payment_transactions_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 73. Payment Indexes

    CREATE INDEX payment_transactions_invoice_idx
        ON credit.payment_transactions(invoice_id);

    CREATE INDEX payment_transactions_provider_idx
        ON credit.payment_transactions(
            provider,
            provider_transaction_id
        );

    CREATE INDEX payment_transactions_status_idx
        ON credit.payment_transactions(status, created_at);

# 74. Purchase-to-Credit Flow

    Customer
       |
       v
    Invoice
       |
       v
    Payment Transaction
       |
       v
    Payment Success
       |
       v
    Credit Purchase Ledger Transaction
       |
       v
    Wallet Credit
       |
       v
    Available Balance

Payment success alone does not modify the wallet.

# 75. Credit Purchase Accounting

A successful credit purchase creates:

    Ledger Transaction
        type = CREDIT_PURCHASE
        status = POSTED

with balanced entries.

The transaction references:

    payment_transaction_id
    invoice_id
    credit_plan_id
    wallet_id

through metadata or explicit reference fields as appropriate.

# 76. Promotional Credits

Promotional credits do not require a payment transaction.

They are posted using:

    PROMOTIONAL_CREDIT

The source must be auditable.

Examples:

- student grant;
- research grant;
- launch promotion;
- support compensation.

# 77. Administrative Adjustments

Adjustments are exceptional.

They require:

- actor;
- reason code;
- reason;
- approval policy where required;
- ledger transaction;
- audit record.

No direct balance update is permitted.

# 78. Balance Authority

The ledger is the accounting source.

Wallet balances are materialized operational projections.

Therefore:

    Ledger
       |
       v
    Wallet Projection

A wallet balance mismatch is resolved through reconciliation, not arbitrary
manual balance editing.

# 79. Balance Update Rule

A wallet balance update must occur in the same database transaction as the
corresponding ledger posting.

For example:

    BEGIN

    lock wallet

    validate balance

    insert ledger transaction

    insert ledger entries

    update wallet projection

    COMMIT

# 80. Reservation Transaction

Reservation requires:

    BEGIN
      SELECT wallet FOR UPDATE;

      verify available_balance >= amount;

      UPDATE wallet
      SET available_balance = available_balance - amount,
          reserved_balance = reserved_balance + amount;

      INSERT reservation;

      COMMIT

No application-level read-modify-write operation may replace this transaction.

# 81. Consumption Transaction

Consumption requires:

    BEGIN
      lock wallet;
      lock reservation;

      verify reservation is usable;

      calculate final amount;

      update reservation;

      update wallet;

      post ledger transaction;

      insert consumption;

    COMMIT

# 82. Release Transaction

Release returns unused reservation credits:

    reserved_balance -= release_amount
    available_balance += release_amount

The operation must be idempotent.

# 83. Refund Transaction

Refund requires:

1. identify refundable source;
2. lock source;
3. calculate remaining refundable amount;
4. verify requested amount;
5. create refund;
6. post balanced ledger transaction;
7. update wallet;
8. commit.

# 84. Double-Spend Protection

The following operations require row locking or equivalent concurrency control:

- wallet reservation;
- wallet consumption;
- wallet release;
- refund;
- expiration;
- administrative adjustment.

Optimistic concurrency may be used only where equivalent correctness is
demonstrated.

# 85. Negative Balance

Negative balances are prohibited for customer wallets unless a future explicit
credit facility is introduced.

Therefore:

    available_balance >= 0

is a hard invariant.

# 86. Credit Expiration

Credits may expire according to:

- plan validity;
- promotional validity;
- policy;
- wallet expiration.

Expiration must be ledger-backed.

Example:

    Wallet
       |
    unused credits
       |
    expiration policy
       |
       v
    CREDIT_EXPIRATION
       |
       v
    expired balance

# 87. Expiration Ordering

If credits have different expiry dates, consumption should use an explicit
policy such as:

    earliest_expiry_first

The policy must be deterministic and documented.

# 88. Wallet Expiration

Wallet expiration is distinct from credit-entry expiration.

A wallet may remain operational while individual credit grants expire.

The final implementation should prefer grant-level expiration if multiple
expiration dates are commercially required.

# 89. Future Credit Grant Model

If per-purchase expiration becomes required, a future:

    credit.credit_grants

table may track individual credit lots.

Until then, wallet-level expiry remains the minimum schema.

# 90. Booking Relationship

Booking owns reservation intent.

Credit owns the financial reservation.

The relationship is:

    Booking
       |
       v
    Credit Reservation
       |
       v
    Wallet

A Booking must not directly modify a wallet.

# 91. Job Relationship

A Job may consume credits.

The relationship is:

    Job
       |
       v
    Consumption
       |
       v
    Wallet
       |
       v
    Ledger

The Job domain owns execution state.

The Credit domain owns financial state.

# 92. Platform Relationship

The Credit domain references:

    Platform
    Platform Version
    Platform Configuration

Pricing remains tied to the Platform model.

# 93. Project Relationship

Project context may be retained in reservation/consumption metadata or explicit
future fields where reporting requires it.

Project ownership remains in the Project domain.

# 94. Tenant Isolation

Every customer financial record must carry:

    organization_id

where practical.

Required direct tenant ownership includes:

- wallets;
- ledger transactions;
- reservations;
- consumptions;
- refunds;
- invoices;
- payment transactions.

System ledger accounts may have no Organization.

# 95. Cross-Tenant Protection

The application must reject:

    Wallet(org-A)
        +
    Booking(org-B)

and:

    Reservation(org-A)
        +
    Job(org-B)

Composite tenant-aware foreign keys should be used where parent schemas support
them.

# 96. Audit Columns

Financial tables must include appropriate:

    created_at
    updated_at
    created_by
    updated_by

Immutable ledger tables do not permit ordinary updates to posted records.

# 97. Ledger Immutability

Posted ledger transactions and entries must not be updated or deleted.

Corrections are represented by new transactions.

Example:

    Incorrect Transaction
           |
           v
       REVERSAL
           |
           v
      CORRECT ENTRY

# 98. Void Policy

A `VOIDED` ledger transaction must retain its original evidence.

A reversal transaction should normally be preferred to destructive deletion.

# 99. Audit Events

The Audit domain should capture:

    credit.type.created
    credit.plan.created
    credit.rate.created
    credit.wallet.created

    credit.purchase.posted
    credit.reservation.created
    credit.reservation.released
    credit.consumption.posted
    credit.refund.requested
    credit.refund.approved
    credit.refund.posted
    credit.adjustment.posted
    credit.expired

    invoice.issued
    invoice.voided
    payment.succeeded
    payment.failed

# 100. Example Credit Type

    credit_type_id:
      0194c7d0-8b00-7abc-9def-700000000001

    platform_id:
      0194c7d0-8b00-7abc-9def-500000000001

    code:
      HUMANOID_A_CREDIT

    name:
      Humanoid A Credits

    status:
      ACTIVE

# 101. Example Credit Plan

    credit_plan_id:
      0194c7d0-8b00-7abc-9def-700000000002

    credit_type_id:
      0194c7d0-8b00-7abc-9def-700000000001

    code:
      HUMANOID_A_RESEARCH_5000

    included_credits:
      5000

    status:
      ACTIVE

# 102. Example Rate

    rate_code:
      HUMANOID_A_STANDARD_MINUTE

    credits_per_unit:
      15

    billing_unit:
      MINUTE

    rounding_mode:
      CEIL

    status:
      ACTIVE

# 103. Example Wallet

    organization_id:
      0194c7d0-8b00-7abc-9def-200000000001

    credit_type_id:
      0194c7d0-8b00-7abc-9def-700000000001

    available_balance:
      4550

    reserved_balance:
      450

    lifetime_credited:
      10000

    lifetime_consumed:
      5000

# 104. Example Reservation

    reservation_id:
      0194c7d0-8b00-7abc-9def-700000000010

    reserved_amount:
      450

    consumed_amount:
      0

    released_amount:
      0

    status:
      ACTIVE

# 105. Example Consumption

    consumption_id:
      0194c7d0-8b00-7abc-9def-700000000011

    units:
      30

    unit_rate:
      15

    amount:
      450

    status:
      POSTED

# 106. Example Refund

    refund_id:
      0194c7d0-8b00-7abc-9def-700000000012

    amount:
      150

    reason_code:
      ROBOT_FAULT

    status:
      POSTED

# 107. Example Ledger Transaction

    ledger_transaction_id:
      0194c7d0-8b00-7abc-9def-700000000020

    transaction_type:
      CREDIT_CONSUMPTION

    status:
      POSTED

    reference_type:
      consumption

    reference_id:
      0194c7d0-8b00-7abc-9def-700000000011

# 108. Example Ledger Entries

    Entry 1:
      side = DEBIT
      amount = 450
      account = REVENUE

    Entry 2:
      side = CREDIT
      amount = 450
      account = CUSTOMER_WALLET

    Balanced:

      total debit  = 450
      total credit = 450

# 109. Example Invoice

    invoice_number:
      KRAAS-2026-000123

    currency:
      INR

    subtotal_minor:
      100000

    tax_minor:
      18000

    total_minor:
      118000

# 110. Example Payment

    provider:
      provider-neutral

    transaction_type:
      CAPTURE

    status:
      SUCCEEDED

    amount_minor:
      118000

# 111. Credit Domain Relationship Diagram

    Organization
          |
          +-------------------+
          |                   |
          v                   v
       Wallets             Invoices
          |                   |
          |                   v
          |              Payments
          |
          v
    Ledger Accounts
          |
          v
    Ledger Transactions
          |
          v
     Ledger Entries
          |
          +------------------+
          |                  |
          v                  v
    Reservations        Consumptions
          |                  |
          +--------+---------+
                   |
                   v
                Refunds

# 112. Platform Pricing Diagram

    Platform
       |
       v
    Credit Type
       |
       +--> Credit Plan
       |
       +--> Credit Rate
               |
               +--> Configuration
               +--> Duration
               +--> Units
               |
               v
          Credit Amount

# 113. Execution Charging Diagram

    Booking
       |
       v
    Rate Lookup
       |
       v
    Credit Reservation
       |
       v
    Job
       |
       v
    Actual Usage
       |
       v
    Consumption
       |
       v
    Ledger
       |
       v
    Wallet

# 114. Repository Interfaces

Recommended repositories:

    CreditTypeRepository
    CreditPlanRepository
    CreditRateRepository
    WalletRepository
    LedgerAccountRepository
    LedgerTransactionRepository
    LedgerEntryRepository
    ReservationRepository
    ConsumptionRepository
    RefundRepository
    InvoiceRepository
    InvoiceLineRepository
    PaymentTransactionRepository

# 115. Credit Type Repository

Operations:

    create
    get_by_id
    get_by_platform
    get_active
    transition_status
    list

# 116. Plan Repository

Operations:

    create
    get_by_id
    get_active_plan
    list_by_credit_type
    transition_status

Historical plan definitions must remain resolvable.

# 117. Rate Repository

Operations:

    create
    get_active_rate
    get_rate_at
    list_by_platform
    list_by_configuration
    retire

Rate lookup must accept an effective timestamp.

# 118. Wallet Repository

Operations:

    create
    get
    get_for_update
    get_by_organization_and_type
    update_projection
    close

`get_for_update` is required for critical balance operations.

# 119. Ledger Repository

Operations:

    create_transaction
    add_entry
    post_transaction
    reverse_transaction
    get_transaction
    list_account_entries

Posting must be atomic.

# 120. Reservation Repository

Operations:

    create
    get_for_update
    consume
    release
    expire
    cancel

# 121. Consumption Repository

Operations:

    create_pending
    post
    reverse
    get_by_job
    get_by_booking
    list_by_wallet

# 122. Refund Repository

Operations:

    request
    approve
    reject
    post
    cancel
    get
    list

# 123. Invoice Repository

Operations:

    create
    issue
    mark_paid
    mark_overdue
    void
    get
    list_by_organization

# 124. Payment Repository

Operations:

    create
    update_provider_reference
    mark_pending
    mark_succeeded
    mark_failed
    reconcile

Provider-specific adapters must remain outside the Credit domain core.

# 125. Application Services

Recommended services:

    CreditCatalogService
    CreditPlanService
    CreditPricingService
    WalletService
    CreditReservationService
    CreditConsumptionService
    CreditRefundService
    CreditAdjustmentService
    CreditLedgerService
    InvoiceService
    PaymentService
    CreditReconciliationService

# 126. Pricing Service

The Pricing Service receives:

    platform_id
    platform_version_id
    configuration_id
    requested_duration
    requested_units
    timestamp

and returns:

    credit_type_id
    rate_id
    unit_rate
    billable_units
    calculated_amount
    pricing_snapshot

# 127. Pricing Determinism

The same pricing inputs and effective timestamp must produce the same result
for an unchanged pricing configuration.

Pricing must never depend on the current wall-clock rate after a transaction
has been posted.

# 128. Reservation Service

The Reservation Service:

1. resolves wallet;
2. resolves rate;
3. calculates required credits;
4. locks wallet;
5. verifies balance;
6. creates reservation;
7. moves available to reserved;
8. records evidence;
9. commits.

# 129. Consumption Service

The Consumption Service:

1. identifies reservation;
2. determines actual usage;
3. applies pricing snapshot;
4. calculates final cost;
5. locks wallet and reservation;
6. posts ledger;
7. updates wallet;
8. records consumption;
9. releases unused reservation;
10. commits.

# 130. Partial Consumption

If:

    reserved = 450
    actual = 300

then:

    consumed = 300
    released = 150

Wallet movement:

    reserved -= 450
    consumed  = 300
    available += 150

# 131. Over-Consumption

If actual usage exceeds the reservation:

    reserved = 450
    actual   = 600

The system must follow an explicit policy:

- reject;
- extend reservation if balance permits;
- consume available credits;
- stop execution;
- administrative handling.

The policy is an open commercial decision.

# 132. Refund Policy

Refunds should be based on explicit reason codes.

Recommended:

    ROBOT_FAULT
    SERVICE_FAILURE
    BOOKING_CANCELLED
    DUPLICATE_CHARGE
    ADMINISTRATIVE
    CUSTOMER_SUPPORT
    POLICY_EXCEPTION

# 133. Refund Safety

A refund cannot exceed:

    refundable_source_amount
      -
    already_refunded_amount

The check must occur transactionally.

# 134. Invoice Relationship

The relationship is:

    Organization
       |
       v
    Invoice
       |
       +--> Invoice Lines
       |
       +--> Payment Transactions
       |
       +--> Credit Purchase Ledger Transaction

# 135. Credit Purchase Relationship

    Credit Plan
         |
         v
    Invoice Line
         |
         v
      Invoice
         |
         v
      Payment
         |
         v
    Credit Purchase
         |
         v
       Wallet

# 136. Subscription Relationship

Subscription determines access.

Credit Plan determines credit allocation/pricing.

Therefore:

    Subscription
         |
         +--> Access Entitlement

    Credit Plan
         |
         +--> Credit Entitlement

The two should not be conflated into one table.

# 137. Data Retention

| Data | Retention |
|---|---|
| Credit Types | Long-term |
| Credit Plans | Long-term |
| Rates | Long-term |
| Wallets | Long-term |
| Ledger Transactions | Long-term |
| Ledger Entries | Long-term |
| Reservations | Long-term / policy |
| Consumption | Long-term |
| Refunds | Long-term |
| Invoices | Financial retention |
| Invoice Lines | Financial retention |
| Payments | Financial retention |
| Operational metadata | Policy-based |

Financial records must not be physically deleted merely because a customer
deletes a Project.

# 138. Privacy and Deletion

Credit records are financial/business records.

Therefore:

- customer account deletion does not imply ledger deletion;
- immutable financial evidence is retained;
- personally identifying actor references may be anonymized according to
  applicable policy;
- Organization-level export must preserve financial relationships.

# 139. Audit Retention

Audit records related to:

- purchases;
- refunds;
- adjustments;
- wallet changes;
- administrative actions

must follow the longer applicable financial or audit retention policy.

# 140. Reconciliation

The reconciliation process compares:

    Ledger
       |
       v
    Wallet Projection

and:

    Invoice
       |
       v
    Payment
       |
       v
    Credit Purchase

and:

    Reservation
       |
       v
    Consumption
       |
       v
    Refund

# 141. Reconciliation Invariants

The following must hold:

    Wallet available >= 0

    Wallet reserved >= 0

    Consumption amount > 0

    Refund amount <= refundable source

    Posted transaction debits = credits

    Reservation consumed + released <= reserved

    Invoice total = subtotal + tax

    Successful payment has matching financial treatment

# 142. Reconciliation Failures

Failures must be recorded and surfaced.

Examples:

    WALLET_LEDGER_MISMATCH
    UNBALANCED_LEDGER
    PAYMENT_WITHOUT_CREDIT
    CREDIT_WITHOUT_PAYMENT
    RESERVATION_BALANCE_MISMATCH
    REFUND_OVERAGE
    MISSING_STORAGE_REFERENCE

Reconciliation must never silently modify financial history.

# 143. Idempotency

Required operations:

- purchase posting;
- payment reconciliation;
- wallet creation;
- reservation creation;
- reservation release;
- consumption posting;
- refund posting;
- adjustment posting;
- expiration.

The idempotency key must be scoped to the Organization where applicable.

# 144. Outbox Integration

Financial state changes requiring events must use the transactional outbox.

Example:

    BEGIN
      post ledger
      update wallet
      create outbox event
    COMMIT

This guarantees that a successful financial operation has durable event
evidence.

# 145. Database Isolation

Default PostgreSQL isolation:

    READ COMMITTED

Critical operations use:

    SELECT ... FOR UPDATE

Serializable isolation may be used selectively for particularly complex
financial operations if required by measured contention or correctness.

# 146. Database Constraints

Database constraints must enforce:

- positive monetary/credit amounts;
- valid lifecycle combinations;
- unique wallet;
- unique plan code;
- unique rate code;
- unique invoice number;
- unique idempotency key;
- valid invoice totals;
- valid reservation amounts;
- valid refund amounts.

Application services enforce cross-row financial invariants.

# 147. Performance

Primary query patterns include:

- wallet lookup by Organization + Credit Type;
- transaction history by Organization;
- consumption history by Job;
- reservations by Booking;
- rates by Platform + effective time;
- invoices by Organization;
- payments by provider reference.

Indexes must follow these access patterns.

# 148. Partitioning

No partitioning is required initially.

Potential future candidates:

- ledger transactions;
- ledger entries;
- consumption;
- payment transactions.

Partitioning must be introduced only after measured volume justifies it.

# 149. Phase 0 Mapping

Phase 0 establishes:

- Credit domain ownership;
- Organization tenancy;
- PostgreSQL authority;
- UUIDv7;
- ledger principles;
- provider-neutral payment boundary;
- retention policy.

# 150. Phase 1 Mapping

Phase 1 implements:

- Organization relationship;
- basic Credit Types;
- Wallet identity;
- tenant isolation;
- authorization.

# 151. Phase 2 Mapping

Phase 2 implements:

- Credit Types;
- Credit Plans;
- Credit Rates;
- Wallets;
- basic balance operations.

# 152. Phase 3 Mapping

Phase 3 implements:

- Ledger Accounts;
- Ledger Transactions;
- Ledger Entries;
- double-entry validation;
- idempotency;
- reconciliation.

# 153. Phase 4 Mapping

Phase 4 is the primary credit/booking phase:

- Reservations;
- Booking integration;
- pricing lookup;
- balance locking;
- reservation release;
- cancellation;
- expiration.

# 154. Phase 5 Mapping

Phase 5 integrates:

- Job consumption;
- actual usage charging;
- partial consumption;
- over-consumption policy;
- refund integration;
- remote execution billing.

# 155. Phase 6 Mapping

Phase 6 integrates:

- physical resource pricing;
- configuration-specific rates;
- robot/resource utilization;
- operational fault refunds;
- platform-specific commercial rules.

# 156. Phase 7 Mapping

Phase 7 implements:

- invoices;
- payment transactions;
- commercial reporting;
- result-to-consumption provenance;
- financial audit;
- customer usage reporting.

# 157. Phase 8 Mapping

Phase 8 completes:

- production payment integration;
- financial reconciliation;
- retention;
- privacy;
- backup/restore;
- capacity;
- security hardening;
- operational controls.

# 158. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Double spending | Critical | Row locking + transactional updates |
| Negative balance | Critical | DB checks + service validation |
| Unbalanced ledger | Critical | Posting transaction + validation |
| Duplicate purchase | Critical | Idempotency keys |
| Duplicate consumption | Critical | Idempotency + source references |
| Incorrect pricing | High | Effective-dated rates + snapshots |
| Rate mutation | Critical | Immutable historical pricing |
| Refund overpayment | Critical | Transactional refundable amount check |
| Payment without credits | High | Reconciliation |
| Credits without payment | High | Ledger/payment reconciliation |
| Cross-tenant wallet access | Critical | Organization constraints |
| Stale reservation | High | Expiration worker |
| Lost reservation | High | Transactional state transitions |
| Payment provider outage | High | Pending state + reconciliation |
| Wallet projection drift | Critical | Ledger reconciliation |
| Financial deletion | Critical | Append-oriented retention |
| Administrative abuse | High | Audit + approval controls |
| Expired credits used | High | Execution admission check |
| Platform rate mismatch | High | Pricing snapshot |
| Currency mismatch | High | Explicit currency |
| Ledger volume growth | Medium | Indexing + future partitioning |

# 159. Open Questions

1. Final commercial currency policy.
2. Whether one Organization may have multiple currencies.
3. Final tax model.
4. Final subscription-to-credit relationship.
5. Final credit expiration model.
6. Whether credit lots require a dedicated grant table.
7. Whether unused credits roll over.
8. Whether credits are refundable.
9. Final refund policy.
10. Final cancellation policy.
11. Final over-consumption policy.
12. Final reservation expiry.
13. Final pricing rounding rules.
14. Final configuration pricing model.
15. Final rate precedence rules.
16. Final promotional-credit policy.
17. Final student/research plan policy.
18. Final enterprise contract pricing.
19. Final payment provider.
20. Final payment settlement model.
21. Final invoice numbering policy.
22. Final tax jurisdiction model.
23. Final financial retention period.
24. Final accounting chart of accounts.
25. Final ledger debit/credit orientation.
26. Whether wallet balances are materialized or fully derived.
27. Final legal/accounting treatment of credits.
28. Whether credits expire individually or at wallet level.
29. Whether credit transfers will ever be supported.
30. Whether Organizations can merge.
31. Whether wallets can be migrated between Organizations.
32. Whether credit-type conversion will ever be supported.
33. Final reconciliation frequency.
34. Final financial reporting requirements.

# 160. Acceptance Criteria — Credit Types

- [ ] Credit Type table exists.
- [ ] Every Credit Type references a Platform.
- [ ] Credit Type code is unique.
- [ ] Credit Type lifecycle is implemented.
- [ ] Platform-specific credit denomination is supported.
- [ ] Transferability is explicitly represented.
- [ ] Refundability is explicitly represented.
- [ ] Historical Credit Types remain resolvable.
- [ ] Retired types cannot receive new purchases.

# 161. Acceptance Criteria — Plans

- [ ] Credit Plan table exists.
- [ ] Plans reference Credit Types.
- [ ] Included credits are non-negative.
- [ ] Purchase price is represented.
- [ ] Currency is represented.
- [ ] Effective dates are represented.
- [ ] Plan lifecycle is implemented.
- [ ] Historical plans remain resolvable.
- [ ] Plan codes are unique.
- [ ] Plan changes create new effective records rather than mutating historical
  financial evidence.

# 162. Acceptance Criteria — Rates

- [ ] Credit Rate table exists.
- [ ] Rates reference Platform.
- [ ] Rates reference Credit Type.
- [ ] Optional Platform Configuration is supported.
- [ ] Unit rate is positive.
- [ ] Billing unit is constrained.
- [ ] Minimum units are supported.
- [ ] Maximum units are supported.
- [ ] Rounding mode is explicit.
- [ ] Effective dates are stored.
- [ ] Historical rates remain resolvable.
- [ ] Consumption stores a pricing snapshot.

# 163. Acceptance Criteria — Wallets

- [ ] Wallet table exists.
- [ ] Wallet belongs to one Organization.
- [ ] Wallet belongs to one Credit Type.
- [ ] `(organization_id, credit_type_id)` is unique.
- [ ] Available balance cannot become negative.
- [ ] Reserved balance cannot become negative.
- [ ] Lifetime counters cannot become negative.
- [ ] Wallet lifecycle is implemented.
- [ ] Wallet account is linked to ledger.
- [ ] Critical wallet operations lock the wallet row.

# 164. Acceptance Criteria — Double-Entry Ledger

- [ ] Ledger Account table exists.
- [ ] Ledger Transaction table exists.
- [ ] Ledger Entry table exists.
- [ ] Every posted transaction has at least two entries.
- [ ] Debit and credit totals are equal.
- [ ] Ledger entries are positive amounts.
- [ ] Posted ledger transactions are immutable.
- [ ] Corrections use reversal transactions.
- [ ] Ledger transactions are tenant-aware.
- [ ] Ledger transaction idempotency is enforced.
- [ ] Wallet projections reconcile to ledger evidence.

# 165. Acceptance Criteria — Reservations

- [ ] Reservation table exists.
- [ ] Reservation references Wallet.
- [ ] Reservation references Credit Type.
- [ ] Booking integration is supported.
- [ ] Job integration is supported.
- [ ] Reserved amount is positive.
- [ ] Consumed plus released never exceeds reserved.
- [ ] Reservation lifecycle is implemented.
- [ ] Reservation expiry is implemented.
- [ ] Reservation creation is concurrency-safe.
- [ ] Reservation creation cannot overdraw a wallet.

# 166. Acceptance Criteria — Consumption

- [ ] Consumption table exists.
- [ ] Consumption references Wallet.
- [ ] Consumption references Credit Type.
- [ ] Consumption references Platform.
- [ ] Consumption references Rate.
- [ ] Actual billable units are stored.
- [ ] Unit rate is stored.
- [ ] Final amount is stored.
- [ ] Job integration is supported.
- [ ] Booking integration is supported.
- [ ] Consumption is idempotent.
- [ ] Consumption creates a balanced ledger transaction.

# 167. Acceptance Criteria — Refunds

- [ ] Refund table exists.
- [ ] Refund references Organization.
- [ ] Refund references Wallet.
- [ ] Refund can reference Consumption.
- [ ] Refund reason is required.
- [ ] Refund lifecycle is implemented.
- [ ] Refund cannot exceed refundable amount.
- [ ] Refund posting is transactional.
- [ ] Refund creates a balanced ledger transaction.
- [ ] Refund actions are auditable.

# 168. Acceptance Criteria — Invoices

- [ ] Invoice table exists.
- [ ] Invoice belongs to Organization.
- [ ] Invoice number is unique.
- [ ] Invoice status is implemented.
- [ ] Currency is explicit.
- [ ] Subtotal is stored.
- [ ] Tax is stored.
- [ ] Total is stored.
- [ ] Invoice total equals subtotal plus tax.
- [ ] Invoice lines exist.
- [ ] Credit Plan can be referenced from a line.
- [ ] Credit Type can be referenced from a line.

# 169. Acceptance Criteria — Payments

- [ ] Payment Transaction table exists.
- [ ] Payment is tenant-aware.
- [ ] Payment may reference Invoice.
- [ ] Provider is abstracted.
- [ ] Provider transaction ID is stored.
- [ ] Payment lifecycle is implemented.
- [ ] Payment idempotency is implemented.
- [ ] Successful payment can trigger credit posting.
- [ ] Payment does not directly mutate wallet state.
- [ ] Payment reconciliation is implemented.

# 170. Acceptance Criteria — Tenancy

- [ ] Customer financial records contain Organization ownership.
- [ ] Wallet access is tenant-authorized.
- [ ] Reservation access is tenant-authorized.
- [ ] Consumption access is tenant-authorized.
- [ ] Refund access is tenant-authorized.
- [ ] Invoice access is tenant-authorized.
- [ ] Payment access is tenant-authorized.
- [ ] Cross-tenant foreign references are rejected.
- [ ] Tenant isolation tests pass.

# 171. Acceptance Criteria — Pricing

- [ ] Pricing lookup is deterministic.
- [ ] Effective-dated rates are supported.
- [ ] Configuration-specific rates are supported.
- [ ] Duration-based rates are supported.
- [ ] Minimum units are supported.
- [ ] Rounding is deterministic.
- [ ] Historical pricing is preserved.
- [ ] Current rates cannot alter historical consumption.
- [ ] Platform determines Credit Type.
- [ ] Resource configuration can influence rate.

# 172. Acceptance Criteria — Concurrency

- [ ] Wallet reservation is transactionally locked.
- [ ] Concurrent reservations cannot overspend.
- [ ] Concurrent consumption cannot double-charge.
- [ ] Concurrent refunds cannot over-refund.
- [ ] Reservation release is idempotent.
- [ ] Payment reconciliation is idempotent.
- [ ] Ledger posting is atomic.
- [ ] Deadlock scenarios are tested.

# 173. Acceptance Criteria — Retention

- [ ] Credit ledger records are retained according to policy.
- [ ] Invoice records follow financial retention.
- [ ] Payment records follow financial retention.
- [ ] Wallet history remains reconstructable.
- [ ] Historical pricing remains available.
- [ ] Financial evidence is not hard deleted through generic deletion.
- [ ] Privacy handling supports actor anonymization where permitted.
- [ ] Retention policies are documented and executable.

# 174. Acceptance Criteria — Reconciliation

- [ ] Wallet-to-ledger reconciliation exists.
- [ ] Payment-to-invoice reconciliation exists.
- [ ] Payment-to-credit reconciliation exists.
- [ ] Reservation-to-consumption reconciliation exists.
- [ ] Refund reconciliation exists.
- [ ] Reconciliation is idempotent.
- [ ] Reconciliation failures are recorded.
- [ ] Reconciliation never silently rewrites history.

# 175. Acceptance Criteria — Audit

- [ ] Credit creation is audited.
- [ ] Plan changes are audited.
- [ ] Rate changes are audited.
- [ ] Wallet creation is audited.
- [ ] Purchases are audited.
- [ ] Reservations are audited.
- [ ] Consumption is audited.
- [ ] Refunds are audited.
- [ ] Adjustments are audited.
- [ ] Invoice lifecycle is audited.
- [ ] Payment lifecycle is audited.
- [ ] Administrative actions are audited.

# 176. Acceptance Criteria — Security

- [ ] Financial APIs require authentication.
- [ ] Organization authorization is enforced.
- [ ] Wallet mutations require authorized roles.
- [ ] Refund approval policy is enforced.
- [ ] Administrative adjustments require elevated authorization.
- [ ] Ledger records cannot be deleted through normal APIs.
- [ ] Provider credentials are not stored in financial tables.
- [ ] Payment provider secrets remain in secret management.
- [ ] Sensitive payment data is not stored unnecessarily.

# 177. Acceptance Criteria — Integration

- [ ] Platform integration passes.
- [ ] Project integration passes where required.
- [ ] Booking integration passes.
- [ ] Job integration passes.
- [ ] Result provenance can identify consumption.
- [ ] Audit integration passes.
- [ ] Outbox integration passes.
- [ ] Idempotency integration passes.
- [ ] Reconciliation integration passes.

# 178. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Credit domain ownership accepted.
- [ ] Platform-specific credit principle accepted.
- [ ] PostgreSQL financial authority accepted.
- [ ] Double-entry model accepted.

Phase 1:

- [ ] Organization tenancy implemented.
- [ ] Wallet identity implemented.
- [ ] Authorization implemented.

Phase 2:

- [ ] Credit Types implemented.
- [ ] Plans implemented.
- [ ] Rates implemented.
- [ ] Wallets implemented.

Phase 3:

- [ ] Ledger Accounts implemented.
- [ ] Ledger Transactions implemented.
- [ ] Ledger Entries implemented.
- [ ] Double-entry tests pass.

Phase 4:

- [ ] Reservations implemented.
- [ ] Booking integration implemented.
- [ ] Concurrency tests pass.

Phase 5:

- [ ] Consumption implemented.
- [ ] Job integration implemented.
- [ ] Refunds implemented.

Phase 6:

- [ ] Physical platform pricing implemented.
- [ ] Resource/configuration rates implemented.
- [ ] Fault/refund policies implemented.

Phase 7:

- [ ] Invoices implemented.
- [ ] Payment Transactions implemented.
- [ ] Commercial reporting implemented.
- [ ] Audit/provenance implemented.

Phase 8:

- [ ] Reconciliation productionized.
- [ ] Financial retention implemented.
- [ ] Backup/restore validated.
- [ ] Security hardening completed.
- [ ] Capacity baseline completed.
- [ ] Production acceptance completed.

# 179. Final Invariants

The following invariants are mandatory:

1. Every customer wallet belongs to exactly one Organization.
2. Every wallet represents exactly one Credit Type.
3. A Credit Type maps to a Platform.
4. Credits are non-transferable by default.
5. Wallet balances cannot become negative.
6. Reserved balance cannot become negative.
7. Reservation consumption plus release cannot exceed reservation.
8. Every posted ledger transaction is balanced.
9. Posted ledger transactions are immutable.
10. Financial corrections use new transactions.
11. Every financial operation is idempotent.
12. Historical rates cannot change historical charges.
13. Consumption retains a pricing snapshot.
14. Refunds cannot exceed refundable amounts.
15. Payment success does not directly mutate a wallet.
16. Credit purchase posting is ledger-backed.
17. Administrative adjustments are ledger-backed.
18. Cross-tenant financial operations are prohibited.
19. Booking owns booking state.
20. Credit owns financial reservation state.
21. Job owns execution state.
22. Credit owns consumption state.
23. Platform owns platform identity.
24. Credit owns commercial pricing for platform usage.
25. PostgreSQL is authoritative for financial state.
26. Object storage is not used for financial authority.
27. Financial history is not generically deleted.
28. Reconciliation never silently rewrites history.
29. Customer-facing balances are derived from authoritative financial state.
30. Production execution cannot consume credits without a valid wallet and
    authorized financial transaction.

# 180. Final Architecture Statement

> **Kritva RaaS credits are a platform-specific financial entitlement, not a
> generic currency. Each robotic platform defines its own Credit Type, while
> Plans define how credits are obtained and Rates define how robotic resources
> consume them.**
>
> **An Organization owns one wallet per Credit Type. Wallet balances provide
> efficient operational access, while an append-oriented double-entry ledger
> provides authoritative financial evidence. Every credit purchase,
> consumption, refund, expiration and administrative adjustment is represented
> by a balanced ledger transaction.**
>
> **Reservations protect credits before execution. Consumption converts actual
> robotic usage into a final charge using the pricing snapshot captured at the
> time of execution. Unused reservations are released, while refunds create
> compensating financial transactions rather than modifying historical ledger
> entries.**
>
> **Invoices and payment transactions remain provider-neutral. A successful
> external payment becomes a credit entitlement only after the corresponding
> financial transaction is durably reconciled into the Credit domain. Payment
> providers never directly control wallet balances.**
>
> **The resulting architecture preserves the Kritva RaaS commercial rule:
> subscription determines access, robotic platform determines credit type, and
> resource configuration plus duration determine consumption.**
>
> **This provides a deterministic, tenant-isolated, auditable and
> concurrency-safe financial foundation for the complete RaaS flow:
> Discover → Book → Reserve Credits → Execute → Consume → Release/Refund →
> Invoice → Reconcile.**

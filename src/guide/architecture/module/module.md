---
layout: doc
title: Module
---

# Module 

A Modular Monolithic Architecture is a design pattern that structures a monolithic application as a collection of loosely coupled, highly cohesive modules.

Each module is designed around a specific business domain or function and can be developed, tested, and deployed independently, as long as it remains part of the larger monolithic codebase. This approach offers a compromise between the simplicity of monolithic applications and the flexibility of microservices architectures.

The structure of a module in Hexancore, comprising three layers on the frontend and three on the backend or only backend layers.

![An image](/assets/logo/hexancore-logo-texts.png){ class="doc-img" }

The Asset, Component, Service, Application, Domain and Infrastructure layers,
represents a strategic decomposition of responsibilities that aligns with several established software architecture principles.

This layered architecture ensures a clean separation of concerns, facilitating easier maintenance, scalability, and adaptability of the system.

Here's a closer look at each layer and it's role within the Hexancore framework.

## Frontend

![An image](/assets/logo/hexancore-logo-texts.png){ class="doc-img" style="width: 512px; clip-path: inset(0 50% 0 0);" }

The frontend module of the Hexancore framework is organized into three distinct layers, each serving a specific purpose to streamline development and ensure maintainability.

By organizing the frontend module into these three layers, Hexancore ensures a clean separation of concerns, making the codebase more manageable, scalable, and maintainable.

### Asset

This layer contains all the static resources needed by the application, such as images, CSS files, fonts, PDFs, and other types of assets.

These resources are essential for the visual and functional aspects of the application.


### Component

Based on a component-oriented architecture, this layer focuses on creating self-contained, reusable UI components.

These components form the building blocks of complex user interfaces, leveraging modern frontend frameworks like React and Vue.js to promote modularity and reusability.

### Service

The service layer encompasses the application logic that doesn't fit within the component layer. This includes API clients for data fetching, state management stores for sharing state across components/pages, and various other helper utilities.

This layer ensures that the components remain focused on the UI, while the business logic and state management are handled separately.

## Backend

![An image](/assets/logo/hexancore-logo-texts.png){ class="doc-img" style="width: 512px; clip-path: inset(0 0 0 50%);" }

By structuring backend modules around Application,Domain,Infrastructure layers, Hexancore facilitates a modular monolithic architecture that is robust, flexible, and aligned with business domains.

The clear separation of concerns across the Application, Domain, and Infrastructure layers not only supports the principles of Clean, and Hexagonal architectures, but also embraces DDD and CQRS patterns.

This approach ensures that the Hexancore framework can handle complex business requirements while remaining scalable, maintainable, and adaptable to changing technological landscapes.

### Application

The Application layer serves as the entry point for interactions with the module, containing application logic that orchestrates the flow of data to and from the Domain layer, and ultimately to the user or external systems.

Handles Commands (actions that change the state of the system), Queries (requests for data), Domain Event Handlers (reacting to domain events), and Application Services (orchestrating application logic, often acting as the ports to adapters in Infrastructure).

### Domain

At the heart of the Hexancore module lies the Domain layer, which encapsulates the business logic and rules that define the essence of the business domain being modeled. This layer consists of entities, value objects, domain events, and aggregates.

It is designed to be pure in the sense that it should not depend on external concerns such as database implementations or web frameworks, making it reusable and testable in isolation.

### Infrastructure

The Infrastructure layer provides technical capabilities that support the execution of the application and domain layers. This includes interfacing with databases (persistence adapters), communicating with other APIs (API clients), handling web requests (API controllers), managing job queues, and any other "backend stuff" necessary for the module's functionality.

Acting as the module's connection to the external world, the Infrastructure layer implements the interfaces (ports) defined by the Application layer and Domain layer. This implementation of adapters follows the Hexagonal (Ports and Adapters) architecture, allowing the application to remain indifferent to the specifics of external services, databases, or frameworks used.

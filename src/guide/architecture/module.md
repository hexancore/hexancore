---

layout: doc
title: Module

---

# Module

A Modular Monolithic Architecture is a design pattern that structures a monolithic application as a collection of loosely coupled, highly cohesive modules. Each module is designed around a specific business domain or function and can be developed, tested, and deployed independently, as long as it remains part of the larger monolithic codebase. This approach offers a compromise between the simplicity of monolithic applications and the flexibility of microservices architectures.

## Structure
The structure of a module in Hexancore, comprising the Application, Domain, and Infrastructure layers,
represents a strategic decomposition of responsibilities that aligns with several established software architecture principles.
This layered architecture ensures a clean separation of concerns, facilitating easier maintenance, scalability, and adaptability of the system.

Here's a closer look at each layer and its role within the Hexancore framework:

### Application Layer
- **Responsibilities:** The Application layer serves as the entry point for interactions with the module, containing application logic that orchestrates the flow of data to and from the Domain layer, and ultimately to the user or external systems. It handles Commands (actions that change the state of the system), Queries (requests for data), Domain Event Handlers (reacting to domain events), and Application Services (orchestrating application logic, often acting as the ports in the ports and adapters architecture).

- **Design Considerations:** This layer abstracts the complexities of the Domain layer from the outside world. It is here that the CQRS pattern can be vividly observed, segregating the handling of Commands and Queries to optimize readability, scalability, and separation of concerns. Additionally, this layer may define interfaces (ports) that the Infrastructure layer (through its adapters) implements, ensuring a loose coupling between how operations are requested and how they are executed.


### Domain Layer
- **Responsibilities:** At the heart of the Hexancore module lies the Domain layer, which encapsulates the business logic and rules that define the essence of the business domain being modeled. This layer consists of entities, value objects, domain events, and aggregates that operate independently of the application's external concerns.

- **Design Considerations:** The Domain layer is the centerpiece in the DDD methodology, emphasizing the importance of modeling the business domain as accurately and comprehensively as possible. It is designed to be pure in the sense that it should not depend on external concerns such as database implementations or web frameworks, making it reusable and testable in isolation.

### Infrastructure Layer
- **Responsibilities:** The Infrastructure layer provides technical capabilities that support the execution of the application and domain layers. This includes interfacing with databases (persistence adapters), communicating with other APIs (API clients), handling web requests (API controllers), managing job queues, and any other "backend stuff" necessary for the module's functionality.

- **Design Considerations:** Acting as the module's connection to the external world, the Infrastructure layer implements the interfaces (ports) defined by the Application layer and Domain layer. This implementation of adapters follows the Hexagonal (Ports and Adapters) architecture, allowing the application to remain indifferent to the specifics of external services, databases, or frameworks used.

By structuring modules around these three layers, Hexancore facilitates a modular monolithic architecture that is robust, flexible, and aligned with business domains.

The clear separation of concerns across the Application, Domain, and Infrastructure layers not only supports the principles of Clean, Onion, and Hexagonal architectures, but also embraces DDD and CQRS patterns.

This approach ensures that the Hexancore framework can handle complex business requirements while remaining scalable, maintainable, and adaptable to changing technological landscapes.
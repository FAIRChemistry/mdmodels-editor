# Converting Your Data Model

MD-Models provides flexible conversion options to transform your markdown-based data models into various technical formats, each serving different implementation needs:

## Available Export Formats

**JSON Schema**
A widely-used format for validating JSON data structures. This is particularly useful when working with REST APIs or document databases that use JSON as their primary data format.

**XML Schema Definition (XSD)**
The W3C standard for defining XML document structures. XSD exports are valuable when working with SOAP services, enterprise systems, or when strict XML validation is required.

**Python Implementations**
Two Python variants are available:
- PyDantic models, which provide runtime type checking and data validation with excellent API integration
- Python dataclasses, offering a lightweight approach for data storage with type hints

**TypeScript Types**
Generate TypeScript type definitions, perfect for frontend development and ensuring type safety in JavaScript applications.

**Semantic Web Formats**
- SHACL (Shapes Constraint Language): For validating RDF graphs against a set of conditions, useful in semantic web applications
- ShEx (Shape Expressions): A language for describing and validating RDF structures, particularly valuable for linked data validation

## Using the Exporter

You can export your models using either the copy-to-clipboard function or direct file download. The exported schema maintains all the semantic information from your markdown definition while adapting to the target format's specific requirements and conventions.

When choosing an export format, consider your implementation needs:
- Use JSON Schema for REST APIs and modern web services
- Choose XSD for enterprise XML-based systems
- Select Python implementations for backend services and data processing
- Pick TypeScript for frontend applications
- Opt for SHACL or ShEx when working with RDF and linked data

The exported schemas can be directly used in their respective ecosystems without additional modification, making it seamless to go from documentation to implementation.

# MD-Models Editor

A web-based editor for creating, editing, and working with [MD-Models](https://fairchemistry.github.io/md-models/) - a markdown-based data modeling specification that bridges the gap between human-readable documentation and technical schema definitions.

Visit the live editor at: [mdmodels.vercel.app](https://mdmodels.vercel.app)

## What is MD-Models?

**Markdown Data Models (MD-Models)** represents a paradigm shift in data modeling by leveraging the inherent readability and accessibility of Markdown to democratize data structure definition. This approach addresses a fundamental challenge in data modeling: the disconnect between documentation and implementation.

### Key Benefits

- **Human-Centric Design**: Uses Markdown's low barrier to entry for non-technical users
- **Single Source of Truth**: Unifies documentation and structural definition
- **Semantic Clarity**: Built-in support for semantic web concepts and ontologies
- **Multiple Export Formats**: Generate technical schemas, code, and documentation from one source
- **Research-Friendly**: Particularly beneficial for research communities and collaborative data modeling

### Example MD-Model

```markdown
### GeneticSequence

This model represents a genetic sequence record in a genomics database.

- __accession_number__
  - Type: string
  - Term: bioschema:identifier
  - Description: The unique identifier for this genetic sequence
- __sequence__
  - Type: string
  - Term: bioschema:sequence
  - Description: The DNA sequence in string format
- __gc_content__
  - Type: float
  - Term: bioschema:gcContent
  - Description: The percentage of G and C bases in the DNA sequence
  - Default: 0.0
```

## Features

### 🖋️ **Markdown Editor**

- Syntax highlighting specifically designed for MD-Models
- Real-time linting and validation
- Auto-completion for common patterns
- Customizable font size (Ctrl/Cmd + Plus/Minus)

### 📊 **Interactive Graph View**

- Visual representation of your data models
- Interactive editing directly in the graph
- Relationship visualization between objects
- Click and edit functionality

### 👁️ **Live Preview**

- Real-time rendered preview of your markdown
- Navigate between objects using table of contents
- See how your documentation will look

### ✅ **Real-time Validation**

- Comprehensive error detection and reporting
- Best practice suggestions
- Semantic validation for terms and relationships

### 📦 **Multi-Format Export**

Convert your MD-Model to various targets, including:

- `python-dataclass`: Python dataclass implementation with JSON-LD support
- `python-pydantic`: PyDantic implementation with JSON-LD support
- `python-pydantic-xml`: PyDantic implementation with XML support
- `typescript`: TypeScript interface definitions with JSON-LD support
- `typescript-zod`: TypeScript Zod schema definitions
- `rust`: Rust struct definitions with serde support
- `golang`: Go struct definitions
- `julia`: Julia struct definitions
- `protobuf`: Protocol Buffer schema definition
- `graphql`: GraphQL schema definition
- `xml-schema`: XML schema definition
- `json-schema`: JSON schema definition
- `json-schema-all`: Multiple JSON schema definitions (one per object)
- `shacl`: SHACL shapes definition
- `shex`: ShEx shapes definition
- `compact-markdown`: Compact markdown representation
- `mkdocs`: MkDocs documentation format
- `linkml`: LinkML schema definition

---

**Made with ❤️ for the research and data modeling community**

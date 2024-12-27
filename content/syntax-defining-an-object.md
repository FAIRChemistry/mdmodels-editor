# Defining an Object

In our data model syntax, objects are the fundamental building blocks. They represent entities or concepts in your domain.

## Key Points

- Start with a level 3 heading (###) followed by the object name
- List attributes using bullet points (-)
- Specify attribute properties as sub-items

## Detailed Structure

### Object Declaration and Description

Objects are declared using a level 3 heading (###) followed by the object name. You can optionally include a semantic reference in parentheses. After declaring the object, add a description that explains its purpose and context in natural language. This helps both technical and non-technical users understand the object's role:

```markdown
### GeneticSequence (bioschema:GeneticSequence)

This model represents a genetic sequence record in a genomics database. It captures essential information about a DNA sequence, including its accession number and related metadata.
```

### Attributes

Plain objects may not be useful without attributes. Attributes define the object's properties. Each attribute follows this structure:

```markdown
- attributeName
  - Type: dataType
  - Term: ontologyReference
  - Description: detailed explanation
  - Default: defaultValue
  - XML: xmlMapping
```

Besides the attribute name, each attribute can have so called options. These are meant to define essential properties of the attribute that are used to forge the data model. An attribute can have any option you can think of, but the most common and required ones are:

1. **`Type`** (Required)
   - Simple types: `string`, `float`, `integer`, `boolean`. `bytes`
   - Arrays: Add `[]` suffix (e.g., `string[]`)
   - References: Use `ObjectName` or `[ObjectName](#objectname)`

2. **`Term`** (Optional)
   - Links to semantic vocabularies
   - Uses prefixes defined in frontmatter
   - Example: `schema:identifier`

3. **`Description`** (Recommended)
   - Explains the attribute's purpose
   - Provides context for valid values
   - Documents any constraints

### Connecting Objects

Objects can be connected to each other using references. References are defined using the `Type` option. The type can be a simple type, an array of a simple type, or a reference to another object. For instance, if you want to reference the `Author` object, you can use `Author` or `[Author](#author)`. Here is an example:

```markdown
- authors
  - Type: [Author](#author)[]
  - Term: schema:author
  - Description: List of authors who contributed to the publication
```

## Complete Example

Here's a comprehensive example that demonstrates these concepts:

```markdown
### ResearchPublication

This model represents a scientific publication with its core metadata, authors, 
and citations.

- __doi__
  - Type: Identifier
  - Term: schema:identifier
  - Description: Digital Object Identifier for the publication
  - XML: @doi
- title
  - Type: string
  - Term: schema:name
  - Description: The main title of the publication
- authors
  - Type: [Author](#author)[]
  - Term: schema:author
  - Description: List of authors who contributed to the publication
- publication_year
  - Type: integer
  - Term: schema:datePublished
  - Description: Year when the publication was published
  - Minimum: 1900
  - Maximum: 2100
- citations
  - Type: integer
  - Term: schema:citation
  - Description: Number of times this publication has been cited
  - Default: 0


### Author

The `Author` object is a simple object that has a name and an email address.

- __name__
  - Type: string
  - Term: schema:name
  - Description: The name of the author
- __email__
  - Type: string
  - Term: schema:email
  - Description: The email address of the author
```

## Best Practices

1. **Use Descriptive Names**
   - Object names should be PascalCase (e.g., `ResearchPublication`)
   - Attribute names should be in snake_case (e.g., `publication_year`)
   - Use clear, domain-specific terminology

2. **Identifiers**
   - Mark primary keys with double underscores (e.g., `__doi__`)
   - Choose meaningful identifier fields

3. **Documentation**
   - Always include object descriptions
   - Document complex attributes
   - Explain any constraints or business rules

4. **Semantic Mapping**
   - Use standard vocabularies when possible
   - Define custom terms in your prefix map
   - Maintain consistent terminology

5. **Validation Rules**
   - Include range constraints for numbers
   - Specify default values when appropriate
   - Document any special validation requirements

## Common Patterns

### Array Types
```markdown
- tags
  - Type: string[]
  - Description: List of keywords describing the publication
```

### Object References
```markdown
- main_author
  - Type: Author
  - Description: The primary author of the publication
```

### Required Fields
```markdown
- __id__
  - Type: Identifier
  - Description: Unique identifier for the object
```

Remember that MD-Models aims to balance human readability with technical precision. Your object definitions should be clear enough for domain experts to understand while maintaining the structure needed for technical implementation.

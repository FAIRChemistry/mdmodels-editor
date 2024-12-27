# Editor and Linting

The MD-Models editor provides real-time linting and validation to ensure your data models follow best practices and maintain consistency. Let's explore these features through an example.

## Live Validation

Consider this problematic model definition:

```markdown
### GeneticSequence

A model representing genetic sequence data.

- 5prime_region
  - Type: string
  - Description: The 5' region of the sequence
```

In the editor, you'll notice a red underline beneath `5prime_region`. Hovering over the red dot in the gutter reveals the validation error:

> Attribute names must not start with numbers. Consider using 'five_prime_region' or 'prime5_region' instead.

## Validation Panel

The validation panel on the right side of the editor provides a comprehensive overview of all issues in your models. It categorizes problems into:

- Errors (red): Critical issues that must be fixed
- Warnings (yellow): Potential problems that should be reviewed
- Info (blue): Suggestions for improvement

Each entry in the validation panel is clickable, allowing you to jump directly to the relevant location in your model.

## Graph View

Beyond text-based editing, MD-Models provides an interactive graph view that visualizes the relationships between your models. This view:

1. Shows object hierarchies and relationships
2. Provides quick navigation between related models
3. Includes an embedded editor for quick modifications

To access the graph view, click the "Graph" tab above the editor. You can double-click any object to open its definition in the embedded editor, making it easy to make changes while maintaining context of the overall model structure.

The graph view automatically updates as you modify your models, ensuring your visualization always reflects the current state of your data structures.

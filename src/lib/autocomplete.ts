import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

const ADD_OBJECT = `
### ObjectName

_Description_

- enter_name
    - Type: <Type>
    - Description: <Description>
`;

const ADD_ATTRIBUTE = `
- enter_name
    - Type: <Type>
    - Description: <Description>
`;

function autocomplete(context: CompletionContext) {
  let word = context.matchBefore(/\w*/);

  if (!word) return null;
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      {
        label: "Add Object",
        type: "keyword",
        apply: ADD_OBJECT.trimStart(),
      },
      {
        label: "Add Attribute",
        type: "keyword",
        apply: ADD_ATTRIBUTE.trimStart(),
      },
    ],
  };
}

const mdModelsAutoComplete = autocompletion({
  override: [autocomplete],
});

export { mdModelsAutoComplete };

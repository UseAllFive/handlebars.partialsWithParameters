# handlebars.partialsWithParameters

Brought to you by [Use All Five, Inc.](http://www.useallfive.com)

```
Author: Justin Anastos <janastos@useallfive.com>
Author URI: [http://www.useallfive.com](http://www.useallfive.com)
Repository: https://github.com/UseAllFive/handlebars.partialsWithParameters
```

Allow named parameters to be passed to handlebars partials.

[Annotated Source](http://useallfive.github.io/handlebars.partialsWithParameters/handlebars.partialsWithParameters.html)

## Installation

- Include `lib/handlebars.partialsWithParameters.js` before any partials to
  which you need to pass parameters are rendered.

## Usage

1. Define the Handlebars partial in your JavaScript:
   ```javascript
   Handlebars.registerPartial('partialName', partialTemplate);
   ```

1. Call the custom helper created by this module, `$`, in your template.
   Note that the partial name must be quoted and sent as a string to the
   helper.
   ```Handlebars
   {{$ 'partialeName' param1='value1' param2='value2'}}
   ```

1. Use the parameters values by accessing the `hash` property added to the
   context of the partial template.

   Partial should be defined like this:
   ```Handlebars
   <div class="test-class">{{ hash.param1 }}</div>
   <div class="test-class">{{ hash.param2 }}</div>
   ```

   The output will look like this:
   ```HTML
   <div class="test-class">value1</div>
   <div class="test-class">value2</div>
   ```

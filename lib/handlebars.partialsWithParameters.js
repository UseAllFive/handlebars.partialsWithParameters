// handlebars.partialsWithParameters
// ----------------------------
// v1.0.5
//
// Annotated source code can be found here: http://useallfive.github.io/handlebars.partialsWithParameters/handlebars.partialsWithParameters.html
//
// Brought to you by [Use All Five, Inc.](http://www.useallfive.com)
// ```
// Author: Justin Anastos <janastos@useallfive.com>
// Author URI: [http://www.useallfive.com](http://www.useallfive.com)
// Repository: https://github.com/UseAllFive/handlebars.partialsWithParameters
// ```
// Use Handlebars helper to allow passing of parameters into partials.


(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['Handlebars', 'underscore'], factory);
    } else {
        // Use browser globals. Will fail if they are not yet loaded.
        /*globals Handlebars, _ */
        factory(Handlebars, _);
    }
}(function(Marionette, Backbone, $, _) {
    Handlebars.registerHelper('$', function(partialName) {
        var context;
        var options;
        var partial;
        var values;

        // If there was no partial passed, throw an error.
        if (!partialName) {
            throw new Error('No partial name given.');
        }

        // Create `values` array with all the arguments after the first one,
        // which is `partial`.
        values = Array.prototype.slice.call(arguments, 1);

        // Pop `options` off the end. It is passed from handlebars and is
        // not user defined.
        options = values.pop();

        // Resolve `partialName` into a partial previously registered with
        // Handlebars.
        partial = Handlebars.partials[partialName];
        if (!partial) {
            throw new Error('Partial \"' + partialName + '\" not found');
        }

        // Extend `context` with the parameters passed in.
        context = _.extend({}, options.context || this, _.omit(options, 'context', 'fn', 'inverse'));

        // Call the original partial with the extended `context`.
        return new Handlebars.SafeString(partial(context));
    });
}));

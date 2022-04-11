# Contribution Guide

Thank you for helping to maintain and improve HacheQL!

## Reporting Bugs

Before reporting a bug, please check the list of [open issues](https://github.com/oslabs-beta/hacheQL/issues) to see if it has already been reported. To report a new bug, open a [new issue](https://github.com/oslabs-beta/hacheQL/issues).

## Feature Requests

Before requesting a feature, please check the list of [open issues](https://github.com/oslabs-beta/hacheQL/issues) to see if the feature has already been requested. If it has, leave a comment to show your support for the idea. If you plan to implement the feature, say so in your comment.

To make a new feature request, open a [new issue](https://github.com/oslabs-beta/hacheQL/issues). If you plan to implement the feature, include a comment saying so.

## Contributing

Before starting to work, check the [open issues](https://github.com/oslabs-beta/hacheQL/issues) to see if anyone is already working on the same bug/feature. If someone is, you can leave a comment offering to help, or you can pick a different issue to work on. If someone has claimed an issue but hasn't left an update for two weeks, it's okay to start working on it yourself even if they don't respond to comments offering to help.

Once you've settled on an issue to work on:

1. Fork the project
2. Run `npm install`.
3. Create your feature branch and give it a descriptive name. Begin the branch name with the ticket number of the issue you're working on.
> For example:
`git checkout -b 42-feature/configure-ice-cream-sundae-machine`
3. This project uses the [test-driven development](https://www.agilealliance.org/glossary/tdd/#q=~(infinite~false~filters~(postType~(~'page~'post~'aa_book~'aa_event_session~'aa_experience_report~'aa_glossary~'aa_research_paper~'aa_video)~tags~(~'tdd))~searchTerm~'~sort~false~sortDirection~'asc~page~1)) strategy. Please write tests for your new feature BEFORE implementing it. Before implementing the feature, all your tests should fail. After implementing the feature, all your tests should pass.
3. Make sure `eslint` is not identifying style errors in your code. 
3. Make sure your implemented feature passes the tests you wrote.
4. If you've changed the API, update the documentation.
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

If you make changes and want to update the website, please feel free. All the files are in the `/demo` directory.

## Issues

## Coding Style
- 2 spaces for indentation (instead of tabs)
- 80 character line length
- 


## License
By contributing, you agree that your contributions will be licensed under HacheQL's MIT License.
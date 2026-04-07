# healthicons-dotnet

`HealthIcons.Maui` packages [Health Icons](https://github.com/resolvetosavelives/healthicons) for .NET 10 and .NET MAUI using embedded icon fonts plus strongly typed glyph constants.

Public repository: https://github.com/juan-ibanez-incontrol/healthicons-dotnet

## Status

This repository is scaffolded for a CI-driven pipeline:

- GitHub Actions generates the icon fonts from upstream SVGs
- Generated C# glyph constants are committed into the repo
- CI packs a preview NuGet package on every push and PR
- Releases publish `HealthIcons.Maui` to NuGet.org

## Planned package usage

```csharp
using HealthIcons.Maui;

builder.ConfigureFonts(fonts =>
{
    fonts.AddHealthIconFonts();
});
```

```csharp
var source = new FontImageSource
{
    FontFamily = HealthIconFontAliases.Filled,
    Glyph = Filled.Ambulance,
    Size = 24
};
```

## Development

Most generation is designed to run in GitHub Actions. Local runs are also supported from the `tools` folder.

## GitHub Actions

- `generate-icons.yml` regenerates fonts and glyph constants from the upstream `healthicons` npm package
- `update-icons.yml` checks for upstream updates and opens a PR
- `ci.yml` restores, builds, tests, and packs a preview NuGet package
- `publish.yml` packs and publishes the release package to NuGet.org


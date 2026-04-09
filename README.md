# healthicons-dotnet

[![NuGet](https://img.shields.io/nuget/v/HealthIcons.Maui.svg)](https://www.nuget.org/packages/HealthIcons.Maui/)

`HealthIcons.Maui` packages [Health Icons](https://github.com/resolvetosavelives/healthicons) for .NET 10 and .NET MAUI using embedded icon fonts plus strongly typed glyph constants.

NuGet package: https://www.nuget.org/packages/HealthIcons.Maui/

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

## Sample app

A MAUI sample app lives in `samples\HealthIcons.Maui.Sample\`. It includes `Filled` and `Outline` gallery tabs that render all icons in a 2-column `CollectionView`, plus a `XAML` tab that declares one filled icon and one outline icon directly in XAML using constants for both the glyph and the font alias.

The gallery does not keep a manual icon list. It reflects over the generated `Filled` and `Outline` constant fields at runtime, so regenerated icons appear automatically in the sample.

On Windows, validate the sample from the CLI with:

```powershell
dotnet build samples\HealthIcons.Maui.Sample\HealthIcons.Maui.Sample.csproj -c Release -f net10.0-windows10.0.19041.0
```

To run the sample interactively, open `samples\HealthIcons.Maui.Sample\HealthIcons.Maui.Sample.csproj` in Visual Studio and start a supported MAUI target.

## Development

Most generation is designed to run in GitHub Actions. Local runs are also supported from the `tools` folder.

## GitHub Actions

- `generate-icons.yml` regenerates fonts and glyph constants from the upstream `healthicons` npm package
- `update-icons.yml` checks for upstream updates and opens a PR
- `ci.yml` restores, builds, tests, and packs a preview NuGet package
- `publish.yml` packs and publishes the release package to NuGet.org


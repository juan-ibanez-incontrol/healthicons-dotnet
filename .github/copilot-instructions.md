# Copilot Instructions

## Build and test

- Install prerequisites before local .NET work:
  - .NET 10 SDK
  - `dotnet workload install maui`
- There is no solution file; target the project files directly.
- Restore, build, and test with the same commands used by CI:

```powershell
dotnet restore tests\HealthIcons.Maui.Tests\HealthIcons.Maui.Tests.csproj
dotnet build tests\HealthIcons.Maui.Tests\HealthIcons.Maui.Tests.csproj -c Release --no-restore
dotnet build src\HealthIcons.Maui\HealthIcons.Maui.csproj -c Release --no-restore
dotnet test tests\HealthIcons.Maui.Tests\HealthIcons.Maui.Tests.csproj -c Release --no-build
```

- Build the sample app on Windows with:

```powershell
dotnet restore samples\HealthIcons.Maui.Sample\HealthIcons.Maui.Sample.csproj
dotnet build samples\HealthIcons.Maui.Sample\HealthIcons.Maui.Sample.csproj -c Release -f net10.0-windows10.0.19041.0 --no-restore
```

- Run a single test with xUnit filtering:

```powershell
dotnet test tests\HealthIcons.Maui.Tests\HealthIcons.Maui.Tests.csproj -c Release --no-build --filter "FullyQualifiedName~HealthIcons.Maui.Tests.GlyphTests.FilledGlyphs_Should_BeGenerated"
```

- Pack the NuGet package the same way CI does:

```powershell
dotnet pack src\HealthIcons.Maui\HealthIcons.Maui.csproj -c Release --no-build -o artifacts
```

- When changing generated icon assets, run the generator from `tools\`:

```powershell
npm install
npm run generate
```

- There is no dedicated lint script. Build quality gates come from MSBuild settings: warnings are errors, nullable is enabled, implicit usings are enabled, and the repo uses `LangVersion=preview`.

## High-level architecture

- `src\HealthIcons.Maui\` is the distributable library. It embeds the generated font files from `Resources\Fonts\`, exposes strongly typed glyph constants through the generated `Filled` and `Outline` classes, and registers the embedded fonts through `HealthIconsConfigurationExtensions.AddHealthIconFonts()`.
- `samples\HealthIcons.Maui.Sample\` is the reference consumer app. It uses `AppShell` tabs for `Filled`, `Outline`, and `XAML`. The gallery tabs enumerate the generated glyph constants at runtime rather than carrying a manual icon list, while the `XAML` tab demonstrates direct XAML icon usage with constants for both glyphs and font aliases.
- `AssemblyInfo.cs` adds the XAML namespace mapping `http://schemas.healthicons.org/maui` with the `hi` prefix, so XAML-facing changes need to keep that namespace stable.
- `tests\HealthIcons.Maui.Tests\` is a small xUnit project that validates generation output, not rendering behavior. Current tests check that generated glyph constants are non-empty and that filled and outline sets stay in sync.
- `tools\` is the asset-generation pipeline. `preprocess-svgs.mjs` reads the upstream `healthicons` npm package and normalizes SVGs into `tools\temp\`. `generate-fonts.mjs` turns those SVGs into deterministic `.svg`, `.ttf`, and `.json` font artifacts in `src\HealthIcons.Maui\Resources\Fonts\`. `generate-csharp.mjs` converts the JSON codepoint maps into `HealthIcons.Filled.cs` and `HealthIcons.Outline.cs`.
- GitHub Actions drive the normal lifecycle: `generate-icons.yml` regenerates assets, `update-icons.yml` watches upstream npm releases and opens a PR, `ci.yml` builds/tests/packs preview packages, and `publish.yml` packs and pushes the release package to NuGet.

## Key conventions

- Do not hand-edit `src\HealthIcons.Maui\HealthIcons.Filled.cs`, `src\HealthIcons.Maui\HealthIcons.Outline.cs`, or files under `src\HealthIcons.Maui\Resources\Fonts\`. They are generated outputs. If icon names, codepoints, or font contents need to change, update the Node generator in `tools\` and rerun `npm run generate`.
- The sample app must not maintain a hardcoded icon inventory. If the gallery logic changes, keep it driven by runtime enumeration of `Filled` and `Outline` constant fields so the sample automatically tracks regenerated icons.
- The tracked upstream icon source version lives in `tools\.healthicons-version`. Update that together with regenerated assets when intentionally moving to a newer `healthicons` release.
- Generator output is intentionally deterministic: SVG input files are sorted, JSON entries are sorted before C# emission, and generated field names are sanitized to PascalCase with numeric suffixes for collisions. Preserve that determinism when changing the generator so diffs stay reviewable.
- Consumer-facing examples should pair `HealthIconFontAliases.Filled` or `HealthIconFontAliases.Outline` with the matching `Filled.*` or `Outline.*` glyph constant. That alias-to-glyph pairing is the library's public usage model.
- Update `README.md` when changing package-facing usage. The library packs the repository root `README.md` into the NuGet package as the package readme.

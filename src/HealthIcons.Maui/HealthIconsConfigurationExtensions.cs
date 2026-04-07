namespace HealthIcons.Maui;

public static class HealthIconsConfigurationExtensions
{
    public static IFontCollection AddHealthIconFonts(this IFontCollection fonts)
    {
        fonts.AddEmbeddedResourceFont(
            typeof(HealthIconsConfigurationExtensions).Assembly,
            filename: "HealthIcons-Filled.ttf",
            alias: HealthIconFontAliases.Filled);

        fonts.AddEmbeddedResourceFont(
            typeof(HealthIconsConfigurationExtensions).Assembly,
            filename: "HealthIcons-Outline.ttf",
            alias: HealthIconFontAliases.Outline);

        return fonts;
    }
}


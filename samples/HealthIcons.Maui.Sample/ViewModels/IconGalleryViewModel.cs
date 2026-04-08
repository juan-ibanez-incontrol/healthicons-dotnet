using System.Collections.ObjectModel;
using System.Reflection;
using HealthIcons.Maui.Sample.Models;

namespace HealthIcons.Maui.Sample.ViewModels;

public sealed class IconGalleryViewModel
{
    public ObservableCollection<IconItem> Icons { get; }

    public string IconCountLabel { get; }

    public IconGalleryViewModel(Type iconType, string fontAlias)
    {
        ArgumentNullException.ThrowIfNull(iconType);
        ArgumentException.ThrowIfNullOrWhiteSpace(fontAlias);

        var icons = iconType
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(field => field is { IsLiteral: true, IsInitOnly: false } && field.FieldType == typeof(string))
            .OrderBy(field => field.Name, StringComparer.Ordinal)
            .Select(field => new IconItem(
                Name: field.Name,
                Glyph: (string?)field.GetRawConstantValue() ?? string.Empty,
                FontAlias: fontAlias))
            .ToList();

        Icons = new ObservableCollection<IconItem>(icons);
        IconCountLabel = $"{Icons.Count} icons";
    }
}

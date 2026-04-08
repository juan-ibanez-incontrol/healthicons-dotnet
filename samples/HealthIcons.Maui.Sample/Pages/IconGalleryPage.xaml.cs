using HealthIcons.Maui.Sample.ViewModels;

namespace HealthIcons.Maui.Sample.Pages;

public partial class IconGalleryPage : ContentPage
{
    protected IconGalleryPage(string title, Type iconType, string fontAlias)
    {
        InitializeComponent();

        Title = title;
        BindingContext = new IconGalleryViewModel(iconType, fontAlias);
    }
}

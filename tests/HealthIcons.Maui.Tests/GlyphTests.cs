using System.Reflection;
using Xunit;

namespace HealthIcons.Maui.Tests;

public class GlyphTests
{
    [Fact]
    public void FilledGlyphs_Should_BeGenerated()
    {
        var fields = typeof(Filled)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(field => field.FieldType == typeof(string))
            .ToArray();

        Assert.NotEmpty(fields);
        Assert.All(fields, field => Assert.False(string.IsNullOrWhiteSpace((string?)field.GetValue(null))));
    }

    [Fact]
    public void OutlineGlyphs_Should_BeGenerated()
    {
        var fields = typeof(Outline)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(field => field.FieldType == typeof(string))
            .ToArray();

        Assert.NotEmpty(fields);
        Assert.All(fields, field => Assert.False(string.IsNullOrWhiteSpace((string?)field.GetValue(null))));
    }

    [Fact]
    public void FilledAndOutlineGlyphs_Should_HaveMatchingCounts()
    {
        var filledCount = typeof(Filled)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Count(field => field.FieldType == typeof(string));

        var outlineCount = typeof(Outline)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Count(field => field.FieldType == typeof(string));

        Assert.Equal(filledCount, outlineCount);
    }
}


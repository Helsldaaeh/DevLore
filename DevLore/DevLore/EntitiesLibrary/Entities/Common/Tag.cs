using DevLore.EntitiesLibrary.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class Tag : IdentifiableEntity
    {
        #region Configuration
        public const int NameLengthMax = 50;

        public class Configuration(BaseConfiguration configuration) : Configuration<Tag>(configuration)
        {
            public override void Configure(EntityTypeBuilder<Tag> builder)
            {
                builder.Property(t => t.Name)
                    .HasMaxLength(NameLengthMax)
                    .IsRequired();
                builder.HasIndex(t => t.Name).IsUnique();

                base.Configure(builder);
            }
        }
        #endregion

        public string Name { get; set; } = string.Empty;
        public List<Post>? Posts { get; set; }
    }
}
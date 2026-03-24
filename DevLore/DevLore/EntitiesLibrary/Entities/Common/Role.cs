using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DevLore.EntitiesLibrary.Data;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class Role : IdentifiableEntity
    {
        #region Configuration
        public const int NameLengthMax = 50;

        public class Configuration(BaseConfiguration configuration) : Configuration<Role>(configuration)
        {
            public override void Configure(EntityTypeBuilder<Role> builder)
            {
                builder.Property(r => r.Name)
                    .HasMaxLength(NameLengthMax)
                    .IsRequired();
                builder.HasIndex(r => r.Name).IsUnique();
                base.Configure(builder);
            }
        }
        #endregion

        public string Name { get; set; } = string.Empty;
    }
}
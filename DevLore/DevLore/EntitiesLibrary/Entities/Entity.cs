using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using DevLore.EntitiesLibrary.Data;

namespace DevLore.EntitiesLibrary.Entities
{
    public abstract class Entity
    {
        #region Configuration
        private const bool IsCreatedAtRequired = false;
        private const bool IsUpdatedAtRequired = false;

        public abstract class Configuration<T>(BaseConfiguration configuration) : IEntityTypeConfiguration<T>
            where T : Entity
        {
            protected BaseConfiguration ContextConfiguration { get; } = configuration;
            public virtual void Configure(EntityTypeBuilder<T> builder)
            {
                builder.Property(entity => entity.CreatedAt)
                    .HasColumnType(ContextConfiguration.DateTimeType)
                    .HasDefaultValueSql(ContextConfiguration.DateTimeValueCurrent)
                    .ValueGeneratedOnAddOrUpdate()
                    .IsRequired(IsCreatedAtRequired);

                builder.Property(entity => entity.UpdatedAt)
                    .HasColumnType(ContextConfiguration.DateTimeType)
                    .IsRequired(IsUpdatedAtRequired);
            }
        }
        #endregion

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
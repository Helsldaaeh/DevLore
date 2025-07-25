using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DevLore.EntitiesLibrary.Data;
using DevLore.EntitiesLibrary.Entities;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class Post : IdentifiableEntity
    {
        public const int ContentLength = 2048;
        /// <summary>
        ///     Конфигурация модели <see cref="Group" />.
        /// </summary>
        /// <param name="configuration">Конфигурация базы данных.</param>
        public class Configuration(BaseConfiguration configuration) : Configuration<Post>(configuration)
        {
            /// <summary>
            ///     Задать конфигурацию для модели.
            /// </summary>
            /// <param name="builder">Набор интерфейсов настройки модели.</param>
            public override void Configure(EntityTypeBuilder<Post> builder)
            {
                builder.Property(group => group.Content)
                    .HasMaxLength(ContentLength);

                builder.HasOne(x => x.User)
                    .WithMany(y => y.Posts)
                    .HasForeignKey(x => x.UserId);
                base.Configure(builder);
            }
        }

        public int UserId { get; set; }
        public User? User { get; set; }
        public string Content { get; set; } = "";
    }
}

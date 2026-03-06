using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DevLore.EntitiesLibrary.Data;
using DevLore.EntitiesLibrary.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Identity;
using DevLore.EntitiesLibrary.Entities.Security;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class LikeOrDislike : IdentifiableEntity
    {

        /*                   __ _                       _   _
       *   ___ ___  _ __  / _(_) __ _ _   _ _ __ __ _| |_(_) ___  _ __
       *  / __/ _ \| '_ \| |_| |/ _` | | | | '__/ _` | __| |/ _ \| '_ \
       * | (_| (_) | | | |  _| | (_| | |_| | | | (_| | |_| | (_) | | | |
       *  \___\___/|_| |_|_| |_|\__, |\__,_|_|  \__,_|\__|_|\___/|_| |_|
       *                        |___/
       * Константы, задающие базовые конфигурации полей
       * и ограничения модели.
       */

        #region Configuration



        public const int TitleLengthMax = 256;
        public const int PassLengthMax = 256;
        public const int ProfileLengthMax = 256;

        /// <summary>
        ///     Конфигурация модели <see cref="Group" />.
        /// </summary>
        /// <param name="configuration">Конфигурация базы данных.</param>
        public class Configuration(BaseConfiguration configuration) : Configuration<LikeOrDislike>(configuration)
        {
            /// <summary>
            ///     Задать конфигурацию для модели.
            /// </summary>
            /// <param name="builder">Набор интерфейсов настройки модели.</param>
            public override void Configure(EntityTypeBuilder<LikeOrDislike> builder)
            {
                builder.Property(group => group.Content)
                    .HasMaxLength(ContentLength);

                builder.HasOne(x => x.User)
                    .WithMany(y => y.Posts)
                    .HasForeignKey(x => x.UserId);
                base.Configure(builder);
            }
        }

        #endregion

        public bool LikeOrDis { get; set; }
        public User? User { get; set; }
        public int UserId { get; set; }

        // Добавить защиту от перебора(если начинается перебор, то добавитб ограничение(ожидание 30 сек каждые 5 попыток)
    }
}
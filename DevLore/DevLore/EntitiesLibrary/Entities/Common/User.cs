using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DevLore.EntitiesLibrary.Data;
using DevLore.EntitiesLibrary.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Identity;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class User : IdentifiableEntity
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
        public class Configuration(BaseConfiguration configuration) : Configuration<User>(configuration)
        {
            /// <summary>
            ///     Задать конфигурацию для модели.
            /// </summary>
            /// <param name="builder">Набор интерфейсов настройки модели.</param>
            public override void Configure(EntityTypeBuilder<User> builder)
            {
                builder.Property(group => group.Username)
                    .HasMaxLength(TitleLengthMax);
                base.Configure(builder);
            }
        }

        #endregion

        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Profile { get; set; } = "";
        public List<Post>? Posts { get; set; } = [];

        void PasswordHasher(string Password)
        {
            if (Password.Length < 10) throw new Exception("Слишком короткий пароль") ;
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(Password, 8);
        }
        bool Verify(string Password) { return BCrypt.Net.BCrypt.EnhancedVerify(Password, PasswordHash); }
        // Добавить защиту от перебора(если начинается перебор, то добавитб ограничение(ожидание 30 сек каждые 5 попыток)
    }
}

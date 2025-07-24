using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DevLore.EntitiesLibrary.Data;
using DevLore.EntitiesLibrary.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        //User(string Username, string password)
        //{
        //    Hash_password = BCrypt.Net.BCrypt.HashPassword(password);
        //    Posts = new List<Post>();
        //    this.Username = Username;
        //}
        //public void changePassword(string verPassword, string password)
        //{
        //    if (BCrypt.Net.BCrypt.HashPassword(verPassword) == Hash_password)
        //        Hash_password = BCrypt.Net.BCrypt.HashPassword(password);
        //}


    }
}

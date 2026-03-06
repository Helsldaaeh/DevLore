using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DevLore.EntitiesLibrary.Data;
using DevLore.EntitiesLibrary.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Identity;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class Role : IdentifiableEntity
    {

        /*                   __ _                       _   _
       *   ___ ___  _ __  / _(_) __ _ _   _ _ __ __ _| |_(_) ___  _ __
       *  / __/ _ \| '_ \| |_| |/ _` | | | | '__/ _` | __| |/ _ \| '_ \
       * | (_| (_) | | | |  _| | (_| | |_| | | | (_| | |_| | (_) | | | |
       *  \___\___/|_| |_|_| |_|\__, |\__,_|_|  \__,_|\__|_|\___/|_| |_|
       *                        |___/
       * ���������, �������� ������� ������������ �����
       * � ����������� ������.
       */

        #region Configuration



        public const int TitleLengthMax = 256;
        public const int PassLengthMax = 256;
        public const int ProfileLengthMax = 256;

        /// <summary>
        ///     ������������ ������ <see cref="Group" />.
        /// </summary>
        /// <param name="configuration">������������ ���� ������.</param>
        public class Configuration(BaseConfiguration configuration) : Configuration<Role>(configuration)
        {
            /// <summary>
            ///     ������ ������������ ��� ������.
            /// </summary>
            /// <param name="builder">����� ����������� ��������� ������.</param>
            public override void Configure(EntityTypeBuilder<Role> builder)
            {
                base.Configure(builder);
            }
        }

        #endregion

    public string Name;

        // �������� ������ �� ��������(���� ���������� �������, �� �������� �����������(�������� 30 ��� ������ 5 �������)
    }
}
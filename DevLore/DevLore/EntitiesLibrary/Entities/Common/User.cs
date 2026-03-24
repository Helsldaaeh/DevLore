using BCrypt.Net;
using DevLore.EntitiesLibrary.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class User : IdentifiableEntity
    {
        #region Configuration
        public const int UsernameLengthMax = 256;
        public const int PasswordHashLengthMax = 256;
        public const int ProfileLengthMax = 1024;
        public const int EmailLengthMax = 256;

        public class Configuration(BaseConfiguration configuration) : Configuration<User>(configuration)
        {
            public override void Configure(EntityTypeBuilder<User> builder)
            {
                builder.Property(u => u.Username)
                    .HasMaxLength(UsernameLengthMax)
                    .IsRequired();
                builder.Property(u => u.PasswordHash)
                    .HasMaxLength(PasswordHashLengthMax)
                    .IsRequired();
                builder.Property(u => u.Profile)
                    .HasMaxLength(ProfileLengthMax);
                builder.Property(u => u.Email)
                    .HasMaxLength(EmailLengthMax)
                    .IsRequired();

                builder.HasOne(u => u.Role)
                    .WithMany()
                    .HasForeignKey(u => u.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasMany(u => u.Posts)
                    .WithOne(p => p.User)
                    .HasForeignKey(p => p.UserId);
                builder.HasMany(u => u.Reactions)
                    .WithOne(r => r.User)
                    .HasForeignKey(r => r.UserId);
                builder.HasMany(u => u.Comments)
                    .WithOne(c => c.User)
                    .HasForeignKey(c => c.UserId);

                builder.HasMany(u => u.Followings)
                    .WithOne(f => f.User)
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                builder.HasMany(u => u.Followers)
                    .WithOne(f => f.FollowedUser)
                    .HasForeignKey(f => f.FollowedUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasIndex(u => u.Username).IsUnique();
                builder.HasIndex(u => u.Email).IsUnique();

                base.Configure(builder);
            }
        }
        #endregion

        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Profile { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public Role? Role { get; set; }

        public List<Post>? Posts { get; set; }
        public List<Reaction>? Reactions { get; set; }
        public List<Comment>? Comments { get; set; }
        public List<Follow>? Followings { get; set; }
        public List<Follow>? Followers { get; set; }

        public void SetPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Пароль не может быть пустым", nameof(password));
            if (password.Length < 8)
                throw new ArgumentException("Пароль должен быть не менее 8 символов", nameof(password));
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return false;
            return BCrypt.Net.BCrypt.Verify(password, PasswordHash);
        }
    }
}
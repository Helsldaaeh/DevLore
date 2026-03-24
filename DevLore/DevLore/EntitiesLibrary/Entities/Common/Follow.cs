using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DevLore.EntitiesLibrary.Data;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class Follow : IdentifiableEntity
    {
        #region Configuration
        public class Configuration(BaseConfiguration configuration) : Configuration<Follow>(configuration)
        {
            public override void Configure(EntityTypeBuilder<Follow> builder)
            {
                builder.Property(f => f.UserId).IsRequired();
                builder.Property(f => f.FollowedUserId).IsRequired();

                builder.HasOne(f => f.User)
                    .WithMany(u => u.Followings)
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(f => f.FollowedUser)
                    .WithMany(u => u.Followers)
                    .HasForeignKey(f => f.FollowedUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasIndex(f => new { f.UserId, f.FollowedUserId }).IsUnique();

                base.Configure(builder);
            }
        }
        #endregion

        public int UserId { get; set; }
        public User? User { get; set; }
        public int FollowedUserId { get; set; }
        public User? FollowedUser { get; set; }
        public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    }
}
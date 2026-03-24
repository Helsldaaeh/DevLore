using DevLore.EntitiesLibrary.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public enum ReactionType
    {
        Like = 1,
        Dislike = 2
    }

    public class Reaction : IdentifiableEntity
    {
        #region Configuration
        public class Configuration(BaseConfiguration configuration) : Configuration<Reaction>(configuration)
        {
            public override void Configure(EntityTypeBuilder<Reaction> builder)
            {
                builder.Property(r => r.Type)
                    .IsRequired()
                    .HasDefaultValue(ReactionType.Like);

                builder.HasOne(r => r.User)
                    .WithMany(u => u.Reactions)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(r => r.Post)
                    .WithMany(p => p.Reactions)
                    .HasForeignKey(r => r.PostId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired(false);

                builder.HasOne(r => r.Comment)
                    .WithMany()
                    .HasForeignKey(r => r.CommentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired(false);

                builder.HasIndex(r => r.UserId);
                builder.HasIndex(r => r.PostId);
                builder.HasIndex(r => r.CommentId);
                builder.HasIndex(r => new { r.UserId, r.PostId, r.CommentId }).IsUnique();

                base.Configure(builder);
            }
        }
        #endregion

        public ReactionType Type { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? PostId { get; set; }
        public Post? Post { get; set; }
        public int? CommentId { get; set; }
        public Comment? Comment { get; set; }
    }
}
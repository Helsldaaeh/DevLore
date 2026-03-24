using DevLore.EntitiesLibrary.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public class Comment : IdentifiableEntity
    {
        #region Configuration
        public const int ContentLengthMax = 500;

        public class Configuration(BaseConfiguration configuration) : Configuration<Comment>(configuration)
        {
            public override void Configure(EntityTypeBuilder<Comment> builder)
            {
                builder.Property(c => c.Content)
                    .HasMaxLength(ContentLengthMax)
                    .IsRequired();
                builder.Property(c => c.UserId).IsRequired();
                builder.Property(c => c.PostId).IsRequired();

                builder.HasOne(c => c.User)
                    .WithMany(u => u.Comments)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(c => c.Post)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(c => c.PostId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.ParentComment)
                    .WithMany(c => c.Replies)
                    .HasForeignKey(c => c.ParentCommentId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(c => c.UserId);
                builder.HasIndex(c => c.PostId);
                builder.HasIndex(c => c.ParentCommentId);

                base.Configure(builder);
            }
        }
        #endregion

        public User User { get; set; } = null!;
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; } = null!;
        public int? ParentCommentId { get; set; }
        public Comment? ParentComment { get; set; }
        public List<Comment>? Replies { get; set; }
    }
}
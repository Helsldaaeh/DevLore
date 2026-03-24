using DevLore.EntitiesLibrary.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLore.EntitiesLibrary.Entities.Common
{
    public enum PostType
    {
        Text = 0,
        Interactive = 1
    }

    public class Post : IdentifiableEntity
    {
        #region Configuration
        public const int ContentLength = 2048;

        public class Configuration(BaseConfiguration configuration) : Configuration<Post>(configuration)
        {
            public override void Configure(EntityTypeBuilder<Post> builder)
            {
                builder.Property(p => p.Content)
                    .HasMaxLength(ContentLength)
                    .IsRequired();
                builder.Property(p => p.Type)
                    .HasDefaultValue(PostType.Text)
                    .IsRequired();

                builder.HasOne(p => p.User)
                    .WithMany(u => u.Posts)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(p => p.OriginalPost)
                    .WithMany()
                    .HasForeignKey(p => p.OriginalPostId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasMany(p => p.Tags)
                    .WithMany(t => t.Posts)
                    .UsingEntity(j => j.ToTable("PostTags"));

                builder.HasIndex(p => p.UserId);
                builder.HasIndex(p => p.OriginalPostId);

                base.Configure(builder);
            }
        }
        #endregion

        public int UserId { get; set; }
        public User? User { get; set; }
        public string Content { get; set; } = string.Empty;
        public PostType Type { get; set; } = PostType.Text;
        public int? OriginalPostId { get; set; }
        public Post? OriginalPost { get; set; }
        public List<Comment>? Comments { get; set; }
        public List<Reaction>? Reactions { get; set; }
        public List<Tag>? Tags { get; set; }
    }
}
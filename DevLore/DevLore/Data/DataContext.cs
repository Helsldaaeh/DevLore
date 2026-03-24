using DevLore.EntitiesLibrary.Entities.Common;
using Microsoft.EntityFrameworkCore;
using DevLore.EntitiesLibrary.Data;

namespace DevLore.Data
{
    public class DataContext(BaseConfiguration configuration) : DbContext
    {
        private BaseConfiguration Configuration { get; } = configuration;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            Configuration.ConfigureContext(optionsBuilder);
            base.OnConfiguring(optionsBuilder);
        }

        public async Task<bool> TryInitializeAsync()
        {
            try
            {
                await Database.MigrateAsync();

                // Создаём роль "User", если её нет
                if (!await Roles.AnyAsync())
                {
                    Roles.Add(new Role { Name = "User" });
                    await SaveChangesAsync();
                }

                return await Database.CanConnectAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Migration failed: {ex}");
                return false;
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new User.Configuration(Configuration));
            modelBuilder.ApplyConfiguration(new Post.Configuration(Configuration));
            modelBuilder.ApplyConfiguration(new Comment.Configuration(Configuration));
            modelBuilder.ApplyConfiguration(new Reaction.Configuration(Configuration));
            modelBuilder.ApplyConfiguration(new Tag.Configuration(Configuration));
            modelBuilder.ApplyConfiguration(new Follow.Configuration(Configuration));
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Reaction> Reactions => Set<Reaction>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Follow> Follows => Set<Follow>();
    }
}
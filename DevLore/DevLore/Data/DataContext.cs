﻿using DevLore.EntitiesLibrary.Data;
using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace DevLore.Data
{
    public class DataContext(BaseConfiguration configuration) : DbContext
    {
        private BaseConfiguration Configuration { get; } = configuration;

        /// <summary>
        ///     Обработать настройку сессии.
        /// </summary>
        /// <param name="optionsBuilder">Набор интерфейсов настройки сессии.</param>
        /// <exception cref="Exception">При ошибке подключения.</exception>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            Configuration.ConfigureContext(optionsBuilder);

            base.OnConfiguring(optionsBuilder);
        }

        /// <summary>
        ///     Попытаться асинхронно инициализировать сессию.
        ///     Используется для проверки подключения
        ///     и инициализации структуры таблиц.
        /// </summary>
        /// <returns>Статус успешности инициализации.</returns>
        public async Task<bool> TryInitializeAsync()
        {
            try
            {
                await Database.MigrateAsync();
                return await Database.CanConnectAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Migration failed: {ex}");
                return false;
            }
        }

        /// <summary>
        ///     Обработать инициализацию модели.
        ///     Используется для дополнительной настройки модели.
        /// </summary>
        /// <param name="modelBuilder">Набор интерфейсов настройки модели.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EntitiesLibrary.Entities.Security.User>().ToTable("AspNetUsers");
            modelBuilder.ApplyConfiguration(new User.Configuration(Configuration));
            modelBuilder.ApplyConfiguration(new Post.Configuration(Configuration));
            base.OnModelCreating(modelBuilder);
        }
        public DbSet<User> Users => Set<User>();
        public DbSet<Post> Posts => Set<Post>();
    }
}





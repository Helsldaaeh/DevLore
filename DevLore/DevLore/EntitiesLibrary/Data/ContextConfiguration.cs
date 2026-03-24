using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace DevLore.EntitiesLibrary.Data
{
    public class ContextConfiguration(string connectionString, string serviceName) : BaseConfiguration
    {
        public string ConnectionString { get; } = connectionString;
        public string ServiceName { get; } = serviceName;

        internal override string DateTimeType => "timestamp";
        internal override string DateTimeValueCurrent => "current_timestamp";

        public override void ConfigureContext(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(ConnectionString, x => x.MigrationsHistoryTable($"__{ServiceName}MigrationsHistory"));
            optionsBuilder.EnableSensitiveDataLogging();
            optionsBuilder.ConfigureWarnings(builder => builder.Throw(RelationalEventId.MultipleCollectionIncludeWarning));
            optionsBuilder.LogTo(Console.WriteLine, LogLevel.Information);
        }
    }
}
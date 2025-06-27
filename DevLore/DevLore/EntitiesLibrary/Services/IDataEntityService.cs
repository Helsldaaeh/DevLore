using DevLore.EntitiesLibrary.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLore.EntitiesLibrary.Services
{
    public interface IDataEntityService<T> where T : IdentifiableEntity
    {
        Task<IEnumerable<T>> Get(DbSet<T> dbSet, List<int> ids);
        Task<bool> Set(DbSet<T> dbSet, List<T> entities);
        Task<bool> Remove(DbSet<T> dbSet, List<int> ids);
    }
}

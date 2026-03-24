using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Services;
using DevLore.Data;

namespace DevLore.Services
{
    public class RoleService(DataContext dataContext) : DataEntityService<Role>(dataContext) { }
}
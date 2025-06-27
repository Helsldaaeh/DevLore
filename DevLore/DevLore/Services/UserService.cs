using DevLore.Data;
using DevLore.EntitiesLibrary.Services;
using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.Services
{
    public class UserService(DataContext dataContext) : DataEntityService<User>(dataContext)
    {
    }
}

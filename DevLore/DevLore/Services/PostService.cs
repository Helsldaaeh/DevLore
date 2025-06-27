using DevLore.Data;
using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Services;

namespace DevLore.Services
{
    public class PostService(DataContext dataContext) : DataEntityService<Post>(dataContext)
    {
    }
}

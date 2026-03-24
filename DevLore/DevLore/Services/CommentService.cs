using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Services;
using DevLore.Data;

namespace DevLore.Services
{
    public class CommentService(DataContext dataContext) : DataEntityService<Comment>(dataContext) { }
}